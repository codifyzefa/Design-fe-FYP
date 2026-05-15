// FYP Portal — Notifications Module
// Stores notifications in localStorage and renders dropdowns for current user
(function(){
  const KEY = 'fyp_notifications';
  const Notifications = {
    notifications: [],
    init() {
      this.load();
      this.renderDropdowns();
      this.bindUI();
      this.checkDeadlines();
      // Re-check deadlines every 6 hours
      setInterval(() => this.checkDeadlines(), 6 * 60 * 60 * 1000);
    },
    load() {
      try { this.notifications = JSON.parse(localStorage.getItem(KEY)) || []; } catch { this.notifications = []; }
    },
    save() { localStorage.setItem(KEY, JSON.stringify(this.notifications)); },
    add(n) {
      const user = AUTH.getUser() || {};
      const now = new Date().toISOString();
      const note = {
        id: 'n_' + Date.now() + '_' + Math.floor(Math.random()*9999),
        title: n.title || 'Notification',
        message: n.message || '',
        type: n.type || 'general',
        audience: n.audience || [], // e.g. ['Students'] or ['studentId']
        recipientId: n.recipientId || null,
        meta: n.meta || {},
        read: false,
        timestamp: n.timestamp || now
      };
      // avoid duplicates for same meta key
      if (n.dedupKey && this.notifications.some(x => x.meta && x.meta.dedupKey === n.dedupKey)) return;
      this.notifications.unshift(note);
      this.save();
      this.renderDropdowns();
      // show toast if relevant for current user
      const me = AUTH.getUser();
      if (me && this._isForUser(note, me)) showToast(note.title + ' — ' + (note.message || ''), 'info');
      return note;
    },
    _isForUser(note, user) {
      if (!user) return false;
      if (note.recipientId && note.recipientId === user.id) return true;
      if (Array.isArray(note.audience)) {
        if (note.audience.includes(user.role)) return true;
        // allow plural/singular fuzzy match
        if (note.audience.some(a => typeof a==='string' && a.toLowerCase().includes(user.role.toLowerCase().split(' ')[0]))) return true;
      }
      return false;
    },
    getForCurrentUser() {
      const me = AUTH.getUser();
      if (!me) return [];
      return this.notifications.filter(n => this._isForUser(n, me));
    },
    markAllRead() {
      const me = AUTH.getUser();
      if (!me) return;
      let changed = false;
      this.notifications.forEach(n => { if (this._isForUser(n, me) && !n.read) { n.read = true; changed = true; } });
      if (changed) { this.save(); this.renderDropdowns(); }
    },
    markRead(id) {
      const idx = this.notifications.findIndex(n=>n.id===id);
      if (idx!==-1) { this.notifications[idx].read = true; this.save(); this.renderDropdowns(); }
    },
    renderDropdowns() {
      const me = AUTH.getUser();
      const lists = document.querySelectorAll('.notif-list');
      lists.forEach(list => {
        const items = this.getForCurrentUser();
        if (!items || items.length === 0) {
          list.innerHTML = '<p style="padding:1rem;text-align:center;color:var(--color-text-faint);font-size:.8rem;">No notifications</p>';
          return;
        }
        list.innerHTML = items.map(n => {
          const unread = !n.read ? 'notif-unread' : '';
          const time = new Date(n.timestamp).toLocaleString();
          return `<div class="notif-item ${unread}" data-id="${n.id}" onclick="Notifications.markRead('${n.id}')">
            <div class="notif-icon notif-icon-info"><i class="fas fa-bell"></i></div>
            <div class="notif-body"><div class="notif-title">${n.title}</div><div class="notif-msg">${n.message}</div><div class="notif-time">${time}</div></div>
          </div>`;
        }).join('');
      });

      // update dot
      const hasUnread = this.getForCurrentUser().some(n => !n.read);
      document.querySelectorAll('.notif-dot').forEach(el => { el.style.display = hasUnread ? 'inline-block' : 'none'; });
    },
    bindUI() {
      document.querySelectorAll('.dropdown-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); this.markAllRead(); });
      });
    },
    // Deadline checks: scan TaskManager.tasks if available
    checkDeadlines() {
      const me = AUTH.getUser();
      if (!me) return;
      if (window.TaskManager && Array.isArray(TaskManager.tasks)) {
        const today = new Date();
        TaskManager.tasks.forEach(t => {
          if (!t.due) return;
          // match assignee by avatar or id or name fragment
          const assignees = t.assignees || [];
          const userMatches = assignees.some(a => a === me.avatar || a === me.id || (me.name && a === me.name.split(' ')[0]));
          if (!userMatches) return;
          const due = new Date(t.due + 'T00:00:00');
          const diffDays = Math.ceil((due - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000*60*60*24));
          if (diffDays === 7 || diffDays === 1) {
            const dedup = `deadline:${t.id}:${diffDays}`;
            // avoid duplicates
            if (this.notifications.some(n => n.meta && n.meta.dedupKey === dedup)) return;
            this.add({
              title: 'Deadline approaching',
              message: `Task "${t.title}" is due in ${diffDays} day(s) (${t.due}).`,
              type: 'deadline',
              audience: ['Students'],
              meta: { taskId: t.id, due: t.due, dedupKey: dedup }
            });
          }
        });
      }
    },

    // Convenience API for other modules (supervisor/coordinator) to call
    notifyProposalStatus(studentId, status) {
      this.add({ title: 'Proposal ' + status, message: `Your proposal has been ${status.toLowerCase()}.`, type: 'proposal', recipientId: studentId });
    },
    notifyReevaluation(studentId, status) {
      this.add({ title: 'Re-evaluation ' + (status === 'accepted' ? 'Accepted' : 'Denied'), message: `Your re-evaluation request was ${status}.`, type: 'reeval', recipientId: studentId });
    },
    notifyProjectAssigned(studentId, projectTitle) {
      this.add({ title: 'Supervisor Assigned', message: `You have been assigned to project: ${projectTitle}.`, type: 'assignment', recipientId: studentId });
    },
    notifyMeetingScheduled(audience, details) {
      this.add({ title: 'Meeting Scheduled', message: details, type: 'meeting', audience: audience || ['Students'] });
    },
    notifyTaskAssigned(studentId, task) {
      this.add({ title: 'Task Assigned', message: `Task "${task.title}" assigned. Due: ${task.due||'N/A'}.`, type: 'task', recipientId: studentId, meta: { taskId: task.id } });
    },
    notifyPresentationScheduled(audience, details) {
      this.add({ title: 'Presentation Scheduled', message: details, type: 'presentation', audience: audience || ['Students'] });
    },
    notifyMarksPublished(studentId, details) {
      this.add({ title: 'Marks Published', message: details, type: 'marks', recipientId: studentId });
    },
    notifyGrievanceUpdated(studentId, status) {
      this.add({ title: 'Grievance ' + status, message: `Your grievance status: ${status}.`, type: 'grievance', recipientId: studentId });
    }
  };

  window.Notifications = Notifications;
})();
