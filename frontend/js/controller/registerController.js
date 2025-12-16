import { renderRegister } from './registerView.js';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[0-9+\-\s]{7,15}$/.test(value);
}

export function registerController(root, navigate) {
  renderRegister(root);

  const signUpBtn = root.querySelector('.register-btn');
  const toLogin = root.querySelector('#toLogin');

  signUpBtn.addEventListener('click', () => {
    const email = root.querySelector('input[type="email"]').value;
    const phone = root.querySelector('input[type="tel"]')?.value;
    const password = root.querySelector('input[type="password"]').value;

    if (!email || !phone || !password) {
      alert('All fields are required');
      return;
    }

    if (!isEmail(email)) {
      alert('Invalid email format');
      return;
    }

    if (!isPhone(phone)) {
      alert('Invalid phone number');
      return;
    }

    console.log('Register input:', {
      email,
      phone,
      password
    });
  });

  toLogin.addEventListener('click', () => {
    navigate('login');
  });
}

