// ============================================================
// FYP PORTAL — Coordinator Portal JavaScript
// Covers: dashboard, groups, proposals, assignments,
//         evaluations, messages, announcements, reports
// ============================================================

// ── Auth Guard ───────────────────────────────────────────────
const _coordUser = AUTH.requireRole('coordinator');
if (_coordUser) initTopbar(_coordUser);

// ── Sidebar ──────────────────────────────────────────────────
let _coordCollapsed = false;

window.toggleSidebar = function () {
  _coordCollapsed = !_coordCollapsed;
  document.getElementById('sidebar')?.classList.toggle('collapsed', _coordCollapsed);
  document.getElementById('mainWrap')?.classList.toggle('expanded', _coordCollapsed);
  const ico = document.getElementById('collapseIcon');
  const lt  = document.getElementById('sidebarLogoText');
  if (ico) ico.className = _coordCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  if (lt)  lt.style.display = _coordCollapsed ? 'none' : '';
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
  const colors = { success: '#059669', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
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
const _cDateEl = document.getElementById('currentDate');
if (_cDateEl) {
  _cDateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// ── Page-Specific Logic ──────────────────────────────────────
const _cPage = window.location.pathname.split('/').pop();

// ═══════════════════════════════════════════
//  COORDINATOR DASHBOARD
// ═══════════════════════════════════════════
if (_cPage === 'dashboard.html' || _cPage === '') {

  // Approve proposal inline (used in dashboard quick-review)
  window.approveProposal = function (btn, groupId) {
    const row = btn.closest('.proposal-row');
    if (row) {
      const btnsEl = row.querySelector('div:last-child');
      if (btnsEl) btnsEl.innerHTML = `<span class="chip chip-success"><span class="chip-dot"></span>Approved</span>`;
    }
    showToast(`✅ Proposal for ${groupId} approved! Coordinator notified.`, 'success');
  };

  // Animate stat counters
  document.querySelectorAll('.stat-card-value').forEach(el => {
    const val = parseInt(el.textContent);
    if (!isNaN(val) && val > 0) {
      let current = 0;
      const step  = Math.ceil(val / 20);
      const timer = setInterval(() => {
        current = Math.min(current + step, val);
        el.textContent = current;
        if (current >= val) clearInterval(timer);
      }, 40);
    }
  });
}

// ═══════════════════════════════════════════
//  GROUPS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'groups.html') {
  // All group JS is inline in groups.html due to DATA dependency
  // This file provides the shared utilities (toast, modal, sidebar)
}

// ═══════════════════════════════════════════
//  PROPOSALS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'proposals.html') {
  // All proposal JS is inline in proposals.html due to DATA dependency
}

// ═══════════════════════════════════════════
//  ASSIGNMENTS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'assignments.html') {
  // All assignment JS is inline in assignments.html due to DATA dependency
}

// ═══════════════════════════════════════════
//  EVALUATIONS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'evaluations.html') {

  // Schedule an evaluation phase (shared helper)
  window.submitEvalSchedule = function () {
    const phase    = document.getElementById('evalPhaseSelect')?.value;
    const start    = document.getElementById('evalStartDate')?.value;
    const end      = document.getElementById('evalEndDate')?.value;
    if (!start || !end) { showToast('Please set start and end dates.', 'error'); return; }
    closeModal('evalScheduleModal');
    showToast(`✅ ${phase || 'Evaluation'} scheduled (${start} → ${end}). Groups notified.`, 'success');
  };

  // Assign evaluator helper
  window.submitEvaluatorAssignment = function () {
    const group = document.getElementById('evalGroupSel')?.value;
    const eval1 = document.getElementById('evalPrimarySelect')?.value;
    if (!eval1) { showToast('Please select a primary evaluator.', 'error'); return; }
    closeModal('assignEvaluatorModal');
    showToast(`✅ ${eval1} assigned${group ? ' to ' + group : ''}. Notification sent.`, 'success');
  };
}

// ═══════════════════════════════════════════
//  MESSAGES PAGE
// ═══════════════════════════════════════════
if (_cPage === 'messages.html') {
  // All messaging JS is inline in messages.html due to conversational state

  // New message submit helper
  window.sendNewMessage = function () {
    const to      = document.querySelector('#newMsgModal select')?.value;
    const subject = document.querySelector('#newMsgModal input[type=text]')?.value.trim();
    const body    = document.querySelector('#newMsgModal textarea')?.value.trim();
    if (!body) { showToast('Please type a message.', 'error'); return; }
    closeModal('newMsgModal');
    showToast('✅ Message sent successfully!', 'success');
  };
}

// ═══════════════════════════════════════════
//  ANNOUNCEMENTS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'announcements.html') {
  // All announcement CRUD JS is inline due to DATA dependency
  // Shared: modal, toast, confirmAction available
}

// ═══════════════════════════════════════════
//  REPORTS PAGE
// ═══════════════════════════════════════════
if (_cPage === 'reports.html') {

  window.downloadReport = function (name) {
    showToast(`📥 Downloading "${name}"… Your browser will save the file shortly.`, 'info');
  };

  // Custom report generator
  window.generateCustomReport = function () {
    const type   = document.querySelector('#customReportModal select')?.value;
    const format = document.querySelector('#customReportModal [name=fmt]:checked')?.parentElement?.textContent?.trim();
    closeModal('customReportModal');
    showToast(`📊 "${type}" generated as ${format || 'PDF'}. Downloading now…`, 'success');
  };

  // Semester selector
  const semSelect = document.querySelector('.filter-select');
  if (semSelect) {
    semSelect.addEventListener('change', function () {
      showToast(`📂 Switched to ${this.value} data. Refreshing charts…`, 'info');
    });
  }
}
