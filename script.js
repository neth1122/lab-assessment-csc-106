document.addEventListener('DOMContentLoaded', () => {
  const plannerForm = document.getElementById('plannerForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const plannerMessage = document.getElementById('plannerMessage');
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');

  let tasks = JSON.parse(localStorage.getItem('studentPlannerTasks') || '[]');

  function saveTasks() {
    localStorage.setItem('studentPlannerTasks', JSON.stringify(tasks));
  }

  function showPlannerMessage(message, type = 'success') {
    if (!plannerMessage) return;
    plannerMessage.textContent = message;
    plannerMessage.className = `form-message ${type}`;
  }

  function renderTasks() {
    if (!taskList) return;

    if (!tasks.length) {
      taskList.innerHTML = '<li class="task-item"><span>No tasks yet. Add one to get started.</span></li>';
      return;
    }

    taskList.innerHTML = tasks.map((task) => `
      <li class="task-item ${task.completed ? 'completed' : ''}">
        <span>${task.text}</span>
        <div class="task-actions">
          <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Done'}</button>
          <button class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
      </li>
    `).join('');
  }

  if (plannerForm && taskInput && taskList) {
    plannerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = taskInput.value.trim();

      if (!text) {
        showPlannerMessage('Please enter a task.', 'error');
        return;
      }

      tasks.unshift({ id: Date.now(), text, completed: false });
      saveTasks();
      renderTasks();
      plannerForm.reset();
      showPlannerMessage('Task added successfully.');
    });

    taskList.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const taskId = Number(button.getAttribute('data-id'));
      if (button.classList.contains('delete-btn')) {
        tasks = tasks.filter((task) => task.id !== taskId);
        showPlannerMessage('Task removed.');
      } else {
        tasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task));
        showPlannerMessage('Task updated.');
      }

      saveTasks();
      renderTasks();
    });

    renderTasks();
  }

  if (contactForm && contactMessage) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !phone || !message) {
        contactMessage.textContent = 'All fields are required.';
        contactMessage.className = 'form-message error';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        contactMessage.textContent = 'Please enter a valid email address.';
        contactMessage.className = 'form-message error';
        return;
      }

      if (!/^\d+$/.test(phone)) {
        contactMessage.textContent = 'Phone number must contain only digits.';
        contactMessage.className = 'form-message error';
        return;
      }

      contactMessage.textContent = 'Your message has been sent successfully.';
      contactMessage.className = 'form-message success';
      contactForm.reset();
    });
  }
});
