const STORAGE_KEY = 'academic-planner-tasks';
const taskForm = document.querySelector('#taskForm');
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#taskSearch');
const filterButtons = document.querySelectorAll('[data-task-filter]');
const stats = {
  total: document.querySelector('[data-stat="total"]'),
  completed: document.querySelector('[data-stat="completed"]'),
  pending: document.querySelector('[data-stat="pending"]'),
  overdue: document.querySelector('[data-stat="overdue"]'),
};

const formTitle = document.querySelector('#taskTitle');
const formDescription = document.querySelector('#taskDescription');
const formCategory = document.querySelector('#taskCategory');
const formDueDate = document.querySelector('#taskDueDate');
const formPriority = document.querySelector('#taskPriority');
const formStatus = document.querySelector('#taskStatus');
const formHiddenId = document.querySelector('#taskId');
const formSubmitText = document.querySelector('#taskSubmitText');

let activeFilter = 'all';
let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(dateValue) {
  if (!dateValue) return 'No due date';
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function getStatus(task) {
  if (task.status === 'completed') return 'Completed';
  if (isOverdue(task)) return 'Overdue';
  return 'Pending';
}

function isOverdue(task) {
  if (task.status === 'completed' || !task.dueDate) return false;
  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function calculateStats(list) {
  const total = list.length;
  const completed = list.filter((item) => item.status === 'completed').length;
  const pending = list.filter((item) => item.status !== 'completed').length;
  const overdue = list.filter((item) => item.status !== 'completed' && isOverdue(item)).length;

  if (stats.total) stats.total.textContent = String(total);
  if (stats.completed) stats.completed.textContent = String(completed);
  if (stats.pending) stats.pending.textContent = String(pending);
  if (stats.overdue) stats.overdue.textContent = String(overdue);
}

function matchesActiveFilter(task) {
  if (activeFilter === 'all') return true;
  if (activeFilter === 'pending') return task.status !== 'completed';
  if (activeFilter === 'completed') return task.status === 'completed';
  if (activeFilter === 'overdue') return task.status !== 'completed' && isOverdue(task);
  return true;
}

function getVisibleTasks() {
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

  return tasks.filter((task) => {
    const textMatch = !term || [task.title, task.description, task.category, task.priority].join(' ').toLowerCase().includes(term);
    return matchesActiveFilter(task) && textMatch;
  });
}

function renderTasks() {
  if (!taskList) return;

  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  if (!visibleTasks.length) {
    if (emptyState) {
      emptyState.classList.remove('hidden');
    }
    calculateStats(tasks);
    return;
  }

  if (emptyState) {
    emptyState.classList.add('hidden');
  }

  visibleTasks.forEach((task) => {
    const card = document.createElement('article');
    const overdue = isOverdue(task);
    const complete = task.status === 'completed';
    card.className = `task-card${complete ? ' is-complete' : ''}${overdue ? ' is-overdue' : ''}`;

    const header = document.createElement('div');
    header.className = 'task-header';

    const titleRow = document.createElement('div');
    titleRow.className = 'task-title-row';

    const title = document.createElement('h3');
    title.textContent = task.title;

    const badgeRow = document.createElement('div');
    badgeRow.className = 'task-meta';

    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'status-badge';
    categoryBadge.textContent = task.category;

    const priorityBadge = document.createElement('span');
    priorityBadge.className = 'status-badge pending';
    priorityBadge.textContent = task.priority;

    if (complete) {
      priorityBadge.className = 'status-badge';
      priorityBadge.textContent = 'Completed';
    } else if (overdue) {
      priorityBadge.className = 'status-badge overdue';
      priorityBadge.textContent = 'Overdue';
    }

    badgeRow.append(categoryBadge, priorityBadge);
    titleRow.append(title, badgeRow);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.type = 'button';
    completeButton.className = 'action-btn primary';
    completeButton.textContent = complete ? 'Reopen' : 'Complete';
    completeButton.addEventListener('click', () => toggleTaskCompletion(task.id));

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'action-btn';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => fillForm(task));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'action-btn danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    actions.append(completeButton, editButton, deleteButton);
    header.append(titleRow, actions);

    const description = document.createElement('p');
    description.textContent = task.description || 'No description provided.';

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const dueDate = document.createElement('span');
    dueDate.className = 'status-badge';
    dueDate.textContent = `Due: ${formatDate(task.dueDate)}`;

    const taskStatus = document.createElement('span');
    taskStatus.className = 'status-badge';
    taskStatus.textContent = getStatus(task);

    meta.append(dueDate, taskStatus);

    card.append(header, description, meta);
    taskList.appendChild(card);
  });

  calculateStats(tasks);
}

function resetForm() {
  if (taskForm) taskForm.reset();
  if (formHiddenId) formHiddenId.value = '';
  if (formSubmitText) formSubmitText.textContent = 'Add Task';
}

function fillForm(task) {
  if (!formTitle || !formDescription || !formCategory || !formDueDate || !formPriority || !formStatus || !formHiddenId) return;

  formTitle.value = task.title;
  formDescription.value = task.description;
  formCategory.value = task.category;
  formDueDate.value = task.dueDate;
  formPriority.value = task.priority;
  formStatus.value = task.status;
  formHiddenId.value = task.id;
  if (formSubmitText) formSubmitText.textContent = 'Save Changes';
  formTitle.focus();
}

function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) => {
    if (task.id !== taskId) return task;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    return { ...task, status: nextStatus };
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  if (formHiddenId && formHiddenId.value === taskId) {
    resetForm();
  }
  saveTasks();
  renderTasks();
}

function addOrUpdateTask(event) {
  event.preventDefault();

  if (!formTitle || !formDescription || !formCategory || !formDueDate || !formPriority || !formStatus || !formHiddenId) return;

  const title = formTitle.value.trim();
  const description = formDescription.value.trim();
  const category = formCategory.value.trim();
  const dueDate = formDueDate.value;
  const priority = formPriority.value;
  const status = formStatus.value;

  if (!title || !description || !category || !dueDate) {
    alert('Please complete all required task fields before saving.');
    return;
  }

  const taskId = formHiddenId.value;

  if (taskId) {
    tasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, title, description, category, dueDate, priority, status }
        : task
    );
  } else {
    tasks.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description,
      category,
      dueDate,
      priority,
      status,
    });
  }

  saveTasks();
  resetForm();
  renderTasks();
}

if (taskForm) {
  taskForm.addEventListener('submit', addOrUpdateTask);
}

if (searchInput) {
  searchInput.addEventListener('input', renderTasks);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.taskFilter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    renderTasks();
  });
});

renderTasks();
