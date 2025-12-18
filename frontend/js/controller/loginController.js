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

  // hook up realtime error clearing on input
  const identifierInput = container.querySelector('.login-input');
  const passwordInput = container.querySelector('input[type="password"]');
  const idErr = container.querySelector('#login-error-identifier');
  const pwdErr = container.querySelector('#login-error-password');
  const globalErr = container.querySelector('#login-error-global');

  const clear = (el) => { if (!el) return; el.textContent = ''; el.style.display = 'none'; };
  const resetInput = (input) => {
    if (!input) return;
    input.style.border = '1px solid #dcdfe4';
    input.style.backgroundColor = '#fff';
  };

  identifierInput?.addEventListener('input', () => {
    clear(idErr); clear(globalErr); resetInput(identifierInput);
  });
  passwordInput?.addEventListener('input', () => {
    clear(pwdErr); clear(globalErr); resetInput(passwordInput);
  });

  loginBtn.addEventListener('click', () => {
    const identifierInput = container.querySelector('.login-input');
    const passwordInput = container.querySelector('input[type="password"]');

    const idErr = container.querySelector('#login-error-identifier');
    const pwdErr = container.querySelector('#login-error-password');
    const globalErr = container.querySelector('#login-error-global');

    // helpers to show/clear errors
    const show = (el, msg) => { if (!el) return; el.textContent = msg; el.style.display = 'block'; };
    const clear = (el) => { if (!el) return; el.textContent = ''; el.style.display = 'none'; };
    const markInvalid = (input, invalid) => {
      if (!input) return;
      input.style.border = invalid ? '1px solid #ef4444' : '1px solid #dcdfe4';
      input.style.backgroundColor = invalid ? '#fef2f2' : '#fff';
    };

    const identifier = identifierInput?.value.trim();
    const password = passwordInput?.value.trim();

    // clear previous errors
    clear(idErr); clear(pwdErr); clear(globalErr);
    markInvalid(identifierInput, false); markInvalid(passwordInput, false);

    let hasError = false;
    if (!identifier) {
      show(idErr, 'Email or phone is required');
      markInvalid(identifierInput, true);
      hasError = true;
    }
    if (!password) {
      show(pwdErr, 'Password is required');
      markInvalid(passwordInput, true);
      hasError = true;
    }
    if (hasError) return;

    if (!isEmail(identifier) && !isPhone(identifier)) {
      show(idErr, 'Enter a valid email or phone number');
      markInvalid(identifierInput, true);
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
      .catch((err) => {
        // Clear stored auth token
        auth.clearAuth();
        // Normalize network/fetch errors to a friendly message for users
        // Browsers often surface network failures as 'Failed to fetch' (TypeError)
        console.error('Login error:', err);
        let message = err?.message || 'Login failed';
        if (message === 'Failed to fetch') {
          // Most commonly this appears when the server rejects the request (CORS/preflight) or credentials are wrong
          message = 'Invalid credentials';
        }
        show(globalErr, message);
      });
  });
}
