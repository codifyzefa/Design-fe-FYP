// ============================================================
// FYP PORTAL — Supervisor Portal JavaScript
// Covers: dashboard, logs, projects, feedback, meetings, evaluate
// ============================================================

// ── Auth Guard ───────────────────────────────────────────────
const _supUser = AUTH.requireRole('supervisor');
if (_supUser) initTopbar(_supUser);

// ── Sidebar ──────────────────────────────────────────────────
let _supCollapsed = false;

window.toggleSidebar = function () {
  _supCollapsed = !_supCollapsed;
  document.getElementById('sidebar')?.classList.toggle('collapsed', _supCollapsed);
  document.getElementById('mainWrap')?.classList.toggle('expanded', _supCollapsed);
  const ico = document.getElementById('collapseIcon');
  const lt  = document.getElementById('sidebarLogoText');
  if (ico) ico.className = _supCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  if (lt)  lt.style.display = _supCollapsed ? 'none' : '';
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
window.doLogout = function (e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to sign out?')) AUTH.logout();
};
window.confirmLogout = window.doLogout;

// ── Toast ────────────────────────────────────────────────────
window.showToast = function (msg, type = 'success') {
  const colors = { success: '#059669', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
  const icons  = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed;bottom:1.5rem;right:1.5rem;',
    `background:white;border-left:4px solid ${colors[type]};`,
    'border-radius:1rem;padding:.85rem 1.25rem;',
    'box-shadow:0 8px 32px rgba(0,0,0,.14);',
    'display:flex;align-items:center;gap:.75rem;',
    "font-family:'Poppins',sans-serif;font-size:.82rem;font-weight:600;",
    'color:#111827;z-index:9999;max-width:380px;animation:scaleIn .2s ease-out;'
  ].join('');
  t.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1rem;flex-shrink:0"></i>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = '.3s ease'; t.style.opacity = '0'; t.style.transform = 'translateY(12px)';
    setTimeout(() => t.remove(), 320);
  }, 3600);
};

// ── Modal Helpers ────────────────────────────────────────────
window.openModal  = id => document.getElementById(id)?.classList.add('open');
window.closeModal = id => document.getElementById(id)?.classList.remove('open');
window.confirmAction = (msg, fn) => { if (confirm(msg)) fn(); };

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── Current Date ─────────────────────────────────────────────
const _supDateEl = document.getElementById('currentDate');
if (_supDateEl) {
  _supDateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// ── Page-Specific Logic ──────────────────────────────────────
const _supPage = window.location.pathname.split('/').pop();

// ═══════════════════════════════════════════
//  SUPERVISOR DASHBOARD
// ═══════════════════════════════════════════
if (_supPage === 'dashboard.html' || _supPage === '') {

  // Animate progress bars
  document.querySelectorAll('[data-prog]').forEach(bar => {
    const pct = parseInt(bar.dataset.prog) || 0;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.transition = 'width 1.2s ease'; bar.style.width = pct + '%'; }, 350);
  });

  // Quick Approve / Reject from dashboard pending actions
  window.quickApprove = function (btn, type, id) {
    const row   = btn.closest('[data-action-row]') || btn.parentElement;
    const badge = document.createElement('span');
    badge.className = 'chip chip-success';
    badge.innerHTML = '<span class="chip-dot"></span>Approved';
    row.innerHTML = '';
    row.appendChild(badge);
    showToast(`✅ ${type} for ${id} approved!`, 'success');
  };

  window.quickReject = function (btn, type, id) {
    confirmAction(`Reject this ${type} from ${id}?`, () => {
      const row   = btn.closest('[data-action-row]') || btn.parentElement;
      const badge = document.createElement('span');
      badge.className = 'chip chip-danger';
      badge.innerHTML = '<span class="chip-dot"></span>Rejected';
      row.innerHTML = '';
      row.appendChild(badge);
      showToast(`${type} for ${id} rejected.`, 'error');
    });
  };
}

// ═══════════════════════════════════════════
//  PROGRESS LOGS REVIEW (supervisor)
// ═══════════════════════════════════════════
if (_supPage === 'logs.html') {

  // Tab switching
  window.switchLogTab = function (tab, btn) {
    document.querySelectorAll('.log-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.log-tab-btn').forEach(b => b.classList.remove('active'));
    btn?.classList.add('active');
    const el = document.getElementById('logTab-' + tab);
    if (el) el.style.display = '';
  };

  // Approve a log card
  window.approveLog = function (btn, groupId, week) {
    const card = btn.closest('.log-review-card');
    if (!card) return;
    card.style.background = '#f0fdf4';
    card.style.borderColor = '#86efac';
    const footer = card.querySelector('.log-footer');
    if (footer) footer.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;color:#059669;font-weight:700;font-size:.8rem">
        <i class="fas fa-check-circle"></i> Approved by you — ${new Date().toLocaleDateString()}
      </div>`;
    showToast(`✅ Week ${week} log for ${groupId} approved!`, 'success');
  };

  // Request revision on a log
  window.requestLogRevision = function (btn, groupId, week) {
    const feedback = document.getElementById(`feedback-${groupId}-${week}`)?.value.trim();
    if (!feedback) { showToast('Please add feedback before requesting revision.', 'error'); return; }
    const card = btn.closest('.log-review-card');
    if (card) { card.style.background = '#fffbeb'; card.style.borderColor = '#fde68a'; }
    showToast(`↩️ Revision requested for ${groupId} Week ${week}. Student notified.`, 'warning');
  };

  // Filter logs by group
  window.filterByGroup = function (groupId) {
    document.querySelectorAll('.log-review-card').forEach(card => {
      card.style.display = (!groupId || card.dataset.group === groupId) ? '' : 'none';
    });
  };
}

// ═══════════════════════════════════════════
//  SUPERVISOR EVALUATE PAGE
// ═══════════════════════════════════════════
if (_supPage === 'evaluate.html') {

  // Slider live score updates
  window.updateScore = function (sliderId, displayId, max) {
    const val = parseInt(document.getElementById(sliderId)?.value || 0);
    const disp = document.getElementById(displayId);
    if (disp) disp.textContent = val;
    const bv = document.getElementById('bv-' + sliderId);
    if (bv) bv.textContent = `${val}/${max}`;
    recalcTotal();
  };

  function recalcTotal() {
    let total = 0;
    document.querySelectorAll('.score-slider').forEach(s => { total += parseInt(s.value || 0); });
    const tsEl = document.getElementById('totalScore');
    if (tsEl) tsEl.textContent = total;
    const gradeEl = document.getElementById('gradeLabel');
    if (gradeEl) gradeEl.textContent = 'Grade: ' + scoreToGrade(total);
  }

  function scoreToGrade(s) {
    if (s >= 90) return 'A+'; if (s >= 85) return 'A';
    if (s >= 80) return 'B+'; if (s >= 75) return 'B';
    if (s >= 70) return 'B−'; if (s >= 65) return 'C+';
    if (s >= 60) return 'C'; if (s > 0) return 'F'; return '—';
  }

  window.submitEvaluation = function () {
    const total   = parseInt(document.getElementById('totalScore')?.textContent || 0);
    const remarks = document.getElementById('remarks')?.value.trim();
    if (!remarks) { showToast('Please add evaluation remarks before submitting.', 'error'); return; }
    if (total === 0) { showToast('Please score at least one criterion.', 'error'); return; }
    if (confirm(`Submit evaluation with score ${total}/100 (${scoreToGrade(total)})? This cannot be undone.`)) {
      showToast(`✅ Evaluation submitted — Score: ${total}/100. Coordinator notified.`, 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 2200);
    }
  };
}

// ═══════════════════════════════════════════
//  SUPERVISOR MEETINGS PAGE
// ═══════════════════════════════════════════
if (_supPage === 'meetings.html') {

  window.confirmMeeting = function (btn, group) {
    btn.parentElement.innerHTML = `<span class="chip chip-success"><span class="chip-dot"></span>Confirmed</span>`;
    showToast(`✅ Meeting with ${group} confirmed!`, 'success');
  };

  window.declineMeeting = function (btn, group) {
    confirmAction(`Decline meeting request from ${group}?`, () => {
      btn.parentElement.innerHTML = `<span class="chip chip-danger"><span class="chip-dot"></span>Declined</span>`;
      showToast(`Meeting request from ${group} declined.`, 'info');
    });
  };

  window.scheduleMeeting = function () {
    const group = document.getElementById('meetGroup')?.value;
    const date  = document.getElementById('meetDate')?.value;
    const time  = document.getElementById('meetTime')?.value;
    if (!group || !date) { showToast('Please select group and date.', 'error'); return; }
    closeModal('newMeetingModal');
    showToast(`✅ Meeting scheduled with ${group} on ${date}${time ? ' at ' + time : ''}.`, 'success');
  };
}

// ═══════════════════════════════════════════
//  SUPERVISOR FEEDBACK PAGE
// ═══════════════════════════════════════════
if (_supPage === 'feedback.html') {

  window.submitFeedback = function () {
    const group    = document.getElementById('fbGroup')?.value;
    const category = document.getElementById('fbCategory')?.value;
    const content  = document.getElementById('fbContent')?.value.trim();
    if (!content) { showToast('Please write feedback before submitting.', 'error'); return; }
    closeModal('newFeedbackModal');
    showToast(`✅ Feedback sent to ${group || 'group'} (${category}).`, 'success');
  };
}

// ═══════════════════════════════════════════
//  SUPERVISOR PROJECTS PAGE
// ═══════════════════════════════════════════
if (_supPage === 'projects.html') {

  window.viewGroupDetail = function (groupId) {
    showToast(`Opening details for ${groupId}…`, 'info');
  };

  window.sendGroupMessage = function (groupId) {
    openModal('groupMsgModal');
    const titleEl = document.getElementById('groupMsgTitle');
    if (titleEl) titleEl.textContent = `Message to ${groupId}`;
  };

  window.sendGroupMessageSubmit = function () {
    const msg = document.getElementById('groupMsgContent')?.value.trim();
    if (!msg) { showToast('Please type a message.', 'error'); return; }
    closeModal('groupMsgModal');
    showToast('✅ Message sent to the group.', 'success');
  };
}
