// Admin Users View - renders users list
import './admin.css';
import createButton from '../../components/button/button.js';

function render(users, onDelete, onAdd) {
    const container = document.querySelector('#container');
    container.innerHTML = '';
    
    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-container';
    
    // Header
    const header = document.createElement('h1');
    header.textContent = 'Admin Panel - Users Management';
    adminDiv.appendChild(header);
    
    const subtitle = document.createElement('p');
    subtitle.textContent = `Total users: ${users.length}`;
    adminDiv.appendChild(subtitle);
    
    // Navigation buttons
    const nav = createNavButtons();
    adminDiv.appendChild(nav);
    
    // Add User Button
    const addBtn = createButton({
        label: '+ Add New User',
        className: 'lc-button lc-button--primary',
        onClick: onAdd
    });
    addBtn.style.marginBottom = '20px';
    adminDiv.appendChild(addBtn);
    
    // Users list
    const usersList = document.createElement('div');
    usersList.className = 'posts-list';
    
    if (users.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No users found.';
        usersList.appendChild(emptyMsg);
    } else {
        users.forEach(user => {
            const userCard = createUserCard(user, onDelete);
            usersList.appendChild(userCard);
        });
    }
    
    adminDiv.appendChild(usersList);
    container.appendChild(adminDiv);
}

// Create a single user card
function createUserCard(user, onDelete) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    // Handle name properly
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const displayName = fullName || user.name || user.username || 'Unknown User';
    
    // Get unit number
    const unitNumber = user.unitNumber || user.unit || user.apartment || user.apartment_number || user.apartmentNumber;
    
    // User header - Avatar + Name (matching post-header structure)
    const userInfo = document.createElement('div');
    userInfo.className = 'post-header';
    
    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.style.backgroundColor = getAvatarColor(displayName);
    avatar.textContent = getInitials(displayName);
    userInfo.appendChild(avatar);
    
    // Name container
    const nameContainer = document.createElement('div');
    nameContainer.className = 'name-status-container';
    
    // User name with unit
    const userName = document.createElement('strong');
    userName.className = 'post-author-name';
    if (unitNumber) {
        userName.textContent = `${displayName} - Apt: ${unitNumber}  `;
    } else {
        userName.textContent = displayName;
    }
    nameContainer.appendChild(userName);
    
    userInfo.appendChild(nameContainer);
    card.appendChild(userInfo);
    
    // User details section
    const detailsSection = document.createElement('div');
    detailsSection.className = 'user-details-section';
    
    // Email
    if (user.email) {
        const emailDiv = document.createElement('div');
        emailDiv.className = 'user-detail-item';
        
        const emailIcon = document.createElement('span');
        emailIcon.className = 'user-detail-icon';
        emailIcon.textContent = '📧';
        
        const emailText = document.createElement('span');
        emailText.className = 'user-detail-text';
        emailText.textContent = user.email;
        
        emailDiv.appendChild(emailIcon);
        emailDiv.appendChild(emailText);
        detailsSection.appendChild(emailDiv);
    }
    
    // Phone number
    if (user.phone || user.phoneNumber || user.phone_number) {
        const phoneDiv = document.createElement('div');
        phoneDiv.className = 'user-detail-item';
        
        const phoneIcon = document.createElement('span');
        phoneIcon.className = 'user-detail-icon';
        phoneIcon.textContent = '📱';
        
        const phoneText = document.createElement('span');
        phoneText.className = 'user-detail-text';
        phoneText.textContent = user.phone || user.phoneNumber || user.phone_number;
        
        phoneDiv.appendChild(phoneIcon);
        phoneDiv.appendChild(phoneText);
        detailsSection.appendChild(phoneDiv);
    }
    
    card.appendChild(detailsSection);
    
    // Delete button (matching adminView.js structure)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'post-actions';
    
    const deleteBtn = createButton({
        label: '🗑️ Remove User',
        className: 'lc-button',
        onClick: () => onDelete(user.user_id || user.id)
    });
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);
    
    return card;
}

// Navigation buttons
function createNavButtons() {
    const nav = document.createElement('div');
    nav.style.marginBottom = '20px';
    nav.style.display = 'flex';
    nav.style.gap = '10px';
    
    const postsBtn = document.createElement('button');
    postsBtn.textContent = '📝 Posts';
    postsBtn.className = 'lc-button';
    postsBtn.style.padding = '10px 20px';
    postsBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.init();
    };
    
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button';
    eventsBtn.style.padding = '10px 20px';
    eventsBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.initEvents();
    };
    
    const usersBtn = document.createElement('button');
    usersBtn.textContent = '👥 Users';
    usersBtn.className = 'lc-button lc-button--primary';
    usersBtn.style.padding = '10px 20px';
    
    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(usersBtn);
    
    return nav;
}

// Helper: Get initials from name
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Helper: Get avatar color based on name
function getAvatarColor(name) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    
    if (!name) return colors[0];
    
    // Generate color based on name
    const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
}

export default { render };