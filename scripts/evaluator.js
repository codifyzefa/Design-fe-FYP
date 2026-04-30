// ============================================================
// FYP PORTAL — Evaluator Portal JavaScript
// Covers: dashboard, evaluate, submitted, reports
// ============================================================

// ── Auth Guard ───────────────────────────────────────────────
const _evalUser = AUTH.requireRole('evaluator');
if (_evalUser) initTopbar(_evalUser);

// ── Sidebar ──────────────────────────────────────────────────
let _evalCollapsed = false;

window.toggleSidebar = function () {
  _evalCollapsed = !_evalCollapsed;
  document.getElementById('sidebar')?.classList.toggle('collapsed', _evalCollapsed);
  document.getElementById('mainWrap')?.classList.toggle('expanded', _evalCollapsed);
  const ico = document.getElementById('collapseIcon');
  const lt  = document.getElementById('sidebarLogoText');
  if (ico) ico.className = _evalCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  if (lt)  lt.style.display = _evalCollapsed ? 'none' : '';
};

window.openMobileSidebar = function () {
  document.getElementById('sidebar')?.classList.add('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
};
window.closeMobileSidebar = function () {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
};

// ── Dropdowns ────────────────────────────────────────────────
window.toggleNotifications = function () {
  document.getElementById('notifDropdown')?.classList.toggle('open');
  document.getElementById('userDropdown')?.classList.remove('open');
};
window.toggleUserMenu = function () {
  document.getElementById('userDropdown')?.classList.toggle('open');
  document.getElementById('notifDropdown')?.classList.remove('open');
};
document.addEventListener('click', e => {
  if (!document.getElementById('notifWrap')?.contains(e.target))
    document.getElementById('notifDropdown')?.classList.remove('open');
  if (!document.getElementById('userWrap')?.contains(e.target))
    document.getElementById('userDropdown')?.classList.remove('open');
});

// ── Logout ───────────────────────────────────────────────────
window.doLogout     = function (e) { if (e) e.preventDefault(); if (confirm('Are you sure you want to sign out?')) AUTH.logout(); };
window.confirmLogout = window.doLogout;

// ── Toast ────────────────────────────────────────────────────
window.showToast = function (msg, type = 'success') {
  const colors = { success: '#059669', error: '#dc2626', info: '#0284c7', warning: '#d97706' };
  const icons  = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;background:white;border-left:4px solid ${colors[type]};border-radius:1rem;padding:.85rem 1.25rem;box-shadow:0 8px 32px rgba(0,0,0,.14);display:flex;align-items:center;gap:.75rem;font-family:'Poppins',sans-serif;font-size:.82rem;font-weight:600;color:#111827;z-index:9999;max-width:400px;animation:scaleIn .2s ease-out;`;
  t.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1rem;flex-shrink:0"></i>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.transition='.3s ease';t.style.opacity='0';t.style.transform='translateY(12px)'; setTimeout(()=>t.remove(),320); }, 3800);
};

// ── Modal Helpers ────────────────────────────────────────────
window.openModal  = id => document.getElementById(id)?.classList.add('open');
window.closeModal = id => document.getElementById(id)?.classList.remove('open');
window.confirmAction = (msg, fn) => { if (confirm(msg)) fn(); };

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── Current Date ─────────────────────────────────────────────
const _eDateEl = document.getElementById('currentDate');
if (_eDateEl) {
  _eDateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// ── Grade Calculator ─────────────────────────────────────────
function scoreToGrade(s) {
  if (s >= 90) return 'A+'; if (s >= 85) return 'A';
  if (s >= 80) return 'B+'; if (s >= 75) return 'B';
  if (s >= 70) return 'B−'; if (s >= 65) return 'C+';
  if (s >= 60) return 'C'; if (s > 0) return 'F'; return '—';
}

// ── Page-Specific Logic ──────────────────────────────────────
const _ePage = window.location.pathname.split('/').pop();

// ═══════════════════════════════════════════
//  EVALUATOR DASHBOARD
// ═══════════════════════════════════════════
if (_ePage === 'dashboard.html' || _ePage === '') {

  // Personalise banner greeting
  const bannerTitle = document.querySelector('.welcome-banner-title');
  if (bannerTitle && _evalUser) {
    bannerTitle.textContent = `Welcome, ${_evalUser.name}! 📋`;
  }

  // Animate stat values
  document.querySelectorAll('.stat-card-value').forEach(el => {
    const raw = el.textContent.trim();
    const val = parseInt(raw);
    if (!isNaN(val) && val > 1) {
      let current = 0;
      const step  = Math.ceil(val / 18);
      const timer = setInterval(() => {
        current = Math.min(current + step, val);
        el.textContent = raw.includes('/') ? `0 / ${val}` : current;
        if (current >= val) { el.textContent = raw; clearInterval(timer); }
      }, 45);
    }
  });
}

// ═══════════════════════════════════════════
//  EVALUATE PAGE (interactive rubric)
// ═══════════════════════════════════════════
if (_ePage === 'evaluate.html') {

  // Slider score live update (called from HTML oninput)
  window.updateScore = function (sliderId, displayId, max) {
    const val  = parseInt(document.getElementById(sliderId)?.value || 0);
    const disp = document.getElementById(displayId);
    if (disp) disp.textContent = val;

    // Update breakdown sidebar value
    const breakdownId = 'bv' + sliderId.replace('s', '');
    const bv = document.getElementById(breakdownId);
    if (bv) bv.textContent = val + '/' + max;

    // Colour the slider track
    const slider = document.getElementById(sliderId);
    if (slider) {
      const pct = (val / max) * 100;
      slider.style.background = `linear-gradient(to right, #0284c7 ${pct}%, #e5e7eb ${pct}%)`;
    }

    recalcEvalTotal();
  };

  function recalcEvalTotal() {
    let total = 0;
    document.querySelectorAll('.score-slider').forEach(s => { total += parseInt(s.value || 0); });
    const tsEl = document.getElementById('totalScore');
    const grEl = document.getElementById('gradeLabel');
    if (tsEl) tsEl.textContent = total;
    if (grEl) grEl.textContent = 'Grade: ' + scoreToGrade(total);
  }

  // Group selector
  window.selectGroup = function (btn, id, title, leader, supervisor, members) {
    document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const banTitle = document.getElementById('bannerTitle');
    const banMeta  = document.getElementById('bannerMeta');
    if (banTitle) banTitle.textContent = title;
    if (banMeta)  banMeta.textContent = `Group ${id} · Leader: ${leader} · Supervisor: ${supervisor}`;
    // Reset all sliders
    document.querySelectorAll('.score-slider').forEach((s, i) => {
      s.value = 0;
      s.style.background = '';
      const d = document.getElementById('d' + (i + 1));
      if (d) d.textContent = '0';
      const bv = document.getElementById('bv' + (i + 1));
      if (bv) bv.textContent = '0/' + [20,25,20,20,15][i];
    });
    recalcEvalTotal();
  };

  // Recommendation selection
  let _selectedRec = '';
  window.setRec = function (val, btn) {
    _selectedRec = val;
    document.querySelectorAll('.rec-btn').forEach(b => b.classList.remove('active'));
    btn?.classList.add('active');
  };

  // Submit evaluation
  window.submitEvaluation = function () {
    const total   = parseInt(document.getElementById('totalScore')?.textContent || 0);
    const remarks = document.getElementById('remarks')?.value.trim();
    if (total === 0) { showToast('Please score at least one criterion.', 'error'); return; }
    if (!remarks)    { showToast('Please add evaluation remarks before submitting.', 'error'); return; }
    if (confirm(`Submit evaluation — Score: ${total}/100 (${scoreToGrade(total)})?`)) {
      showToast(`✅ Evaluation submitted (${total}/100). Coordinator and student group notified.`, 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 2200);
    }
  };

  // Colour all sliders on init (so they start styled)
  document.querySelectorAll('.score-slider').forEach(s => {
    s.style.background = '#e5e7eb';
  });
}

// ═══════════════════════════════════════════
//  SUBMITTED EVALUATIONS PAGE
// ═══════════════════════════════════════════
if (_ePage === 'submitted.html') {

  window.viewSubmittedEval = function (groupId) {
    showToast(`📋 Opening evaluation details for ${groupId}…`, 'info');
  };

  window.downloadEvalReport = function (groupId) {
    showToast(`📥 Downloading evaluation report for ${groupId}…`, 'info');
  };
}

// ═══════════════════════════════════════════
//  EVALUATOR REPORTS PAGE
// ═══════════════════════════════════════════
if (_ePage === 'reports.html') {

  window.downloadReport = function (name) {
    showToast(`📥 Downloading "${name}"…`, 'info');
  };
}
