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

  // inputs
  const firstNameInput = container.querySelector('input[aria-label="First name"]');
  const lastNameInput = container.querySelector('input[aria-label="Last name"]');
  const emailInput = container.querySelector('input[type="email"]');
  const phoneInput = container.querySelector('input[type="tel"]');
  const passwordInput = container.querySelector('input[type="password"]');

  // errors
  const eFirst = container.querySelector('#register-error-firstName');
  const eLast = container.querySelector('#register-error-lastName');
  const eEmail = container.querySelector('#register-error-email');
  const ePhone = container.querySelector('#register-error-phone');
  const ePwd = container.querySelector('#register-error-password');
  const eGlobal = container.querySelector('#register-error-global');

  // helpers
  const show = (el, msg) => { if (!el) return; el.textContent = msg; el.style.display = 'block'; };
  const clear = (el) => { if (!el) return; el.textContent = ''; el.style.display = 'none'; };
  const markInvalid = (input, invalid) => {
    if (!input) return;
    input.style.border = invalid ? '1px solid #ef4444' : '1px solid #dcdfe4';
    input.style.backgroundColor = invalid ? '#fef2f2' : '#fff';
  };

  const clearAllErrors = () => {
    [eFirst, eLast, eEmail, ePhone, ePwd, eGlobal].forEach(clear);
    [firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput].forEach(i => markInvalid(i, false));
  };

  // clear on typing
  firstNameInput?.addEventListener('input', () => { clear(eFirst); clear(eGlobal); markInvalid(firstNameInput, false); });
  lastNameInput?.addEventListener('input', () => { clear(eLast); clear(eGlobal); markInvalid(lastNameInput, false); });
  emailInput?.addEventListener('input', () => { clear(eEmail); clear(eGlobal); markInvalid(emailInput, false); });
  phoneInput?.addEventListener('input', () => { clear(ePhone); clear(eGlobal); markInvalid(phoneInput, false); });
  passwordInput?.addEventListener('input', () => { clear(ePwd); clear(eGlobal); markInvalid(passwordInput, false); });

  signUpBtn.addEventListener('click', () => {
    const firstName = firstNameInput?.value?.trim();
    const lastName = lastNameInput?.value?.trim();
    const email = emailInput?.value;
    const phone = phoneInput?.value;
    const password = passwordInput?.value;

    clearAllErrors();

    let hasError = false;
    if (!firstName) { show(eFirst, 'First name is required'); markInvalid(firstNameInput, true); hasError = true; }
    if (!lastName) { show(eLast, 'Last name is required'); markInvalid(lastNameInput, true); hasError = true; }

    if (!email && !phone) {
      show(eEmail, 'Provide email or phone');
      show(ePhone, 'Provide email or phone');
      markInvalid(emailInput, true); markInvalid(phoneInput, true);
      hasError = true;
    }
    if (!password) { show(ePwd, 'Password is required'); markInvalid(passwordInput, true); hasError = true; }

    if (email && !isEmail(email)) { show(eEmail, 'Invalid email format'); markInvalid(emailInput, true); hasError = true; }
    if (phone && !isPhone(phone)) { show(ePhone, 'Invalid phone number'); markInvalid(phoneInput, true); hasError = true; }

    if (hasError) return;

    const payload = { firstName, lastName, password };
    if (email) payload.email = email.trim();
    if (phone) payload.phone = phone.trim();

    userService.register(payload)
      .then(() => {
        window.location.href = '/login';
      })
      .catch(err => {
        console.error('Registration failed:', err);
        const msg = err?.message || 'Registration failed';
        const lower = msg.toLowerCase();
        const emailProvided = !!emailInput?.value?.trim();
        const phoneProvided = !!phoneInput?.value?.trim();
        const looksDuplicate = err?.code === 'DUPLICATE' || err?.code === 'DUPLICATE_EMAIL' || err?.code === 'DUPLICATE_PHONE' || lower.includes('duplicate') || lower.includes('already exists') || lower.includes('already registered');

        // If only one identifier was provided and it looks like a duplicate, favor the provided field regardless of backend labeling
        if (looksDuplicate) {
          if (!emailProvided && phoneProvided) {
            show(ePhone, 'This phone number is already registered');
            markInvalid(phoneInput, true);
            return;
          }
          if (emailProvided && !phoneProvided) {
            show(eEmail, 'This email is already registered');
            markInvalid(emailInput, true);
            return;
          }
        }

        // Otherwise, try backend-provided field first
        const field = err?.field;
        if (field === 'email') {
          show(eEmail, msg);
          markInvalid(emailInput, true);
          return;
        }
        if (field === 'phone' || field === 'phoneNumber') {
          show(ePhone, msg);
          markInvalid(phoneInput, true);
          return;
        }

        // Fallback to message keywords
        if (lower.includes('email') && (lower.includes('exists') || lower.includes('registered') || lower.includes('duplicate'))) {
          show(eEmail, 'This email is already registered');
          markInvalid(emailInput, true);
          return;
        }
        if (lower.includes('phone') && (lower.includes('exists') || lower.includes('registered') || lower.includes('duplicate'))) {
          show(ePhone, 'This phone number is already registered');
          markInvalid(phoneInput, true);
          return;
        }
        show(eGlobal, msg);
      });
  });

}

