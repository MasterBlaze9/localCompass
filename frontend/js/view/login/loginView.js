function render() {
  const container = document.getElementById('container');
  if (!container) return;

  container.innerHTML = '';
  Object.assign(container.style, {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb'
  });

  const card = document.createElement('div');
  Object.assign(card.style, {
    width: '380px',
    background: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    fontFamily: 'Inter, Arial, sans-serif'
  });

  const title = document.createElement('h2');
  title.textContent = 'Welcome back';
  Object.assign(title.style, {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '24px',
    fontWeight: '600'
  });

  // Global error container
  const globalError = document.createElement('div');
  globalError.id = 'login-error-global';
  globalError.setAttribute('aria-live', 'polite');
  Object.assign(globalError.style, {
    display: 'none',
    background: '#fde8e8',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  });

  const idLabel = document.createElement('label');
  idLabel.textContent = 'Email or phone';
  Object.assign(idLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });

  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.placeholder = 'Email or phone number';
  idInput.className = 'login-input';
  Object.assign(idInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '16px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });

  const idError = document.createElement('div');
  idError.id = 'login-error-identifier';
  idError.setAttribute('aria-live', 'polite');
  Object.assign(idError.style, {
    display: 'none',
    color: '#b91c1c',
    fontSize: '12px',
    marginBottom: '10px'
  });

  const pwdLabel = document.createElement('label');
  pwdLabel.textContent = 'Password';
  Object.assign(pwdLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });

  const pwdInput = document.createElement('input');
  pwdInput.type = 'password';
  pwdInput.placeholder = 'Your password';
  pwdInput.className = 'login-input';
  Object.assign(pwdInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });

  const pwdError = document.createElement('div');
  pwdError.id = 'login-error-password';
  pwdError.setAttribute('aria-live', 'polite');
  Object.assign(pwdError.style, {
    display: 'none',
    color: '#b91c1c',
    fontSize: '12px',
    marginBottom: '10px'
  });

  const row = document.createElement('div');
  Object.assign(row.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '14px'
  });

  const rememberLabel = document.createElement('label');
  const rememberChk = document.createElement('input');
  rememberChk.type = 'checkbox';
  rememberLabel.appendChild(rememberChk);
  rememberLabel.appendChild(document.createTextNode(' Remember me'));

  const forgot = document.createElement('span');
  forgot.textContent = 'Forgot password';
  Object.assign(forgot.style, {
    color: '#6b7280',
    cursor: 'pointer'
  });

  row.appendChild(rememberLabel);
  row.appendChild(forgot);

  const loginBtn = document.createElement('button');
  loginBtn.textContent = 'Sign in';
  loginBtn.className = 'login-btn';
  Object.assign(loginBtn.style, {
    width: '100%',
    padding: '12px',
    background: '#3861fb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  });
  loginBtn.addEventListener('mouseenter', () => { loginBtn.style.background = '#2850e8'; });
  loginBtn.addEventListener('mouseleave', () => { loginBtn.style.background = '#3861fb'; });

  const footer = document.createElement('div');
  Object.assign(footer.style, {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: '14px'
  });

  const footerText = document.createTextNode('Don\'t have an account? ');
  const registerLink = document.createElement('a');
  registerLink.id = 'toRegister';
  registerLink.textContent = 'Sign up';
  registerLink.href = '/register';
  registerLink.role = 'button';
  Object.assign(registerLink.style, {
    color: '#3861fb',
    cursor: 'pointer',
    textDecoration: 'none'
  });
  registerLink.addEventListener('mouseenter', () => { registerLink.style.textDecoration = 'underline'; });
  registerLink.addEventListener('mouseleave', () => { registerLink.style.textDecoration = 'none'; });

  footer.appendChild(footerText);
  footer.appendChild(registerLink);

  card.appendChild(title);
  card.appendChild(globalError);
  card.appendChild(idLabel);
  card.appendChild(idInput);
  card.appendChild(idError);
  card.appendChild(pwdLabel);
  card.appendChild(pwdInput);
  card.appendChild(pwdError);
  card.appendChild(row);
  card.appendChild(loginBtn);
  card.appendChild(footer);

  container.appendChild(card);
}

export default { render };
