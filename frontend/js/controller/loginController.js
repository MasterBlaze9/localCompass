import { renderLogin } from '../views/login/loginView.js';

// simple validators
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[0-9+\-\s]{7,15}$/.test(value);
}

export function loginController(root, navigate) {
  renderLogin(root);

  const loginBtn = root.querySelector('.login-btn');
  const toRegister = root.querySelector('#toRegister');

  loginBtn.addEventListener('click', () => {
    const identifierInput = root.querySelector('.login-input');
    const passwordInput = root.querySelector('input[type="password"]');

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();

    // required fields
    if (!identifier || !password) {
      alert('Please fill in all fields');
      return;
    }

    // email OR phone validation
    if (!isEmail(identifier) && !isPhone(identifier)) {
      alert('Enter a valid email or phone number');
      return;
    }

    // determine type
    const loginPayload = {
      type: isEmail(identifier) ? 'email' : 'phone',
      value: identifier,
      password
    };

    // no auth logic — just handling input
    console.log('Login payload:', loginPayload);
  });

  toRegister.addEventListener('click', () => {
    navigate('register');
  });
}

