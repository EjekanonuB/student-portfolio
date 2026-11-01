const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const yearNodes = document.querySelectorAll('[data-year]');
const contactForm = document.querySelector('#contactForm');
const projectFilters = document.querySelectorAll('[data-filter]');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (themeToggle) {
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('theme-dark');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    const isDark = document.body.classList.contains('theme-dark');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });
}

if (yearNodes.length) {
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

const scrollEdgeButton = document.querySelector('[data-scroll-edge]');
if (scrollEdgeButton) {
  const arrowPath = scrollEdgeButton.querySelector('path');
  const updateScrollEdgeButton = () => {
    const atTop = window.scrollY < 80;
    scrollEdgeButton.setAttribute('aria-label', atTop ? 'Scroll to page end' : 'Scroll to page beginning');
    if (arrowPath) {
      arrowPath.setAttribute(
        'd',
        atTop ? 'M12 5v14m-7-7 7 7 7-7' : 'M12 19V5m7 7-7-7-7 7'
      );
    }
  };

  scrollEdgeButton.addEventListener('click', () => {
    const atTop = window.scrollY < 80;
    window.scrollTo({
      top: atTop ? document.documentElement.scrollHeight : 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', updateScrollEdgeButton, { passive: true });
  updateScrollEdgeButton();
}

if (projectFilters.length) {
  projectFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter;
      projectFilters.forEach((btn) => btn.classList.toggle('active', btn === button));

      document.querySelectorAll('.project-card').forEach((card) => {
        const matches = filterValue === 'all' || card.dataset.category === filterValue;
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}

const addTaskButton = document.querySelector('#addTaskButton');
if (addTaskButton) {
  addTaskButton.addEventListener('click', () => {
    const taskForm = document.querySelector('#taskForm');
    if (taskForm) {
      taskForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstInput = taskForm.querySelector('input, textarea, select');
      if (firstInput) firstInput.focus();
    }
  });
}

if (contactForm) {
  const nameInput = document.querySelector('#fullName');
  const emailInput = document.querySelector('#email');
  const phoneInput = document.querySelector('#phone');
  const subjectInput = document.querySelector('#subject');
  const messageInput = document.querySelector('#message');
  const validation = document.querySelector('#contactValidation');
  const successMessage = document.querySelector('#contactSuccess');

  const showError = (message) => {
    if (validation) {
      validation.textContent = message;
    }
  };

  const clearMessages = () => {
    showError('');
    if (successMessage) {
      successMessage.textContent = '';
    }
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessages();

    const fullName = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = phone.replace(/\D+/g, '');

    if (!fullName || !email || !subject || !message) {
      showError('Please complete all required fields before submitting the form.');
      return;
    }

    if (!emailPattern.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (phone && digitsOnly.length < 7) {
      showError('Please enter a valid phone number with at least 7 digits.');
      return;
    }

    if (message.length < 12) {
      showError('Please provide a more detailed message so I can understand your enquiry.');
      return;
    }

    if (successMessage) {
      successMessage.textContent = 'Thanks for reaching out. Your message has been prepared for review and no real email service is connected in this demo.';
    }

    contactForm.reset();
  });
}
