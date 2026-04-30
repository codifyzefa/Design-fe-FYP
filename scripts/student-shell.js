// ============================================================
// FYP PORTAL — Shared Sidebar/Topbar Renderer
// Usage: call renderStudentShell({ activePage, pageTitle }) in <body>
// ============================================================

window.STUDENT_NAV = [
  { id:'dashboard',   label:'Dashboard',    icon:'fa-home',         href:'../dashboard.html' },
  { id:'proposal',    label:'My Project',   icon:'fa-file-alt',     href:'../proposal.html', badge:'Pending', badgeType:'warning' },
  { id:'supervisor',  label:'Supervisor',   icon:'fa-user-tie',     href:'../supervisor.html' },
  { id:'progress',    label:'Progress Logs',icon:'fa-chart-line',   href:'../progress.html' },
  { id:'milestones',  label:'Milestones',   icon:'fa-flag',         href:'../milestones.html' },
  { id:'evaluation',  label:'Evaluations',  icon:'fa-star',         href:'../evaluation.html' },
  { id:'submissions', label:'Submissions',  icon:'fa-upload',       href:'../submissions.html' },
  { id:'reports',     label:'Reports',      icon:'fa-file-download',href:'../reports.html' },
];

window.renderStudentShell = function({ activePage = 'dashboard', pageTitle = 'Dashboard', pageSubtitle = '' } = {}) {
  const navHTML = STUDENT_NAV.map(item => {
    const isActive = item.id === activePage;
    const badge = item.badge ? `<span class="nav-badge nav-badge-${item.badgeType || 'info'}">${item.badge}</span>` : '';
    return `<a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}" data-label="${item.label}">
      <i class="fas ${item.icon} nav-item-icon"></i>
      <span class="nav-item-label">${item.label}</span>${badge}
    </a>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon"><i class="fas fa-graduation-cap"></i></div>
          <div class="sidebar-logo-text" id="sidebarLogoText">
            <div class="sidebar-title">CUI DFYP</div>
            <div class="sidebar-role">Student Portal</div>
          </div>
        </div>
        <button class="sidebar-collapse-btn" id="collapseBtn" onclick="toggleSidebar()">
          <i class="fas fa-chevron-left" id="collapseIcon"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-group-label">Overview</div>
          ${navHTML.split('</a>').slice(0,2).join('</a>')}</a>
        </div>
        <div class="nav-group">
          <div class="nav-group-label">Management</div>
          ${navHTML.split('</a>').slice(2,5).join('</a>')}</a>
        </div>
        <div class="nav-group">
          <div class="nav-group-label">Evaluation</div>
          ${navHTML.split('</a>').slice(5).join('</a>')}
        </div>
      </nav>
      <div class="sidebar-footer">
        <a href="#" class="nav-item nav-item-logout" onclick="confirmLogout(event)">
          <i class="fas fa-right-from-bracket nav-item-icon"></i>
          <span class="nav-item-label">Logout</span>
        </a>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeMobileSidebar()"></div>

    <div class="main-wrap" id="mainWrap">
      <header class="topbar">
        <div class="topbar-left">
          <button class="topbar-menu-btn" onclick="openMobileSidebar()"><i class="fas fa-bars"></i></button>
          <div>
            <div class="topbar-page-title">${pageTitle}</div>
            <div class="topbar-subtitle">CUI Abbottabad · <span id="currentDate"></span></div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="phase-chip"><span class="phase-chip-dot"></span> Proposal Phase <span class="phase-chip-time">· 12d left</span></div>
          <div class="topbar-icon-btn-wrap" id="notifWrap">
            <button class="topbar-icon-btn" onclick="toggleNotifications()"><i class="fas fa-bell"></i><span class="notif-dot"></span></button>
            <div class="notifications-dropdown" id="notifDropdown">
              <div class="dropdown-header"><span class="dropdown-header-title">Notifications</span><button class="dropdown-action-btn">Mark all read</button></div>
              <div class="notif-list">
                <div class="notif-item notif-unread">
                  <div class="notif-icon notif-icon-info"><i class="fas fa-user-tie"></i></div>
                  <div class="notif-body"><div class="notif-title">Supervisor Assigned</div><div class="notif-msg">Dr. Ali Hassan has been assigned as your supervisor.</div><div class="notif-time">Today · 10:32 AM</div></div>
                </div>
                <div class="notif-item">
                  <div class="notif-icon notif-icon-warning"><i class="fas fa-clock"></i></div>
                  <div class="notif-body"><div class="notif-title">Proposal Deadline</div><div class="notif-msg">Your FYP proposal must be submitted by May 5, 2026.</div><div class="notif-time">Yesterday</div></div>
                </div>
              </div>
            </div>
          </div>
          <div class="topbar-icon-btn-wrap" id="userWrap">
            <button class="user-btn" onclick="toggleUserMenu()">
              <div class="user-avatar">AF</div>
              <div class="user-info hidden-sm"><div class="user-name">Ahmed Farooq</div><div class="user-role">Student</div></div>
              <i class="fas fa-chevron-down user-chevron hidden-sm"></i>
            </button>
            <div class="user-dropdown" id="userDropdown">
              <div class="user-dropdown-header"><div class="user-dropdown-name">Ahmed Farooq</div><div class="user-dropdown-role">Student · SP21-BCS-001</div></div>
              <hr class="dropdown-divider"/>
              <a href="../profile.html" class="user-dropdown-item"><i class="fas fa-user-circle"></i> My Profile</a>
              <hr class="dropdown-divider"/>
              <a href="#" class="user-dropdown-item user-dropdown-item-danger" onclick="confirmLogout(event)"><i class="fas fa-power-off"></i> Sign Out</a>
            </div>
          </div>
        </div>
      </header>
      <main class="content-area" id="contentArea">
  `);

  // Close the main-wrap/main after content
  document.addEventListener('DOMContentLoaded', () => {});
};
