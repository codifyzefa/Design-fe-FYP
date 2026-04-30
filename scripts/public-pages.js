const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navIcon = document.getElementById('navIcon');

if (navToggle && mobileMenu && navIcon) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navIcon.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });
}

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
});

document.querySelectorAll('[data-faq-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      const openButton = openItem.querySelector('[data-faq-toggle]');
      if (openButton) openButton.setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    contactForm.reset();
    if (status) {
      status.classList.add('show');
      status.textContent = 'Your message has been prepared for the FYP support team.';
    }
  });
}
