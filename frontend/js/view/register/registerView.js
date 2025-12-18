function render() {
  const container = document.getElementById('container');
  if (!container) return;

  // Clear container and style it
  container.innerHTML = '';
  Object.assign(container.style, {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb'
  });

  // Create card
  const card = document.createElement('div');
  Object.assign(card.style, {
    width: '380px',
    background: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    fontFamily: 'Inter, Arial, sans-serif'
  });

  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Create account';
  Object.assign(title.style, {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '24px',
    fontWeight: '600'
  });

  // Global error container
  const globalError = document.createElement('div');
  globalError.id = 'register-error-global';
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

  // Create name fields wrapper
  const nameRow = document.createElement('div');
  Object.assign(nameRow.style, {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '0px'
  });

  // First name field
  const firstNameGroup = document.createElement('div');
  const firstNameLabel = document.createElement('label');
  firstNameLabel.textContent = 'First name';
  Object.assign(firstNameLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });
  const firstNameInput = document.createElement('input');
  firstNameInput.type = 'text';
  firstNameInput.placeholder = 'Jane';
  firstNameInput.setAttribute('aria-label', 'First name');
  firstNameInput.required = true;
  Object.assign(firstNameInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });
  firstNameGroup.appendChild(firstNameLabel);
  firstNameGroup.appendChild(firstNameInput);
  const firstNameErr = document.createElement('div');
  firstNameErr.id = 'register-error-firstName';
  firstNameErr.setAttribute('aria-live', 'polite');
  Object.assign(firstNameErr.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' });
  firstNameGroup.appendChild(firstNameErr);

  // Last name field
  const lastNameGroup = document.createElement('div');
  const lastNameLabel = document.createElement('label');
  lastNameLabel.textContent = 'Last name';
  Object.assign(lastNameLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });
  const lastNameInput = document.createElement('input');
  lastNameInput.type = 'text';
  lastNameInput.placeholder = 'Doe';
  lastNameInput.setAttribute('aria-label', 'Last name');
  lastNameInput.required = true;
  Object.assign(lastNameInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });
  lastNameGroup.appendChild(lastNameLabel);
  lastNameGroup.appendChild(lastNameInput);
  const lastNameErr = document.createElement('div');
  lastNameErr.id = 'register-error-lastName';
  lastNameErr.setAttribute('aria-live', 'polite');
  Object.assign(lastNameErr.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' });
  lastNameGroup.appendChild(lastNameErr);
  nameRow.appendChild(firstNameGroup);
  nameRow.appendChild(lastNameGroup);

  // Create email field
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  Object.assign(emailLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Enter your email';
  Object.assign(emailInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });
  const emailErr = document.createElement('div');
  emailErr.id = 'register-error-email';
  emailErr.setAttribute('aria-live', 'polite');
  Object.assign(emailErr.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' });

  // Create phone field
  const phoneLabel = document.createElement('label');
  phoneLabel.textContent = 'Phone number';
  Object.assign(phoneLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.placeholder = 'Enter your phone number';
  Object.assign(phoneInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });
  const phoneErr = document.createElement('div');
  phoneErr.id = 'register-error-phone';
  phoneErr.setAttribute('aria-live', 'polite');
  Object.assign(phoneErr.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' });

  // Create password field
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  Object.assign(passwordLabel.style, {
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block'
  });

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Create a password';
  Object.assign(passwordInput.style, {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dcdfe4',
    marginBottom: '6px',
    boxSizing: 'border-box',
    fontSize: '14px'
  });
  const passwordErr = document.createElement('div');
  passwordErr.id = 'register-error-password';
  passwordErr.setAttribute('aria-live', 'polite');
  Object.assign(passwordErr.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' });

  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Sign up';
  submitBtn.className = 'register-btn';
  Object.assign(submitBtn.style, {
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

  // Add hover effect
  submitBtn.addEventListener('mouseenter', () => {
    submitBtn.style.background = '#2850e8';
  });
  submitBtn.addEventListener('mouseleave', () => {
    submitBtn.style.background = '#3861fb';
  });

  // Create footer
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: '14px'
  });

  const footerText = document.createTextNode('Already have an account? ');
  const loginLink = document.createElement('a');
  loginLink.id = 'toLogin';
  loginLink.textContent = 'Sign in';
  loginLink.href = '/login';
  loginLink.role = 'button';
  Object.assign(loginLink.style, {
    color: '#3861fb',
    cursor: 'pointer',
    textDecoration: 'none'
  });

  // Add hover effect to link
  loginLink.addEventListener('mouseenter', () => {
    loginLink.style.textDecoration = 'underline';
  });
  loginLink.addEventListener('mouseleave', () => {
    loginLink.style.textDecoration = 'none';
  });

  // Assemble elements
  footer.appendChild(footerText);
  footer.appendChild(loginLink);

  card.appendChild(title);
  card.appendChild(globalError);
  card.appendChild(nameRow);
  card.appendChild(emailLabel);
  card.appendChild(emailInput);
  card.appendChild(emailErr);
  card.appendChild(phoneLabel);
  card.appendChild(phoneInput);
  card.appendChild(phoneErr);
  card.appendChild(passwordLabel);
  card.appendChild(passwordInput);
  card.appendChild(passwordErr);
  card.appendChild(submitBtn);
  card.appendChild(footer);

  container.appendChild(card);
}

export default { render };
