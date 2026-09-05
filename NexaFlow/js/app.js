const APP = {
  currentUser: null,
  currentPage: 'dashboard',

  init() {
    this.loadTheme();
    this.loadUser();
    this.setupSearch();
    this.setupMobileMenu();
    this.updateNotificationCount();
    this.setupNavigation();
  },

  loadUser() {
    const user = localStorage.getItem('nexaflow_user');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.updateUserUI();
    } else if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('NexaFlow/') && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('register.html')) {
      // Allow access, but user should login
    }
  },

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem('nexaflow_user', JSON.stringify(user));
    this.updateUserUI();
  },

  updateUserUI() {
    const nameEl = document.getElementById('sidebarUserName');
    const emailEl = document.getElementById('sidebarUserEmail');
    const avatarEl = document.getElementById('sidebarUserAvatar');
    if (this.currentUser) {
      if (nameEl) nameEl.textContent = this.currentUser.name || 'User';
      if (emailEl) emailEl.textContent = this.currentUser.email || 'user@email.com';
      if (avatarEl) avatarEl.textContent = (this.currentUser.name || 'U').charAt(0).toUpperCase();
    }
  },

  loadTheme() {
    const theme = localStorage.getItem('nexaflow_theme') || 'default';
    const darkMode = localStorage.getItem('nexaflow_dark') === 'true';
    if (theme !== 'default') document.documentElement.setAttribute('data-theme', theme);
    if (darkMode) document.body.classList.add('dark-mode');
    const toggles = document.querySelectorAll('#darkModeToggle');
    toggles.forEach(t => t.checked = darkMode);
  },

  setTheme(theme) {
    if (theme === 'default') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexaflow_theme', theme);
  },

  toggleDarkMode(enabled) {
    if (enabled) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('nexaflow_dark', enabled);
  },

  setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) return;
        this.showToast(`Searching for "${query}"...`, 'info');
      });
    }
  },

  setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  },

  setupNavigation() {
    const currentPage = document.body.getAttribute('data-page');
    if (currentPage) {
      document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
      });
    }
  },

  updateNotificationCount() {
    const notifs = JSON.parse(localStorage.getItem('nexaflow_notifications') || '[]');
    const unread = notifs.filter(n => !n.read).length;
    document.querySelectorAll('.notif-badge-count').forEach(el => {
      el.textContent = unread;
      el.style.display = unread > 0 ? 'flex' : 'none';
    });
  },

  getProjects() {
    const defaults = [
      { id: 1, name: 'Website Redesign', desc: 'Complete overhaul of the company website with modern design', color: '#6366f1', icon: '🌐', progress: 75, members: ['A', 'B', 'C'], tasks: 12, completed: 9, status: 'active', created: '2026-08-15' },
      { id: 2, name: 'Mobile App v2', desc: 'Build the next generation mobile application', color: '#10b981', icon: '📱', progress: 45, members: ['D', 'E'], tasks: 20, completed: 9, status: 'active', created: '2026-08-20' },
      { id: 3, name: 'Marketing Campaign', desc: 'Q4 marketing strategy and execution plan', color: '#f59e0b', icon: '📢', progress: 30, members: ['F', 'G', 'H', 'I'], tasks: 8, completed: 2, status: 'active', created: '2026-09-01' },
      { id: 4, name: 'API Integration', desc: 'Integrate third-party APIs and services', color: '#ef4444', icon: '🔌', progress: 60, members: ['A', 'J'], tasks: 15, completed: 9, status: 'active', created: '2026-08-10' }
    ];
    const stored = localStorage.getItem('nexaflow_projects');
    if (!stored) { localStorage.setItem('nexaflow_projects', JSON.stringify(defaults)); return defaults; }
    return JSON.parse(stored);
  },

  saveProjects(projects) {
    localStorage.setItem('nexaflow_projects', JSON.stringify(projects));
  },

  getTasks() {
    const defaults = [
      { id: 1, title: 'Design homepage wireframe', status: 'todo', priority: 'high', tag: 'Design', tagColor: '#8b5cf6', date: 'Sep 5', assignee: 'A', assigneeColor: '#6366f1', projectId: 1 },
      { id: 2, title: 'Set up CI/CD pipeline', status: 'todo', priority: 'medium', tag: 'DevOps', tagColor: '#06b6d4', date: 'Sep 6', assignee: 'B', assigneeColor: '#10b981', projectId: 4 },
      { id: 3, title: 'Write API documentation', status: 'todo', priority: 'low', tag: 'Docs', tagColor: '#f59e0b', date: 'Sep 8', assignee: 'C', assigneeColor: '#f59e0b', projectId: 4 },
      { id: 4, title: 'Implement user authentication', status: 'progress', priority: 'high', tag: 'Backend', tagColor: '#ef4444', date: 'Sep 3', assignee: 'D', assigneeColor: '#ef4444', projectId: 1 },
      { id: 5, title: 'Create component library', status: 'progress', priority: 'medium', tag: 'Frontend', tagColor: '#3b82f6', date: 'Sep 4', assignee: 'E', assigneeColor: '#3b82f6', projectId: 1 },
      { id: 6, title: 'Database optimization', status: 'review', priority: 'high', tag: 'Backend', tagColor: '#ef4444', date: 'Sep 2', assignee: 'F', assigneeColor: '#10b981', projectId: 2 },
      { id: 7, title: 'User testing sessions', status: 'review', priority: 'medium', tag: 'UX', tagColor: '#ec4899', date: 'Sep 7', assignee: 'G', assigneeColor: '#ec4899', projectId: 2 },
      { id: 8, title: 'Setup project repository', status: 'done', priority: 'low', tag: 'DevOps', tagColor: '#06b6d4', date: 'Sep 1', assignee: 'H', assigneeColor: '#06b6d4', projectId: 3 },
      { id: 9, title: 'Design system tokens', status: 'done', priority: 'medium', tag: 'Design', tagColor: '#8b5cf6', date: 'Sep 1', assignee: 'I', assigneeColor: '#8b5cf6', projectId: 3 },
      { id: 10, title: 'Performance benchmarking', status: 'done', priority: 'high', tag: 'Backend', tagColor: '#ef4444', date: 'Aug 30', assignee: 'J', assigneeColor: '#ef4444', projectId: 4 },
      { id: 11, title: 'Responsive layout fixes', status: 'todo', priority: 'medium', tag: 'Frontend', tagColor: '#3b82f6', date: 'Sep 9', assignee: 'A', assigneeColor: '#6366f1', projectId: 1 },
      { id: 12, title: 'Security audit', status: 'progress', priority: 'high', tag: 'Security', tagColor: '#ef4444', date: 'Sep 5', assignee: 'B', assigneeColor: '#ef4444', projectId: 4 }
    ];
    const stored = localStorage.getItem('nexaflow_tasks');
    if (!stored) { localStorage.setItem('nexaflow_tasks', JSON.stringify(defaults)); return defaults; }
    return JSON.parse(stored);
  },

  saveTasks(tasks) {
    localStorage.setItem('nexaflow_tasks', JSON.stringify(tasks));
  },

  getNotifications() {
    const defaults = [
      { id: 1, title: 'New task assigned', message: 'You have been assigned "Design homepage wireframe" in Website Redesign project', icon: '📋', iconBg: 'rgba(99,102,241,0.15)', iconColor: '#6366f1', time: '5 min ago', read: false },
      { id: 2, title: 'Project milestone reached', message: 'Mobile App v2 has reached 45% completion', icon: '🎯', iconBg: 'rgba(16,185,129,0.15)', iconColor: '#10b981', time: '1 hour ago', read: false },
      { id: 3, title: 'Comment on task', message: 'Sarah commented on "Implement user authentication": "Looks great!"', icon: '💬', iconBg: 'rgba(59,130,246,0.15)', iconColor: '#3b82f6', time: '2 hours ago', read: false },
      { id: 4, title: 'Deadline approaching', message: '"Database optimization" is due tomorrow', icon: '⏰', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b', time: '3 hours ago', read: true },
      { id: 5, title: 'Team member joined', message: 'Alex joined the Marketing Campaign project', icon: '👋', iconBg: 'rgba(139,92,246,0.15)', iconColor: '#8b5cf6', time: '5 hours ago', read: true },
      { id: 6, title: 'Task completed', message: '"Setup project repository" has been marked as done', icon: '✅', iconBg: 'rgba(16,185,129,0.15)', iconColor: '#10b981', time: '1 day ago', read: true }
    ];
    const stored = localStorage.getItem('nexaflow_notifications');
    if (!stored) { localStorage.setItem('nexaflow_notifications', JSON.stringify(defaults)); return defaults; }
    return JSON.parse(stored);
  },

  saveNotifications(notifs) {
    localStorage.setItem('nexaflow_notifications', JSON.stringify(notifs));
    this.updateNotificationCount();
  },

  getEvents() {
    const defaults = [
      { id: 1, title: 'Team Standup', date: '2026-09-02', time: '09:00 AM', color: '#6366f1' },
      { id: 2, title: 'Design Review', date: '2026-09-03', time: '02:00 PM', color: '#10b981' },
      { id: 3, title: 'Sprint Planning', date: '2026-09-05', time: '10:00 AM', color: '#f59e0b' },
      { id: 4, title: 'Client Meeting', date: '2026-09-08', time: '03:00 PM', color: '#ef4444' },
      { id: 5, title: 'Product Demo', date: '2026-09-10', time: '11:00 AM', color: '#8b5cf6' },
      { id: 6, title: 'Retrospective', date: '2026-09-12', time: '04:00 PM', color: '#06b6d4' },
      { id: 7, title: 'Code Review Session', date: '2026-09-15', time: '01:00 PM', color: '#ec4899' },
      { id: 8, title: 'Quarterly Planning', date: '2026-09-20', time: '09:00 AM', color: '#6366f1' }
    ];
    const stored = localStorage.getItem('nexaflow_events');
    if (!stored) { localStorage.setItem('nexaflow_events', JSON.stringify(defaults)); return defaults; }
    return JSON.parse(stored);
  },

  saveEvents(events) {
    localStorage.setItem('nexaflow_events', JSON.stringify(events));
  },

  getProfile() {
    const defaults = {
      name: 'John Doe',
      email: 'john@nexaflow.io',
      role: 'Product Manager',
      department: 'Engineering',
      location: 'San Francisco, CA',
      bio: 'Passionate about building great products and leading talented teams. 8+ years of experience in product management and agile methodologies.',
      phone: '+1 (555) 123-4567',
      joined: 'January 2024',
      avatar: null
    };
    const stored = localStorage.getItem('nexaflow_profile');
    if (!stored) { localStorage.setItem('nexaflow_profile', JSON.stringify(defaults)); return defaults; }
    return JSON.parse(stored);
  },

  saveProfile(profile) {
    localStorage.setItem('nexaflow_profile', JSON.stringify(profile));
    if (this.currentUser) {
      this.currentUser.name = profile.name;
      this.currentUser.email = profile.email;
      this.saveUser(this.currentUser);
    }
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || '✓'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; setTimeout(() => toast.remove(), 300); }, 3000);
  },

  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  logout() {
    localStorage.removeItem('nexaflow_user');
    this.currentUser = null;
    window.location.href = 'index.html';
  }
};

function showToast(message, type) { APP.showToast(message, type); }

document.addEventListener('DOMContentLoaded', () => APP.init());
