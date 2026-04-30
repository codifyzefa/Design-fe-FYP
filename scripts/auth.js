// FYP PORTAL — Central Authentication & Session Manager
// Version: 2.0  |  All roles: student, supervisor, coordinator, evaluator
// ============================================================

// ── User Database ────────────────────────────────────────────
const FYP_USERS = [
  {
    id: 'S001', role: 'Student', name: 'Ahmed Farooq',
    email: 'student@cuiatd.edu.pk', password: 'Student@123',
    regNo: 'SP21-BCS-001', department: 'Computer Science',
    semester: '8th', avatar: 'AF',
    profileCompleted: false, // Set to false to trigger profile update flow
    group: {
      id: 'G-042',
      title: 'AI-Powered Traffic Management System Using Computer Vision',
      members: 3, progress: 25, phase: 'proposal',
      supervisor: 'Dr. Ali Hassan'
    }
  },
  {
    id: 'F001', role: 'Faculty Supervisor', name: 'Dr. Ali Hassan',
    email: 'supervisor@cuiatd.edu.pk', password: 'Super@123',
    designation: 'Associate Professor',
    department: 'Computer Science',
    specialization: 'Artificial Intelligence · Machine Learning · Computer Vision',
    office: 'CS-205', officeHours: 'Mon–Wed  10:00 AM – 12:00 PM',
    phone: '+92-992-383591', avatar: 'AH', projects: 4
  },
  {
    id: 'C001', role: 'FYP Office', name: 'Dr. Sara Malik',
    email: 'coordinator@cuiatd.edu.pk', password: 'Coord@123',
    designation: 'FYP Coordinator · Senior Lecturer',
    department: 'Computer Science', avatar: 'SM'
  },
  {
    id: 'E001', role: 'Evaluator', name: 'Dr. Usman Qureshi',
    email: 'evaluator@cuiatd.edu.pk', password: 'Eval@123',
    designation: 'External Evaluator · Associate Professor',
    department: 'Computer Science', avatar: 'UQ'
  }
];

// ── Role → Home Page Map ─────────────────────────────────────
const ROLE_HOME = {
  'Student': 'student/dashboard.html',
  'Faculty Supervisor': 'supervisor/dashboard.html',
  'FYP Office': 'coordinator/dashboard.html',
  'System Administrator': 'admin/dashboard.html',
  'Industry Supervisor': 'industry/dashboard.html',
  'HOD': 'hod/dashboard.html'
};

// ── AUTH Object ──────────────────────────────────────────────
const AUTH = {

  /** Validate credentials and save session */
  login(email, password) {
    // In real app, we would validate credentials here.
    // For demo purposes, we will accept any valid email format and create a mock session
    // if it matches our demo users, otherwise create a generic one.
    
    let u = FYP_USERS.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (!u) {
        // Mock user creation for any valid email during demo
        const role = document.getElementById('roleSelect') ? document.getElementById('roleSelect').value : 'Student';
        u = {
            id: 'MOCK',
            role: role,
            name: email.split('@')[0].toUpperCase(),
            email: email,
            avatar: email.charAt(0).toUpperCase(),
            profileCompleted: false
        };
    }

    const session = { ...u };
    delete session.password;
    localStorage.setItem('fyp_user', JSON.stringify(session));
    return session;
  },

  /** Clear session and redirect to login */
  logout() {
    localStorage.removeItem('fyp_user');
    const root = this._rootPath();
    window.location.replace(root + 'login.html');
  },

  /** Get current user object (or null) */
  getUser() {
    try { return JSON.parse(localStorage.getItem('fyp_user')); } catch { return null; }
  },

  /** Update user session */
  updateUser(data) {
    const u = this.getUser();
    if(u) {
        const updated = { ...u, ...data };
        localStorage.setItem('fyp_user', JSON.stringify(updated));
        return updated;
    }
    return null;
  },

  /** Returns true if someone is logged in */
  isLoggedIn() { return !!this.getUser(); },

  /**
   * Guard: if not logged in or wrong role → redirect to login.
   * Returns user object on success.
   */
  requireRole(role) {
    const u = this.getUser();
    if (!u) {
      window.location.replace(this._rootPath() + 'login.html');
      return null;
    }
    if (role && u.role !== role) {
      window.location.replace(this._rootPath() + 'login.html');
      return null;
    }
    return u;
  },

  /** On login page: redirect away if already logged in */
  redirectIfLoggedIn() {
    const u = this.getUser();
    if (!u) return;
    
    if (u.role === 'Student' && !u.profileCompleted) {
        window.location.replace('student/profile.html');
        return;
    }

    const home = ROLE_HOME[u.role];
    if (home) window.location.replace(home);
  },

  /** Compute relative root path based on current URL depth */
  _rootPath() {
    if (
      window.location.pathname.includes('/supervisor/') ||
      window.location.pathname.includes('/coordinator/') ||
      window.location.pathname.includes('/evaluator/') ||
      window.location.pathname.includes('/student/')
    ) return '../';
    return '';
  }
};

// ── Topbar Population ────────────────────────────────────────
function initTopbar(user) {
  if (!user) return;

  // Name
  document.querySelectorAll('.user-name, .user-dropdown-name')
    .forEach(el => { el.textContent = user.name; });

  // Role label
  document.querySelectorAll('.user-role, .user-dropdown-role')
    .forEach(el => { el.textContent = user.role; });

  // Avatar (initials)
  document.querySelectorAll('.user-avatar')
    .forEach(el => { el.textContent = user.avatar || user.name.slice(0, 2).toUpperCase(); });

  // Date
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
    });
  }
}

// ── Global Logout Handlers ───────────────────────────────────

/** Called from sidebar/nav: ask confirmation then logout */
window.doLogout = function(e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to sign out?')) AUTH.logout();
};

/** Alias for pages using 'confirmLogout' (student portal) */
window.confirmLogout = window.doLogout;
