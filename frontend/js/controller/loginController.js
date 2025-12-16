import loginView from '../view/login/loginView.js';
import auth from '../service/authService.js';


function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[0-9+\-\s]{7,15}$/.test(value);
}

export function init() {
  loginView.render();

  const container = document.getElementById('container');
  if (!container) return;

  const loginBtn = container.querySelector('.login-btn');
  if (!loginBtn) return;

  loginBtn.addEventListener('click', () => {
    const identifierInput = container.querySelector('.login-input');
    const passwordInput = container.querySelector('input[type="password"]');

    const identifier = identifierInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!identifier || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (!isEmail(identifier) && !isPhone(identifier)) {
      alert('Enter a valid email or phone number');
      return;
    }

    const loginPayload = {
      type: isEmail(identifier) ? 'email' : 'phone',
      value: identifier,
      password
    };

    const basic = btoa(`${identifier}:${password}`);
    auth.setAuth(basic);
    fetch('/api/posts', { headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() } })
      .then(r => {
        if (!r.ok) throw new Error('Invalid credentials');
        window.location.href = '/';
      })
      .catch(() => { auth.clearAuth(); alert('Login failed'); });
  });
}
