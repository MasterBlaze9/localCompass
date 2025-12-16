import registerView from '../view/register/registerView.js';

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

}

