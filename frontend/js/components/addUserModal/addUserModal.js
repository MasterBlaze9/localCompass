// Add User Modal Component
import './addUserModal.css';

function createAddUserModal(onConfirm, onCancel) {
    // Modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'add-user-modal-overlay';

    // Modal box
    const modal = document.createElement('div');
    modal.className = 'add-user-modal-box';

    // Modal header
    const header = document.createElement('div');
    header.className = 'add-user-modal-header';

    const title = document.createElement('h3');
    title.textContent = 'Add New User';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'add-user-modal-close';
    closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    };
    header.appendChild(closeBtn);

    modal.appendChild(header);

    // Modal content with form
    const content = document.createElement('div');
    content.className = 'add-user-modal-content';

    // Global error
    const globalError = document.createElement('div');
    globalError.setAttribute('aria-live', 'polite');
    Object.assign(globalError.style, { display: 'none', background: '#fde8e8', color: '#b91c1c', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px', fontSize: '13px' });
    content.appendChild(globalError);

    // Email input
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email Address';
    content.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'user@example.com';
    emailInput.id = 'add-user-email';
    content.appendChild(emailInput);
    const emailError = document.createElement('div');
    emailError.setAttribute('aria-live', 'polite');
    Object.assign(emailError.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginTop: '6px', marginBottom: '6px' });
    content.appendChild(emailError);

    // OR text
    const orText = document.createElement('p');
    orText.textContent = 'OR';
    orText.style.textAlign = 'center';
    orText.style.color = '#999';
    orText.style.margin = '10px 0';
    content.appendChild(orText);

    // Phone input
    const phoneLabel = document.createElement('label');
    phoneLabel.textContent = 'Phone Number';
    content.appendChild(phoneLabel);

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = '+351 912 345 678';
    phoneInput.id = 'add-user-phone';
    content.appendChild(phoneInput);
    const phoneError = document.createElement('div');
    phoneError.setAttribute('aria-live', 'polite');
    Object.assign(phoneError.style, { display: 'none', color: '#b91c1c', fontSize: '12px', marginTop: '6px', marginBottom: '6px' });
    content.appendChild(phoneError);

    modal.appendChild(content);

    // Modal footer
    const footer = document.createElement('div');
    footer.className = 'add-user-modal-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'lc-button';
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Add User';
    confirmBtn.className = 'lc-button lc-button--primary';

    // helpers for errors/state
    const show = (el, msg) => { el.textContent = msg; el.style.display = 'block'; };
    const clear = (el) => { el.textContent = ''; el.style.display = 'none'; };
    const markInvalid = (input, invalid) => {
        input.style.border = invalid ? '1px solid #ef4444' : '';
        input.style.backgroundColor = invalid ? '#fef2f2' : '';
    };
    const clearAll = () => {
        clear(globalError); clear(emailError); clear(phoneError);
        markInvalid(emailInput, false); markInvalid(phoneInput, false);
    };
    const setSubmitting = (submitting) => {
        confirmBtn.disabled = submitting;
        confirmBtn.textContent = submitting ? 'Adding...' : 'Add User';
    };

    emailInput.addEventListener('input', () => { clear(emailError); clear(globalError); markInvalid(emailInput, false); });
    phoneInput.addEventListener('input', () => { clear(phoneError); clear(globalError); markInvalid(phoneInput, false); });

    confirmBtn.onclick = async () => {
        clearAll();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        // Validate: must have email OR phone
        if (!email && !phone) {
            show(emailError, 'Provide email or phone');
            show(phoneError, 'Provide email or phone');
            markInvalid(emailInput, true); markInvalid(phoneInput, true);
            return;
        }
        if (!onConfirm) return;

        setSubmitting(true);
        try {
            await onConfirm({ email, phone }, {
                close: () => { document.body.removeChild(overlay); },
                setSubmitting,
                clearErrors: clearAll,
                setGlobalError: (msg) => show(globalError, msg),
                setEmailError: (msg) => { show(emailError, msg); markInvalid(emailInput, true); },
                setPhoneError: (msg) => { show(phoneError, msg); markInvalid(phoneInput, true); }
            });
        } finally {
            setSubmitting(false);
        }
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus first input
    emailInput.focus();

    return overlay;
}

export default createAddUserModal;
