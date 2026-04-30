/**
 * FYP Portal — Task Manager Module
 * ClickUp-inspired task management with localStorage persistence.
 */

const TaskManager = {
  tasks: [],
  STORAGE_KEY: 'fyp_tasks',
  columns: ['To Do', 'In Progress', 'Completed'],

  init() {
    this.loadTasks();
    this.renderBoard();
    this.setupEventListeners();
  },

  loadTasks() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.tasks = JSON.parse(data);
    } else {
      // Demo initial tasks
      this.tasks = [
        { id: 't1', title: 'Literature Review', desc: 'Read and summarize 5 recent papers.', priority: 'Medium', due: '2026-05-10', assignees: ['AF'], status: 'To Do' },
        { id: 't2', title: 'Write Proposal Draft', desc: 'Draft the introduction and problem statement.', priority: 'High', due: '2026-05-03', assignees: ['AF'], status: 'In Progress' }
      ];
      this.saveTasks();
    }
  },

  saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  },

  addTask(task) {
    task.id = 'task_' + Date.now();
    this.tasks.push(task);
    this.saveTasks();
    this.renderBoard();
  },

  updateTask(id, updates) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx] = { ...this.tasks[idx], ...updates };
      this.saveTasks();
      this.renderBoard();
    }
  },

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.renderBoard();
    }
  },

  moveTask(id, newStatus) {
    this.updateTask(id, { status: newStatus });
  },

  getTask(id) {
    return this.tasks.find(t => t.id === id);
  },

  renderBoard() {
    this.columns.forEach(col => {
      const colId = col.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`board-col-${colId}`);
      const countEl = document.getElementById(`count-${colId}`);
      if (!container) return;
      
      container.innerHTML = '';
      const filtered = this.tasks.filter(t => t.status === col);
      if (countEl) countEl.textContent = filtered.length;

      filtered.forEach(task => {
        container.appendChild(this.createTaskCard(task));
      });
    });
  },

  createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card animate-scale-in';
    card.setAttribute('draggable', 'true');
    card.dataset.id = task.id;

    // Check if overdue
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.due && task.due < today && task.status !== 'Completed';
    const dueClass = isOverdue ? 'overdue' : (task.status === 'Completed' ? 'completed' : '');
    const dueIcon = isOverdue ? 'fa-exclamation-circle' : (task.status === 'Completed' ? 'fa-check-double' : 'fa-calendar-alt');
    
    let priorityColor = '#9ca3af'; // Low
    if (task.priority === 'High') priorityColor = '#ef4444';
    if (task.priority === 'Medium') priorityColor = '#f59e0b';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="task-title">${task.title}</div>
        <div class="task-actions-menu">
           <i class="fas fa-ellipsis-h text-muted" style="cursor:pointer;" onclick="TaskManager.openEditModal('${task.id}')"></i>
        </div>
      </div>
      <div class="task-desc">${task.desc || ''}</div>
      <div style="margin-bottom:var(--space-2); display:flex; gap:4px;">
         <span style="font-size:0.6rem; padding:2px 6px; border-radius:4px; background:${priorityColor}20; color:${priorityColor}; font-weight:700;">${task.priority}</span>
      </div>
      <div class="task-meta">
        <div class="task-date ${dueClass}"><i class="fas ${dueIcon}"></i> ${task.due || 'No date'}</div>
        <div class="task-assignees">
          ${(task.assignees || []).map(a => `<div class="task-avatar">${a}</div>`).join('')}
        </div>
      </div>
    `;

    // Drag events
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', task.id);
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    return card;
  },

  setupEventListeners() {
    // Drop zones
    this.columns.forEach(col => {
      const colId = col.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`board-col-${colId}`);
      if (!container) return;

      container.addEventListener('dragover', e => {
        e.preventDefault();
        container.classList.add('drag-over');
      });

      container.addEventListener('dragleave', e => {
        container.classList.remove('drag-over');
      });

      container.addEventListener('drop', e => {
        e.preventDefault();
        container.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
          this.moveTask(taskId, col);
        }
      });
    });

    // Form submission
    const form = document.getElementById('taskForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('taskId').value;
        const task = {
          title: document.getElementById('taskTitle').value,
          desc: document.getElementById('taskDesc').value,
          priority: document.getElementById('taskPriority').value,
          due: document.getElementById('taskDue').value,
          status: document.getElementById('taskStatus').value,
          assignees: ['AF'] // Hardcoded for demo
        };

        if (id) {
          this.updateTask(id, task);
        } else {
          this.addTask(task);
        }
        this.closeModal();
      });
    }
  },

  openModal() {
    document.getElementById('taskModal').classList.add('show');
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskModalTitle').textContent = 'Add New Task';
    const delBtn = document.getElementById('btnDeleteTask');
    if(delBtn) delBtn.style.display = 'none';
  },

  openEditModal(id) {
    const task = this.getTask(id);
    if (!task) return;
    document.getElementById('taskModal').classList.add('show');
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.desc;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDue').value = task.due;
    document.getElementById('taskStatus').value = task.status;
    
    const delBtn = document.getElementById('btnDeleteTask');
    if(delBtn) delBtn.style.display = 'block';
  },

  handleDelete() {
    const id = document.getElementById('taskId').value;
    if(id) {
        this.deleteTask(id);
        this.closeModal();
    }
  },

  closeModal() {
    document.getElementById('taskModal').classList.remove('show');
  }
};

window.addEventListener('DOMContentLoaded', () => TaskManager.init());
