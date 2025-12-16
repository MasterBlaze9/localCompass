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
    
    // Email input
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email Address';
    content.appendChild(emailLabel);
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'user@example.com';
    emailInput.id = 'add-user-email';
    content.appendChild(emailInput);
    
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
    confirmBtn.onclick = () => {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // Validate: must have email OR phone
        if (!email && !phone) {
            alert('Please enter email or phone number');
            return;
        }
        
        // Pass data to callback
        if (onConfirm) {
            onConfirm({ email, phone });
        }
        
        // Close modal
        document.body.removeChild(overlay);
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