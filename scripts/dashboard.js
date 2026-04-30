// ============================================================
<<<<<<< HEAD
// FYP PORTAL — Shared Dashboard JS (Student portal)
// ============================================================

// ── Auth Guard ────────────────────────────
const _user = AUTH.requireRole('student');
if (_user) initTopbar(_user);

// ── Sidebar Collapse ─────────────────────
let _collapsed = false;
window.toggleSidebar = function() {
  _collapsed = !_collapsed;
  const s   = document.getElementById('sidebar');
  const mw  = document.getElementById('mainWrap');
  const ico = document.getElementById('collapseIcon');
  const lt  = document.getElementById('sidebarLogoText');
  [s,mw].forEach(el => el?.classList.toggle('collapsed', _collapsed));
  mw?.classList.toggle('expanded', _collapsed);
  if (ico) ico.className = _collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  if (lt)  lt.style.display = _collapsed ? 'none' : '';
};

// ── Mobile Sidebar ───────────────────────
window.openMobileSidebar = function() {
=======
// FYP PORTAL — Student Portal JavaScript
// Covers: dashboard, proposal, supervisor, progress,
//         milestones, evaluation, submissions, reports
// ============================================================

// ── Auth Guard ───────────────────────────────────────────────
const _studentUser = AUTH.requireRole('student');
if (_studentUser) initTopbar(_studentUser);

// ── Sidebar ──────────────────────────────────────────────────
let _sidebarCollapsed = false;

window.toggleSidebar = function () {
  _sidebarCollapsed = !_sidebarCollapsed;
  document.getElementById('sidebar')?.classList.toggle('collapsed', _sidebarCollapsed);
  document.getElementById('mainWrap')?.classList.toggle('expanded', _sidebarCollapsed);
  const ico = document.getElementById('collapseIcon');
  const lt  = document.getElementById('sidebarLogoText');
  if (ico) ico.className = _sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  if (lt)  lt.style.display = _sidebarCollapsed ? 'none' : '';
};

window.openMobileSidebar = function () {
>>>>>>> a0526ac (Change Design)
  document.getElementById('sidebar')?.classList.add('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
};
<<<<<<< HEAD
window.closeMobileSidebar = function() {
=======
window.closeMobileSidebar = function () {
>>>>>>> a0526ac (Change Design)
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
};

<<<<<<< HEAD
// ── Dropdowns ────────────────────────────
window.toggleNotifications = function() {
  document.getElementById('notifDropdown')?.classList.toggle('open');
  document.getElementById('userDropdown')?.classList.remove('open');
};
window.toggleUserMenu = function() {
=======
// ── Dropdowns ────────────────────────────────────────────────
window.toggleNotifications = function () {
  document.getElementById('notifDropdown')?.classList.toggle('open');
  document.getElementById('userDropdown')?.classList.remove('open');
};
window.toggleUserMenu = function () {
>>>>>>> a0526ac (Change Design)
  document.getElementById('userDropdown')?.classList.toggle('open');
  document.getElementById('notifDropdown')?.classList.remove('open');
};
document.addEventListener('click', e => {
  if (!document.getElementById('notifWrap')?.contains(e.target))
    document.getElementById('notifDropdown')?.classList.remove('open');
  if (!document.getElementById('userWrap')?.contains(e.target))
    document.getElementById('userDropdown')?.classList.remove('open');
});

<<<<<<< HEAD
// ── Logout ────────────────────────────────
window.confirmLogout = function(e) { e.preventDefault(); if(confirm('Sign out?')) AUTH.logout(); };

// ── Current Date ──────────────────────────
const _d = document.getElementById('currentDate');
if (_d) _d.textContent = new Date().toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'});
=======
// ── Logout ───────────────────────────────────────────────────
window.confirmLogout = function (e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to sign out?')) AUTH.logout();
};

// ── Toast Notification ───────────────────────────────────────
window.showToast = function (msg, type = 'success') {
  const colors = { success: '#059669', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
  const icons  = {
    success: 'fa-check-circle', error: 'fa-times-circle',
    info: 'fa-info-circle',     warning: 'fa-exclamation-triangle'
  };
  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed;bottom:1.5rem;right:1.5rem;',
    `background:white;border-left:4px solid ${colors[type]};`,
    'border-radius:1rem;padding:.85rem 1.25rem;',
    'box-shadow:0 8px 32px rgba(0,0,0,.14);',
    'display:flex;align-items:center;gap:.75rem;',
    "font-family:'Poppins',sans-serif;font-size:.82rem;font-weight:600;",
    'color:#111827;z-index:9999;max-width:360px;',
    'animation:scaleIn .2s ease-out;'
  ].join('');
  t.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1rem;flex-shrink:0"></i>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = '.3s ease';
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
    setTimeout(() => t.remove(), 320);
  }, 3500);
};

// ── Modal Helpers ─────────────────────────────────────────────
window.openModal  = id => document.getElementById(id)?.classList.add('open');
window.closeModal = id => document.getElementById(id)?.classList.remove('open');

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── Current Date ─────────────────────────────────────────────
const _dateEl = document.getElementById('currentDate');
if (_dateEl) {
  _dateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// ── Page-Specific Logic ──────────────────────────────────────

const _page = window.location.pathname.split('/').pop();

// ═══════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════
if (_page === 'dashboard.html' || _page === '') {
  // Greet user
  const title = document.querySelector('.welcome-banner-title');
  if (title && _studentUser) {
    const hr = new Date().getHours();
    const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    title.textContent = `${greeting}, ${_studentUser.name.split(' ')[0]}! 👋`;
  }

  // Animate progress bar on load
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const pct = parseInt(bar.style.width) || 25;
    bar.style.width = '0';
    setTimeout(() => { bar.style.transition = 'width 1.2s ease'; bar.style.width = pct + '%'; }, 300);
  }
}

// ═══════════════════════════════════════════
//  PROPOSAL PAGE
// ═══════════════════════════════════════════
if (_page === 'proposal.html') {

  // Character counters for textareas
  document.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const id   = ta.id;
    const max  = parseInt(ta.getAttribute('maxlength'));
    const counter = document.getElementById(id + '_count');
    if (!counter) return;
    ta.addEventListener('input', () => {
      counter.textContent = ta.value.length + '/' + max;
      counter.style.color = ta.value.length > max * 0.9 ? '#dc2626' : '';
    });
  });

  // Save draft
  window.saveDraft = function () {
    const btn = document.getElementById('saveDraftBtn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) { btn.innerHTML = '<i class="fas fa-save"></i> Saved!'; btn.style.color = '#059669'; }
      showToast('💾 Draft saved successfully.', 'info');
      setTimeout(() => {
        if (btn) { btn.innerHTML = '<i class="fas fa-save"></i> Save Draft'; btn.disabled = false; btn.style.color = ''; }
      }, 2000);
    }, 800);
  };

  // Submit proposal
  window.submitProposal = function () {
    const title = document.getElementById('projectTitle')?.value.trim();
    const abstract = document.getElementById('abstract')?.value.trim();
    if (!title || !abstract) {
      showToast('Please fill in all required fields before submitting.', 'error'); return;
    }
    if (confirm('Submit your FYP proposal? This will be sent to the coordinator for review.\n\nYou can still make changes until it is approved.')) {
      showToast('✅ Proposal submitted! The coordinator will review it shortly.', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    }
  };

  // Member remove buttons
  document.querySelectorAll('.remove-member-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (confirm('Remove this group member?')) {
        this.closest('.member-row')?.remove();
        showToast('Member removed.', 'info');
      }
    });
  });
}

// ═══════════════════════════════════════════
//  PROGRESS LOGS PAGE
// ═══════════════════════════════════════════
if (_page === 'progress.html') {

  // Filter logs by status
  window.filterLogs = function (status, btn) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn?.classList.add('active');
    document.querySelectorAll('.log-card').forEach(card => {
      const s = card.dataset.status;
      card.style.display = (!status || status === 'all' || s === status) ? '' : 'none';
    });
  };

  // Add new progress log
  window.submitLog = function () {
    const week    = document.getElementById('logWeek')?.value;
    const summary = document.getElementById('logSummary')?.value.trim();
    const hrs     = document.getElementById('logHours')?.value;
    if (!summary) { showToast('Please add a summary for this log.', 'error'); return; }
    closeModal('addLogModal');
    showToast('✅ Progress log submitted for supervisor review.', 'success');
    // Reset form
    ['logWeek','logSummary','logHours','logChallenges','logNext'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };
}

// ═══════════════════════════════════════════
//  MILESTONES PAGE
// ═══════════════════════════════════════════
if (_page === 'milestones.html') {

  // Mark milestone complete toggle
  document.querySelectorAll('.milestone-complete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card    = this.closest('.milestone-card');
      const isD     = card?.classList.contains('done');
      const label   = this.querySelector('span');
      if (isD) {
        card.classList.remove('done');
        if (label) label.textContent = 'Mark Complete';
        showToast('Milestone marked as incomplete.', 'info');
      } else {
        card.classList.add('done');
        if (label) label.textContent = 'Completed ✓';
        showToast('🎉 Milestone marked as complete!', 'success');
      }
      updateMilestoneProgress();
    });
  });

  function updateMilestoneProgress() {
    const total = document.querySelectorAll('.milestone-card').length;
    const done  = document.querySelectorAll('.milestone-card.done').length;
    const pct   = Math.round((done / total) * 100);
    const bar   = document.querySelector('.milestone-overall-bar');
    const label = document.querySelector('.milestone-overall-pct');
    if (bar)   bar.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
  }

  // Request custom milestone
  window.requestMilestone = function () {
    const title = document.getElementById('customMilestoneTitle')?.value.trim();
    if (!title) { showToast('Please enter a milestone title.', 'error'); return; }
    closeModal('requestMilestoneModal');
    showToast('✅ Custom milestone request sent to supervisor.', 'success');
  };
}

// ═══════════════════════════════════════════
//  SUPERVISOR PAGE (student view)
// ═══════════════════════════════════════════
if (_page === 'supervisor.html') {

  // Request meeting
  window.requestMeeting = function () {
    const date    = document.getElementById('meetingDate')?.value;
    const time    = document.getElementById('meetingTime')?.value;
    const topic   = document.getElementById('meetingTopic')?.value.trim();
    if (!date || !topic) { showToast('Please fill in the date and topic.', 'error'); return; }
    closeModal('meetingModal');
    showToast(`✅ Meeting request sent for ${date}${time ? ' at ' + time : ''}. Awaiting supervisor confirmation.`, 'success');
  };

  // Send message to supervisor
  window.sendMessage = function () {
    const msg = document.getElementById('messageContent')?.value.trim();
    if (!msg) { showToast('Please type a message.', 'error'); return; }
    closeModal('messageModal');
    showToast('✅ Message sent to Dr. Ali Hassan.', 'success');
  };
}

// ═══════════════════════════════════════════
//  SUBMISSIONS PAGE
// ═══════════════════════════════════════════
if (_page === 'submissions.html') {

  // File upload zones — drag & drop + click
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const input = zone.querySelector('input[type=file]');
    const label = zone.querySelector('.upload-zone-label');

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(zone, file, label);
    });
    zone.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => {
      if (input.files[0]) handleUpload(zone, input.files[0], label);
    });
  });

  function handleUpload(zone, file, labelEl) {
    if (!file.name.match(/\.(pdf|doc|docx|ppt|pptx|zip)$/i)) {
      showToast('Only PDF, DOC, PPT, and ZIP files are allowed.', 'error'); return;
    }
    // Show progress simulation
    zone.classList.add('uploading');
    const size = (file.size / (1024 * 1024)).toFixed(2);
    if (labelEl) labelEl.textContent = `Uploading ${file.name}…`;
    setTimeout(() => {
      zone.classList.remove('uploading');
      zone.classList.add('uploaded');
      if (labelEl) labelEl.innerHTML = `<i class="fas fa-check-circle" style="color:#059669"></i> ${file.name} (${size} MB) — Uploaded`;
      showToast(`✅ "${file.name}" uploaded successfully.`, 'success');
    }, 1400);
  }
}

// ═══════════════════════════════════════════
//  EVALUATION PAGE (student view)
// ═══════════════════════════════════════════
if (_page === 'evaluation.html') {
  // Animate score bars on load
  document.querySelectorAll('[data-score-bar]').forEach(bar => {
    const target = parseInt(bar.dataset.scoreBar) || 0;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1.4s cubic-bezier(.22,1,.36,1)';
      bar.style.width = target + '%';
    }, 400);
  });
}

// ═══════════════════════════════════════════
//  REPORTS PAGE
// ═══════════════════════════════════════════
if (_page === 'reports.html') {
  window.downloadReport = function (name) {
    showToast(`📥 Downloading "${name}"…`, 'info');
  };
}
>>>>>>> a0526ac (Change Design)
