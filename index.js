const tabButtons = document.querySelectorAll('.main2 button');

const tabContent = {
  software: {
    heading: "Focus on outcomes, not admin",
    description: "Plan, track, and release world-class software with Jira's powerful agile tools.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/3m35263c8gy137p68p2v33ijxb0703p5.webp"
  },
  operations: {
    heading: "Conquer complex workflows",
    description: "Streamline operations and keep your business running smoothly with Jira.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/8mbx11md7br33n86667to5e4q87x8dfl.webp"
  },
  hr: {
    heading: "Build teamwork and productivity across your organization with Jira",
    description: "Manage hiring, onboarding, and employee requests all in one place.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/o3vf21711xl7j3k661enul0050252c02.webp"
  },
  allteams: {
    heading: "Where your teams and AI come together",
    description: "One platform for every team — from engineering to marketing and beyond.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/wdmncs35471g5521yr5462w3ku0t834b.webp"
  },
  marketing: {
    heading: "Go from big idea to an even bigger launch",
    description: "Launch campaigns faster and keep creative projects on track.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/ox58yay38c0ps0rm5xeg0e2765128to3.webp"
  },
  designs: {
    heading: "Design with all the right context",
    description: "Manage design projects, feedback, and handoffs seamlessly.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/2s7dw8mxw65kwtjh2npm8x55200kcnu3.webp"
  },
  sales: {
    heading: "Hit sales team targets with Jira",
    description: "Track deals, manage pipelines, and close more with Jira.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/87h6hy3p184v1kyn202mov58b5y6q82d.webp"
  }
};

const tabKeys = ['software', 'operations', 'hr', 'allteams', 'marketing', 'designs', 'sales'];

const heroHeading = document.querySelector('.h1');
const heroImage = document.querySelector('.pic img');

tabButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    tabButtons.forEach(b => {
      b.style.backgroundColor = '';
      b.style.borderRadius = '25px';
    });

    btn.style.backgroundColor = '#cfe1fd';
    btn.style.borderRadius = '25px';

    const key = tabKeys[index];
    const content = tabContent[key];

    heroHeading.style.opacity = '0';
    heroImage.style.opacity = '0';

    setTimeout(() => {
      heroHeading.textContent = content.heading;
      heroImage.src = content.image;
      heroImage.style.opacity = '1';
      heroHeading.style.opacity = '1';
    }, 200);

  });
});

heroHeading.style.transition = 'opacity 0.2s ease';
heroImage.style.transition = 'opacity 0.2s ease';

const featureBtns = document.querySelectorAll('.bt11, .bt12, .bt13, .bt14');
const featurePanels = document.querySelectorAll('.tab-panel');

featurePanels.forEach((panel, i) => {
  panel.style.display = i === 0 ? 'block' : 'none';
});

if (featureBtns[0]) {
  featureBtns[0].style.backgroundColor = '#cfe1fd';
  featureBtns[0].style.color = '#1C2B42';
}

featureBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    featureBtns.forEach(b => {
      b.style.backgroundColor = '#FFFFFF';
      b.style.color = '#6b778c';
    });

    btn.style.backgroundColor = '#cfe1fd';
    btn.style.color = '#1C2B42';

    featurePanels.forEach(panel => {
      panel.style.opacity = '0';
      setTimeout(() => { panel.style.display = 'none'; }, 200);
    });

    setTimeout(() => {
      featurePanels[index].style.display = 'block';
      setTimeout(() => { featurePanels[index].style.opacity = '1'; }, 10);
    }, 200);

  });
});

featurePanels.forEach(panel => {
  panel.style.transition = 'opacity 0.2s ease';
});

const signupForm = document.querySelector('form[data-testid="account-creation"]');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email-uid1').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      alert('Please enter your email.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    signupForm.reset();
    document.getElementById('reg-email').value = email;
    showPage('register-page');
  });
}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const name = urlParams.get('name');
  const email = urlParams.get('email');

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ name, email }));

    window.history.replaceState({}, document.title, '/index.html');

    showPage('dashboard-page');
    document.getElementById('welcome-msg').textContent = `👋 ${name || email}`;
    loadColumns();
    loadTasks();
    loadUsers();
  }
});

const googleBtn = document.querySelector('.bt9');
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    const mockUser = { email: 'user@gmail.com', name: 'Google User', provider: 'google' };

    try {
      const res = await fetch('http://localhost:5000/api/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUser)
      });

      const data = await res.json();
      console.log('Response:', data); // check full response in console
      alert(data.message || 'Login successful!');

    } catch (err) {
      console.log('Error:', err);
      alert('Could not connect to server. Please try again.');
    }
  });
}

const microsoftBtn = document.querySelector('.bt10');
if (microsoftBtn) {
  microsoftBtn.addEventListener('click', async () => {
    const mockUser = { email: 'user@outlook.com', name: 'Microsoft User', provider: 'microsoft' };

    try {
      const res = await fetch('http://localhost:5000/api/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUser)
      });

      const data = await res.json();
      console.log('Response:', data); // check full response in console
      alert(data.message || 'Login successful!');

    } catch (err) {
      console.log('Error:', err);
      alert('Could not connect to server. Please try again.');
    }
  });
}

// ─── Page Navigation ──────────────────────────────────
function showPage(pageId) {
  // Hide all pages
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('root').style.display = 'none'; // hides landing page

  // Show the requested page
  document.getElementById(pageId).style.display = 'block';
}

function showLanding() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('root').style.display = 'block';
}

// ─── Check Login on Load ──────────────────────────────
window.addEventListener('load', async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('welcome-msg').textContent = `👋 ${user.name || user.email}`;
    showPage('dashboard-page');
    await loadColumns();
    await loadTasks();
    loadUsers();
    loadActivity();
    loadNotifications();
  }
  const modal = document.getElementById('task-modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }
});

// ─── Register ─────────────────────────────────────────
async function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorMsg = document.getElementById('reg-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  errorMsg.textContent = '';

  if (!name || !email || !password) { errorMsg.textContent = 'All fields are required.'; return; }
  if (name.length < 2) { errorMsg.textContent = 'Name must be at least 2 characters.'; return; }
  if (!emailRegex.test(email)) { errorMsg.textContent = 'Please enter a valid email address.'; return; }
  if (password.length < 6) { errorMsg.textContent = 'Password must be at least 6 characters.'; return; }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) { errorMsg.textContent = 'Password must contain at least one letter and one number.'; return; }

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('login-email').value = email;
      showPage('login-page');
    } else {
      errorMsg.textContent = data.message;
    }
  } catch (err) {
    errorMsg.textContent = 'Could not connect to server.';
  }
}

// ─── Login ────────────────────────────────────────────
async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('login-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  errorMsg.textContent = '';

  if (!email || !password) { errorMsg.textContent = 'All fields are required.'; return; }
  if (!emailRegex.test(email)) { errorMsg.textContent = 'Please enter a valid email address.'; return; }
  if (password.length < 6) { errorMsg.textContent = 'Password must be at least 6 characters.'; return; }

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.getElementById('welcome-msg').textContent = `👋 ${data.user.name || data.user.email}`;
      showPage('dashboard-page');
      await loadColumns();
      await loadTasks();
      loadUsers();
      loadActivity();
      loadNotifications();
    } else {
      errorMsg.textContent = data.message;
    }
  } catch (err) {
    errorMsg.textContent = 'Could not connect to server.';
  }
}

// ─── Logout ───────────────────────────────────────────
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showLanding();
}

// ─── Task Functions ───────────────────────────────────
// const token = localStorage.getItem('token');

let allTasks = [];
let currentCategory = 'All';
let currentPriority = 'all';

async function addTask() {
  const titleEl = document.getElementById('task-input');
  const priorityEl = document.getElementById('priority-select');
  const categoryEl = document.getElementById('category-select');
  const assignEl = document.getElementById('assign-select');

  if (!titleEl || !priorityEl || !categoryEl) {
    alert('Form elements not found.');
    return;
  }
  const title = titleEl.value.trim();
  const priority = priorityEl.options[priorityEl.selectedIndex].value;
  const category = categoryEl.options[categoryEl.selectedIndex].value;
  const assignedTo = assignEl ? assignEl.options[assignEl.selectedIndex].value : '';
  const assignedToName = assignEl ? assignEl.options[assignEl.selectedIndex].text : '';
  const assignedToEmail = assignEl ? assignEl.options[assignEl.selectedIndex].dataset.email || '' : '';

  if (!title) { alert('Please enter a task title.'); return; }
  if (title.length > 100) { alert('Task title cannot exceed 100 characters.'); return; }


  const currentToken = localStorage.getItem('token');
  try {
    await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ title, priority, category, assignedTo, assignedToName, assignedToEmail })
    });
    titleEl.value = '';
    loadTasks();
  } catch (err) {
    console.log('Error adding task:', err);
    alert('Could not add task. Please try again.');
  }
}

async function loadTasks() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/tasks', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    allTasks = await res.json();
    applyFilter();
  }
  catch (err) {
    console.log('Error loading tasks:', err);
  }
}

function renderTasks(tasks) {
  allTasksData = tasks;
  updateSummaryCards(allTasks);
  const cols = { todo: [], inprogress: [], done: [] };
  // tasks.forEach(task => cols[task.status].push(task));
  customColumns.forEach(col => { cols[col._id] = []; });

  tasks.forEach(task => {
    const key = task.customStatus && task.customStatus !== ''
      ? task.customStatus
      : task.status;
    if (cols[key] !== undefined) {
      cols[key].push(task);
    }
    else {
      cols['todo'].push(task);
    }
  });

  document.getElementById('todo-col').innerHTML = cols.todo.map(taskCard).join('');
  document.getElementById('inprogress-col').innerHTML = cols.inprogress.map(taskCard).join('');
  document.getElementById('done-col').innerHTML = cols.done.map(taskCard).join('');

  document.getElementById('todo-count').textContent = cols.todo.length;
  document.getElementById('inprogress-count').textContent = cols.inprogress.length;
  document.getElementById('done-count').textContent = cols.done.length;

  customColumns.forEach(col => {
    const colEl = document.getElementById(`tasks-${col._id}`);
    const countEl = document.getElementById(`count-${col._id}`);
    if (colEl) colEl.innerHTML = (cols[col._id] || []).map(taskCard).join('');
    if (countEl) countEl.textContent = (cols[col._id] || []).length;
  });
}


// Filter by category
function filterByCategory(category) {
  currentCategory = category;

  // Update button styles
  document.querySelectorAll('[id^="cat-"]').forEach(btn => {
    btn.style.background = 'white';
    btn.style.color = '#253858';
    btn.style.border = '1px solid #ddd';
  });
  const btnId = document.getElementById(`cat-${category.toLowerCase()}`);
  if (btnId) {
    btnId.style.background = 'dodgerblue';
    btnId.style.color = 'white';
    btnId.style.border = 'none';
  }

  currentPriority = 'all';
  document.querySelectorAll('[id^="pri-"]').forEach(btn => {
    btn.style.background = 'white';
    btn.style.border = '1px solid #ddd';
    btn.style.color = '';
  })
  const priAll = document.getElementById('pri-all');
  if (priAll) {
    priAll.style.background = 'dodgerblue';
    priAll.style.color = 'white';
    priAll.style.border = 'none';
  }
  applyFilter();
}

function filterByPriority(priority) {
  currentPriority = priority;

  document.querySelectorAll('[id^="pri-"]').forEach(btn => {
    btn.style.background = 'white';
    btn.style.border = '1px solid #ddd';
  });

  const btn = document.getElementById(`pri-${priority}`);
  if (btn) {
    if (priority === 'high') {
      btn.style.background = '#ffebe6';
      btn.style.border = '1px solid #de350b';
    }
    else if (priority === 'medium') {
      btn.style.background = '#fffae6'
      btn.style.border = '1px solid #ff8b00';
    }
    else if (priority === 'low') {
      btn.style.background = '#e3fcef';
      btn.style.border = '1px solid #006644'
    }
    else {
      btn.style.background = 'dodgerblue';
      btn.style.color = 'white';
      btn.style.border = 'none';
    }
  }
  applyFilter();
}

function filterMyTasks() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = user.name || user.email;

  document.querySelectorAll('[id^="cat-"]').forEach(btn => {
    btn.style.background = 'white';
    btn.style.color = '#253858';
    btn.style.border = '1px solid #ddd';
  });

  document.getElementById('cat-mytasks').style.background = 'dodgerblue';
  document.getElementById('cat-mytasks').style.color = 'white';
  document.getElementById('cat-mytasks').style.border = 'none';

  const myTasks = allTasks.filter(t =>
    t.assignedToName === currentUserName ||
    t.assignedToName === user.name ||
    t.assignedToName === user.email);
  renderTasks(myTasks);

  if (myTasks.length === 0) {
    document.getElementById('todo-col').innerHTML =
      '<p style="color:#5e6c84; font-size:14px; text-align:center; padding:20px;">No tasks assigned to you</p>';
    document.getElementById('inprogress-col').innerHTML = '';
    document.getElementById('done-col').innerHTML = '';
  }
}
// Apply current filter
function applyFilter() {
  let filtered = allTasks;

  if (currentCategory !== 'All') {
    filtered = filtered.filter(t => t.category === currentCategory);
  }

  if (currentPriority !== 'all') {
    filtered = filtered.filter(t => t.priority === currentPriority);
  }

  renderTasks(filtered);
}

function taskCard(task) {
  return `
    <div class="task-card-item"
      draggable="true"
      ondragstart="dragStart(event, '${task._id}')"
       ondragend="dragEnd(event)"
      style="background:white; border-radius:6px; padding:12px; margin-bottom:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:grab;">

      <div onclick="openModal('${task._id}', '${task.title}', '${task.priority}', '${task.status}', '${task.category || 'General'}', '${task.assignedToName || 'Unassigned'}')" 
      style="font-size:14px; color:#253858; margin-bottom:8px; cursor:pointer; font-weight:500;" title="Click to view comments">
      ${task.title}</div>

      <div style="font-size:11px; color:#5e6c84; margin-bottom:8px;">
        📁 ${task.category || 'General'}  ${task.assignedToName ? `&nbsp;👤 ${task.assignedToName}` : ''}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11px; padding:2px 8px; border-radius:20px; font-weight:600;
          background:${task.priority === 'high' ? '#ffebe6' : task.priority === 'medium' ? '#fffae6' : '#e3fcef'};
          color:${task.priority === 'high' ? '#de350b' : task.priority === 'medium' ? '#ff8b00' : '#006644'};">
          ${task.priority}
        </span>
        <div style="display:flex; gap:4px;">
          ${task.status !== 'inprogress' ? `<button onclick="moveTask('${task._id}','inprogress')" style="background:none; border:none; cursor:pointer; color:#5e6c84;" title="Move to In Progress">▶</button>` : ''}
          ${task.status !== 'done' ? `<button onclick="moveTask('${task._id}','done')" style="background:none; border:none; cursor:pointer; color:#5e6c84;" title="Done">✓</button>` : ''}
          <button onclick="deleteTask('${task._id}')" style="background:none; border:none; cursor:pointer; color:#c1c7d0;">✕</button>
        </div>
      </div>
    </div>`;
}

// ─── Drag & Drop ──────────────────────────────────────
let draggedTaskId = null;

function dragStart(event, taskId) {
  draggedTaskId = taskId;
  event.dataTransfer.effectAllowed = 'move';
  event.target.style.opacity = '0.5';
}

function dragEnd(event) {
  event.target.style.opacity = '1';
}

function allowDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const column = event.currentTarget;
  column.style.background = '#d0e8ff';

}

function dragLeave(event) {
  event.stopPropagation();
  event.currentTarget.style.background = '#ebecf0';
}

async function dropTask(event, newStatus) {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.style.background = '#ebecf0';
  if (draggedTaskId) {
    await moveTask(draggedTaskId, newStatus);
    draggedTaskId = null;
  }
}

async function moveTaskToColumn(id, status) {
  const currentToken = localStorage.getItem('token');

  const isCustom = customColumns.some(col => col.id === status);

  const body = isCustom
    ? { customStatus: status, staus: 'todo' }
    : { status: status, customStatus: '' };

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
    body: JSON.stringify({ status })
  });
  loadTasks();
}
async function moveTask(id, status) {
  await moveTaskToColumn(id, status);
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  const currentToken = localStorage.getItem('token');
  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${currentToken}` }
  });
  loadTasks();
}

async function loadProfile() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const user = await res.json();

    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-phone').value = user.phone || '';
    document.getElementById('profile-bio').value = user.bio || '';

    document.getElementById('profile-name-display').textContent = user.name || 'No Name';
    document.getElementById('profile-email-display').textContent = user.email;
    document.getElementById('profile-avatar').textContent = (user.name || user.email)[0].toUpperCase();

    const tasksRes = await fetch('http://localhost:5000/api/tasks', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const tasks = await tasksRes.json();
    document.getElementById('stat-todo').textContent = tasks.filter(t => t.status === 'todo').length;
    document.getElementById('stat-inprogress').textContent = tasks.filter(t => t.status === 'inprogress').length;
    document.getElementById('stat-done').textContent = tasks.filter(t => t.status === 'done').length;
  }
  catch (err) {
    console.log('Error loading profile:', err);
  }
}

async function saveProfile() {
  const currentToken = localStorage.getItem('token');
  const name = document.getElementById('profile-name').value.trim();
  const phone = document.getElementById('profile-phone').value.trim();
  const bio = document.getElementById('profile-bio').value.trim();
  const msgEl = document.getElementById('profile-msg');

  msgEl.style.color = 'red';
  if (!name) { msgEl.textContent = 'Name cannot be empty.'; return; }
  if (name.length < 2) { msgEl.textContent = 'Name must be at least 2 characters.'; return; }
  if (phone && !/^[+\d\s\-()\d]{7,15}$/.test(phone)) { msgEl.textContent = 'Please enter a valid phone number.'; return; }
  if (bio.length > 200) { msgEl.textContent = 'Bio cannot exceed 200 characters.'; return; }
  msgEl.style.color = 'green';

  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ name, phone, bio })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('profile-msg').textContent = '✓ Profile saved successfully!';
      document.getElementById('profile-name-display').textContent = name;
      document.getElementById('profile-avatar').textContent = name[0].toUpperCase();
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => document.getElementById('profile-msg').textContent = '', 3000);
    }
  }
  catch (err) {
    console.log('Error saving profile:', err);
  }
}

let currentTaskId = null;

function openModal(taskId, title, priority, status, category, assignee) {
  currentTaskId = taskId;

  document.getElementById('modal-task-title').textContent = title;
  document.getElementById('modal-task-status').textContent = status;
  document.getElementById('modal-task-category').textContent = '📁 ' + category;
  document.getElementById('modal-task-assignee').textContent = '👤 ' + assignee;

  const priorityEl = document.getElementById('modal-task-priority');
  priorityEl.textContent = priority;
  priorityEl.style.background = priority === 'high' ? '#ffebe6' : priority === 'medium' ? '#fffae6' : '#e3fcef';
  priorityEl.style.color = priority === 'high' ? '#de350b' : priority === 'medium' ? '#ff8b00' : '#006644';

  const modal = document.getElementById('task-modal');
  modal.style.display = 'flex';

  loadComments(taskId);
}

function closeModal() {
  document.getElementById('task-modal').style.display = 'none';
  document.getElementById('comment-input').value = '';
  document.getElementById('comments-list').innerHTML = '';
  currentTaskId = null;
  cancelEditMode();
}

// ─── Toggle Edit Mode ─────────────────────────────────
function toggleEditMode() {
  const task = allTasksData.find(t => t._id === currentTaskId);
  if (!task) return;

  // Hide view mode, show edit mode
  document.getElementById('view-mode').style.display = 'none';
  document.getElementById('edit-mode').style.display = 'block';
  document.getElementById('edit-btn').style.display = 'none';
  document.getElementById('save-btn').style.display = 'inline-block';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  // Fill edit form with current task values
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-priority').value = task.priority;
  document.getElementById('edit-status').value = task.status;
  document.getElementById('edit-category').value = task.category || 'General';

  // Fill assign dropdown with users
  const currentToken = localStorage.getItem('token');
  fetch('http://localhost:5000/api/users', {
    headers: { 'Authorization': `Bearer ${currentToken}` }
  })
    .then(res => res.json())
    .then(users => {
      const select = document.getElementById('edit-assign');
      select.innerHTML = '<option value="">Unassigned</option>';
      users.forEach(u => {
        const selected = u.name === task.assignedToName || u.email === task.assignedToName ? 'selected' : '';
        select.innerHTML += `<option value="${u._id}" data-name="${u.name || u.email}" ${selected}>${u.name || u.email}</option>`;
      });
    });
}

// ─── Cancel Edit Mode ─────────────────────────────────
function cancelEditMode() {
  document.getElementById('view-mode').style.display = 'block';
  document.getElementById('edit-mode').style.display = 'none';
  document.getElementById('edit-btn').style.display = 'inline-block';
  document.getElementById('save-btn').style.display = 'none';
  document.getElementById('cancel-btn').style.display = 'none';
}

// ─── Save Task Edit ───────────────────────────────────
async function saveTaskEdit() {
  const title = document.getElementById('edit-title').value.trim();
  const priority = document.getElementById('edit-priority').value;
  const status = document.getElementById('edit-status').value;
  const category = document.getElementById('edit-category').value;

  const assignEl = document.getElementById('edit-assign');
  const assignedTo = assignEl.options[assignEl.selectedIndex].value;
  const assignedToName = assignEl.options[assignEl.selectedIndex].dataset.name || '';

  if (!title) {
    document.getElementById('edit-title').style.border = '1px solid red';
    document.getElementById('edit-title').placeholder = 'Title cannot be empty!';
    return;
  }
  document.getElementById('edit-title').style.border = '';

  const currentToken = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${currentTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ title, priority, status, category, assignedTo, assignedToName })
    });

    if (res.ok) {
      // Update modal title display
      document.getElementById('modal-task-title').textContent = title;

      // Update view mode badges
      document.getElementById('modal-task-status').textContent = status;
      document.getElementById('modal-task-category').textContent = '📁 ' + category;
      document.getElementById('modal-task-assignee').textContent = '👤 ' + (assignedToName || 'Unassigned');

      const priorityEl = document.getElementById('modal-task-priority');
      priorityEl.textContent = priority;
      priorityEl.style.background = priority === 'high' ? '#ffebe6' : priority === 'medium' ? '#fffae6' : '#e3fcef';
      priorityEl.style.color = priority === 'high' ? '#de350b' : priority === 'medium' ? '#ff8b00' : '#006644';

      // Go back to view mode
      cancelEditMode();

      // Reload tasks on board
      loadTasks();

      alert('Task updated successfully! ✅');
    }
  } catch (err) {
    console.log('Error saving task:', err);
    alert('Could not save changes.');
  }
}

// document.getElementById('task-modal').addEventListener('click', function(e) {
//   if (e.target === this) closeModal();
// });

async function loadComments(taskId) {
  const currentToken = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:5000/api/comments/${taskId}`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const comments = await res.json();
    renderComments(comments);
  }
  catch (err) {
    console.log('Error loading comments', err);
  }
}

function renderComments(comments) {
  const list = document.getElementById('comments-list');
  if (comments.length === 0) {
    list.innerHTML = '<p style="color:#5e6c84; font-size:14px; text-align:center;">No comments yet. Be the first!</p>';
    return;
  }
  list.innerHTML = comments.map(c => `
    <div style="display:flex; gap:10px; margin-bottom:16px;">
      <div style="width:32px; height:32px; border-radius:50%; background:dodgerblue; color:white; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; flex-shrink:0;">
        ${(c.userName || '?')[0].toUpperCase()}
      </div>
      <div style="flex:1; background:#f4f5f7; border-radius:8px; padding:10px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size:13px; font-weight:600; color:#253858;">${c.userName}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; color:#5e6c84;">${new Date(c.createdAt).toLocaleString()}</span>
            <button onclick="deleteComment('${c._id}')"
              style="background:none; border:none; cursor:pointer; color:#c1c7d0; font-size:14px;" title="Delete">✕</button>
          </div>
        </div>
        <p style="margin:0; font-size:14px; color:#253858; line-height:1.5;">${c.text}</p>
      </div>
    </div>
  `).join('');
}

async function addComment() {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) return;
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/comments/${currentTaskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      input.value = '';
      loadComments(currentTaskId);
    }
  } catch (err) {
    console.log('Error adding comment:', err);
  }
}

async function deleteComment(commentId) {
  if (!confirm('Delete this comment?')) return;
  const currentToken = localStorage.getItem('token');
  try {
    await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    loadComments(currentTaskId);
  }
  catch (err) {
    console.log('Error deleting comment:', err);
  }
}

async function loadUsers() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const users = await res.json();
    const select = document.getElementById('assign-select');
    if (!select) return;
    select.innerHTML = '<option value="">Unassigned</option>';
    users.forEach(u => {
      select.innerHTML += `<option value="${u._id}" data-email="${u.email}">${u.name || u.email}</option>`;
    });
  }
  catch (err) {
    console.log('Error loading users:', err);
  }
}

// ─── Custom Columns ───────────────────────────────────
let customColumns = []; // stores { _id, name }

// Load columns from MongoDB on dashboard open
async function loadColumns() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/columns', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    customColumns = await res.json();
    renderCustomColumns();
  } catch (err) {
    console.log('Error loading columns:', err);
  }
}

// Render all custom columns on board
function renderCustomColumns() {
  const container = document.getElementById('custom-columns');
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.gap = '16px';

  customColumns.forEach(col => {
    const colDiv = document.createElement('div');
    colDiv.id = `col-${col._id}`;
    colDiv.style.cssText = 'background:#ebecf0; border-radius:8px; padding:12px; min-height:400px; min-width:280px; flex-shrink:0;';
    colDiv.setAttribute('ondragover', 'allowDrop(event)');
    colDiv.setAttribute('ondragleave', 'dragLeave(event)');
    colDiv.setAttribute('ondrop', `dropTask(event,'${col._id}')`);

    colDiv.innerHTML = `
      <div style="font-weight:600; font-size:14px; color:#253858; margin-bottom:12px; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center;">
        <span>${col.name}</span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span id="count-${col._id}" style="background:#c1c7d0; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:12px;">0</span>
          <button onclick="deleteColumn('${col._id}')" title="Delete column"
            style="background:none; border:none; cursor:pointer; color:#c1c7d0; font-size:16px; padding:0 2px;" 
            onmouseover="this.style.color='#de350b'" 
            onmouseout="this.style.color='#c1c7d0'">✕</button>
        </div>
      </div>
      <div id="tasks-${col._id}"></div>
    `;
    container.appendChild(colDiv);
  });
}

// Open add column popup
function openAddColumnPopup() {
  document.getElementById('column-input').value = '';
  document.getElementById('column-error').textContent = '';
  document.getElementById('column-popup').style.display = 'flex';
  setTimeout(() => document.getElementById('column-input').focus(), 100);
}

// Close add column popup
function closeColumnPopup() {
  document.getElementById('column-popup').style.display = 'none';
  document.getElementById('column-input').value = '';
  document.getElementById('column-error').textContent = '';
}

// Confirm adding a new column
async function confirmAddColumn() {
  const name = document.getElementById('column-input').value.trim();
  const errorEl = document.getElementById('column-error');

  if (!name) { errorEl.textContent = 'Please enter a column name.'; return; }
  if (name.length < 2) { errorEl.textContent = 'Name must be at least 2 characters.'; return; }
  if (name.length > 25) { errorEl.textContent = 'Name must be under 25 characters.'; return; }

  // Check duplicate with default columns
  const defaults = ['todo', 'inprogress', 'done'];
  if (defaults.includes(name.toLowerCase().replace(/\s/g, ''))) {
    errorEl.textContent = 'This column already exists!';
    return;
  }

  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ name })
    });
    const data = await res.json();

    if (res.ok) {
      customColumns.push(data);
      renderCustomColumns();
      closeColumnPopup();
      loadTasks(); // reload tasks to fill new column
    } else {
      errorEl.textContent = data.message;
    }
  } catch (err) {
    errorEl.textContent = 'Could not add column.';
  }
}

// Delete a custom column
async function deleteColumn(columnId) {
  if (!confirm('Delete this column? Tasks in it will move to To Do.')) return;

  const currentToken = localStorage.getItem('token');
  try {
    await fetch(`http://localhost:5000/api/columns/${columnId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    customColumns = customColumns.filter(c => c._id !== columnId);
    renderCustomColumns();
    loadTasks();
  } catch (err) {
    console.log('Error deleting column:', err);
  }
}

// ─── Custom Popup ─────────────────────────────────────
let customPopupType = '';   // 'priority' or 'category'
let customPopupTarget = ''; // 'add' or 'edit'

function addCustomPriority(target = 'add') {
  customPopupType = 'priority';
  customPopupTarget = target;
  document.getElementById('popup-title').textContent = '➕ Add Custom Priority';
  document.getElementById('custom-input').value = '';
  document.getElementById('custom-input').placeholder = 'e.g. Critical, Urgent, Optional...';
  document.getElementById('popup-error').textContent = '';
  document.getElementById('custom-popup').style.display = 'flex';
  setTimeout(() => document.getElementById('custom-input').focus(), 100);
}

function addCustomCategory(target = 'add') {
  customPopupType = 'category';
  customPopupTarget = target;
  document.getElementById('popup-title').textContent = '➕ Add Custom Category';
  document.getElementById('custom-input').value = '';
  document.getElementById('custom-input').placeholder = 'e.g. Finance, Legal, Support...';
  document.getElementById('popup-error').textContent = '';
  document.getElementById('custom-popup').style.display = 'flex';
  setTimeout(() => document.getElementById('custom-input').focus(), 100);
}

function closePopup() {
  document.getElementById('custom-popup').style.display = 'none';
  document.getElementById('custom-input').value = '';
  document.getElementById('popup-error').textContent = '';
}

function confirmCustomOption() {
  const value = document.getElementById('custom-input').value.trim();
  const errorEl = document.getElementById('popup-error');

  // Validation
  if (!value) {
    errorEl.textContent = 'Please enter a name.';
    return;
  }
  if (value.length < 2) {
    errorEl.textContent = 'Name must be at least 2 characters.';
    return;
  }
  if (value.length > 20) {
    errorEl.textContent = 'Name must be under 20 characters.';
    return;
  }
  // Determine which select to update
  const selectId = customPopupTarget === 'edit'
    ? `edit-${customPopupType}`
    : `${customPopupType}-select`;

  const select = document.getElementById(selectId);

  // Check if option already exists
  const exists = Array.from(select.options).some(
    opt => opt.value.toLowerCase() === value.toLowerCase()
  );
  if (exists) {
    errorEl.textContent = 'This option already exists!';
    return;
  }
  // Add new option to dropdown and select it
  const newOption = document.createElement('option');
  newOption.value = value;
  newOption.textContent = value;
  select.appendChild(newOption);
  select.value = value;

  // Also add to filter buttons if it's a category
  if (customPopupType === 'category' && customPopupTarget === 'add') {
    addCategoryFilterButton(value);
  }

  closePopup();
}
// ─── Add new category filter button dynamically ────────
function addCategoryFilterButton(category) {
  const filterDiv = document.querySelector('[id^="cat-all"]').parentElement;

  // Check if button already exists
  if (document.getElementById(`cat-${category.toLowerCase()}`)) return;

  const btn = document.createElement('button');
  btn.id = `cat-${category.toLowerCase()}`;
  btn.textContent = category;
  btn.onclick = () => filterByCategory(category);
  btn.style.cssText = 'padding:6px 16px; border-radius:20px; border:1px solid #ddd; background:white; cursor:pointer; font-family:system-ui; color:#253858;';
  filterDiv.appendChild(btn);
}

function updateSummaryCards(tasks) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const pending = tasks.filter(t => t.status !== 'done').length;
  const high = tasks.filter(t => t.priority === 'high').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done-count').textContent = done;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-high').textContent = high;
}

async function loadActivity() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/activity', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const activities = await res.json();
    renderActivity(activities);
  }
  catch (err) {
    console.log('Error loading activity', err);
  }
}
function renderActivity(activities) {
  const list = document.getElementById('activity-list');
  if (!activities.length) {
    list.innerHTML = '<p style=" color: #5e6c84, font-size: 14px, text-align: center, font-family: system-ui;">No activity yet.</p>';
  }

  const icons = {
    created: '🟢',
    updated: '✏️',
    deleted: '🔴',
    moved: '➡️',
    assigned: '👤'
  };

  list.innerHTML = activities.map(a => `
    <div style="display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f4f5f7; align-items:flex-start;">
            <span style="font-size:18px;">${icons[a.action] || '📌'}</span>
            <div style="flex:1;">
                <span style="font-size:14px; color:#253858; font-family:system-ui;">
                    <strong>${a.userName}</strong> ${a.action} 
                    <strong>"${a.taskTitle}"</strong>
                    ${a.detail ? `<span style="color:#5e6c84;"> — ${a.detail}</span>` : ''}
                </span>
                <div style="font-size:11px; color:#5e6c84; margin-top:2px; font-family:system-ui;">
                    ${new Date(a.createdAt).toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');

}

function exportToExcel() {
  if (!allTasks.length) {
    alert('No task to export!');
    return;
  }

  const headers = ['Title', 'Priority', 'Status', 'Category', 'AssignedTo', 'CreatedAt'];

  const rows = allTasks.map(t => [
    `"${t.title}"`,
    t.priority,
    t.status,
    t.category || 'General',
    t.assignedToName || '',
    new Date(t.createdAt).toLocaleDateString()
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  alert(`✅ Exported ${allTasks.length} tasks to Excel!`);
}

async function loadNotifications() {
  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/notifications', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const notifications = await res.json();
    renderNotifications(notifications);
  }
  catch (err) {
    console.log('Error loading Notifications:', err);
  }
}
function renderNotifications(notifications) {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  const unread = notifications.filter(n => !n.read).length;

  if (unread > 0) {
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.style.display = 'flex';
  }
  else {
    badge.style.display = 'none';
  }
  if (!notifications.length) {
    list.innerHTML = '<p style="padding:16px; text-align:center; color:#5e6c84; font-size:14px; font-family:system-ui;">No notifications yet</p>';
    return;
  }
  list.innerHTML = notifications.map(n => `
        <div style="padding:12px 16px; border-bottom:1px solid #f4f5f7; background:${n.read ? 'white' : '#f0f7ff'};">
            <div style="font-size:13px; color:#253858; font-family:system-ui; margin-bottom:4px;">
                🔔 ${n.message}
            </div>
            <div style="font-size:12px; color:#5e6c84; font-family:system-ui; margin-bottom:2px;">
                📋 "${n.taskTitle}"
            </div>
            <div style="font-size:11px; color:#5e6c84; font-family:system-ui;">
                ${new Date(n.createdAt).toLocaleString()}
            </div>
        </div>
    `).join('');
}

function toggleNotifications() {
  const dropdown = document.getElementById('notif-dropdown');
  const isOpen = dropdown.style.display === "block";
  dropdown.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) loadNotifications();
}
async function markAllRead() {
  const currentToken = localStorage.getItem('token');
  try {
    await fetch('http://localhost:5000/api/notifications/read', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    loadNotifications();
  }
  catch (err) {
    console.log('Error marking Notifications read', err);
  }
}

document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('notif-dropdown');
  const bell = e.target.closest('button');
  if (dropdown && !dropdown.contains(e.target) && !bell) {
    dropdown.style.display = 'none';
  }
});

setInterval(() => {
  const token = localStorage.getItem('token');
  if (token) loadNotifications();
}, 30000);

// ─── Invite User Popup ────────────────────────────────
function openInvitePopup() {
  document.getElementById('invite-email').value = '';
  document.getElementById('invite-error').textContent = '';
  document.getElementById('invite-success').textContent = '';
  document.getElementById('invite-popup').style.display = 'flex';
  setTimeout(() => document.getElementById('invite-email').focus(), 100);
}

function closeInvitePopup() {
  document.getElementById('invite-popup').style.display = 'none';
}

async function confirmInvite() {
  const email = document.getElementById('invite-email').value.trim();
  const errorEl = document.getElementById('invite-error');
  const successEl = document.getElementById('invite-success');
  const btn = document.getElementById('invite-btn');

  errorEl.textContent = '';
  successEl.textContent = '';

  // Validate email
  if (!email) { errorEl.textContent = 'Please enter an email.'; return; }
  if (!email.includes('@') || !email.includes('.')) {
    errorEl.textContent = 'Please enter a valid email.';
    return;
  }

  btn.textContent = 'Adding...';
  btn.disabled = true;

  const currentToken = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/invite-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (res.ok || res.status === 200) {
      // Add user to assign dropdown if not already there
      const select = document.getElementById('assign-select');
      const exists = Array.from(select.options).some(o => o.value === data.user._id);

      if (!exists) {
        const option = document.createElement('option');
        option.value = data.user._id;
        option.textContent = data.user.name || data.user.email;
        option.dataset.email = data.user.email; // ← store email for sending
        select.appendChild(option);
      }

      // Auto select the newly added user
      select.value = data.user._id;

      successEl.textContent = res.status === 201
        ? `✅ ${email} added successfully!`
        : `✅ ${email} already exists — selected!`;

      setTimeout(() => closeInvitePopup(), 1500);
    } else {
      errorEl.textContent = data.message || 'Could not add user.';
    }
  } catch (err) {
    errorEl.textContent = 'Could not connect to server.';
  } finally {
    btn.textContent = 'Add User';
    btn.disabled = false;
  }
}