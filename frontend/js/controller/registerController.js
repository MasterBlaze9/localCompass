import registerView from '../view/register/registerView.js';
import userService from '../service/userService.js';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[0-9+\-\s]{7,15}$/.test(value);
}

export function init() {
  registerView.render();

  const container = document.getElementById('container');
  const signUpBtn = container.querySelector('.register-btn');
  const toLogin = container.querySelector('#toLogin');

  signUpBtn.addEventListener('click', () => {
    const email = container.querySelector('input[type="email"]').value;
    const phone = container.querySelector('input[type="tel"]')?.value;
    const password = container.querySelector('input[type="password"]').value;

    if ((!email && !phone) || !password) {
      alert('Email or phone and password are required');
      return;
    }

    if (email && !isEmail(email)) {
      alert('Invalid email format');
      return;
    }

    if (phone && !isPhone(phone)) {
      alert('Invalid phone number');
      return;
    }

    const payload = { password };
    if (email) payload.email = email.trim();
    if (phone) payload.phone = phone.trim();

    userService.register(payload)
      .then(() => {
        window.location.href = '/login';
      })
      .catch(err => {
        console.error('Registration failed:', err);
        alert(err?.message || 'Registration failed');
      });
  });

}

