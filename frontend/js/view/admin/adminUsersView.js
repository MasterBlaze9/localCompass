// Admin Users View - renders users list
import './admin.css';
import createButton from '../../components/button/button.js';
import { createGenericList } from '../../components/list/list.js';

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

    // Users list mount using list component
    const listMount = document.createElement('div');
    listMount.id = 'admin-users-list-mount';
    adminDiv.appendChild(listMount);

    container.appendChild(adminDiv);

    const listComponent = createGenericList('admin-users-list-mount', {
        renderItem: (u) => createUserCard(u, onDelete)
    });
    listComponent.updateData(Promise.resolve(users));
    const ul = document.querySelector('#admin-users-list-mount .lc-list-group');
    if (ul) ul.classList.add('lc-cols-3');
}

// Create a single user card
function createUserCard(user, onDelete) {
    const card = document.createElement('div');
    card.className = 'post-card';

    // User header
    const userHeader = document.createElement('div');
    userHeader.style.marginBottom = '15px';
    userHeader.style.display = 'flex';
    userHeader.style.justifyContent = 'space-between';
    userHeader.style.alignItems = 'center';

    const username = document.createElement('h3');
    username.textContent = user.firstName + " " + user.lastName || user.name || 'Unknown User';
    username.style.margin = '0';

    userHeader.appendChild(username);
    card.appendChild(userHeader);

    // User details
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

    if (user.apartment || user.apartment_number) {
        const apartment = document.createElement('p');
        apartment.style.color = '#555';
        apartment.style.margin = '5px 0';
        apartment.textContent = `🏠 Apartment ${user.apartment || user.apartment_number}`;
        card.appendChild(apartment);
    }

    // Delete button
    const deleteBtn = createButton({
        label: '🗑️ Remove User',
        className: 'lc-button',
        onClick: () => onDelete(user.user_id || user.id)
    });
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';

    card.appendChild(deleteBtn);

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
        controller.initPosts({ skipLoading: true });
    };

    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button';
    eventsBtn.style.padding = '10px 20px';
    eventsBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.initEvents({ skipLoading: true });
    };

    const reportsBtn = document.createElement('button');
    reportsBtn.textContent = '🚩 Reports';
    reportsBtn.className = 'lc-button';
    reportsBtn.style.padding = '10px 20px';
    reportsBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.initReports({ skipLoading: true });
    };

    const usersBtn = document.createElement('button');
    usersBtn.textContent = '👥 Users';
    usersBtn.className = 'lc-button lc-button--primary';
    usersBtn.style.padding = '10px 20px';

    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(reportsBtn);
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