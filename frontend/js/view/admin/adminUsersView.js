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
    
    // User header
    const userHeader = document.createElement('div');
    userHeader.style.marginBottom = '15px';
    userHeader.style.display = 'flex';
    userHeader.style.justifyContent = 'space-between';
    userHeader.style.alignItems = 'center';
    
    const username = document.createElement('h3');
    username.textContent = user.username || user.name || 'Unknown User';
    username.style.margin = '0';
    
    const userId = document.createElement('span');
    userId.style.color = '#666';
    userId.style.fontSize = '14px';
    userId.textContent = `ID: ${user.user_id || user.id}`;
    
    userHeader.appendChild(username);
    userHeader.appendChild(userId);
    card.appendChild(userHeader);
    
    // User details
    if (user.email) {
        const email = document.createElement('p');
        email.style.color = '#555';
        email.style.margin = '5px 0';
        email.textContent = `📧 ${user.email}`;
        card.appendChild(email);
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
    deleteBtn.style.marginTop = '15px';
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

export default { render };