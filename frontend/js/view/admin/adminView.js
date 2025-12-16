// Admin View - renders admin panel HTML
import createButton from '../../components/button/button.js';
import "./admin.css"

function render(posts, onDelete) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    // Main wrapper
    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-container';
    
    // Header
    const header = document.createElement('h1');
    header.textContent = 'Admin Panel - Posts Management';
    adminDiv.appendChild(header);
    
    const subtitle = document.createElement('p');
    subtitle.textContent = `Total posts: ${posts.length}`;
    adminDiv.appendChild(subtitle);

    // NAVIGATION
    const nav = createNavButtons();
    adminDiv.appendChild(nav);
    
    // Posts list
    const postsList = document.createElement('div');
    postsList.className = 'posts-list';
    
    if (posts.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No posts found.';
        postsList.appendChild(emptyMsg);
    } else {
        // Create a card for each post
        posts.forEach(post => {
            const postCard = createPostCard(post, onDelete);
            postsList.appendChild(postCard);
        });
    }
    
    adminDiv.appendChild(postsList);
    container.appendChild(adminDiv);
}

// Create a single post card element
function createPostCard(post, onDelete) {
    // Card container
    const card = document.createElement('div');
    card.className = 'post-card';
    
    // Post header - Avatar + Name + Status + Time
    const userInfo = document.createElement('div');
    userInfo.className = 'post-header';
    
    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.style.backgroundColor = getAvatarColor(post.authorName);
    avatar.textContent = getInitials(post.authorName);
    userInfo.appendChild(avatar);
    
    // Name and status container
    const nameStatusContainer = document.createElement('div');
    nameStatusContainer.className = 'name-status-container';
    
    // User name
    const userName = document.createElement('strong');
    userName.className = 'post-author-name';
    userName.textContent = post.authorName;
    nameStatusContainer.appendChild(userName);
    
    // Apartment number
    if (post.authorUnit || post.apartment || post.apartment_number) {
        const apartment = document.createElement('span');
        apartment.className = 'post-author-unit';
        apartment.textContent = `(Apt ${post.authorUnit || post.apartment || post.apartment_number})`;
        nameStatusContainer.appendChild(apartment);
    }
    
    // Status badge
    const statusBadge = document.createElement('span');
    const status = post.status || 'Open';
    statusBadge.className = `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
    statusBadge.textContent = status;
    nameStatusContainer.appendChild(statusBadge);
    
    userInfo.appendChild(nameStatusContainer);
    
    // Time
    const timeAgo = document.createElement('span');
    timeAgo.className = 'post-time';
    timeAgo.textContent = getTimeAgo(post.createdAt || post.timestamp);
    userInfo.appendChild(timeAgo);
    
    card.appendChild(userInfo);
    
    // Category badge
    if (post.category) {
        const badge = document.createElement('span');
        badge.className = `category-badge category-${post.category}`;
        badge.textContent = getCategoryLabel(post.category);
        card.appendChild(badge);
    }
    
    // Title
    const title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent = post.title;
    card.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.className = 'post-description';
    description.textContent = post.description;
    card.appendChild(description);
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'post-footer';
    
    const location = document.createElement('span');
    location.className = 'post-location';
    location.textContent = `📍 ${post.location || 'No location'}`;
    footer.appendChild(location);
    
    const responses = document.createElement('span');
    responses.className = 'post-responses';
    responses.textContent = `💬 ${post.responses || 0} responses`;
    footer.appendChild(responses);
    
    card.appendChild(footer);
    
    // Delete button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'post-actions';
    
    const deleteBtn = createButton({
        label: '🗑️ Delete',
        className: 'lc-button',
        onClick: () => onDelete(post.post_id)
    });
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);
    
    return card;
}

// Helper: Convert timestamp to "X hours ago"
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} min ago`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
}

// Helper: Get category display label
function getCategoryLabel(category) {
    const labels = {
        'mutual-aid': 'Mutual Aid',
        'social': 'Social',
        'assistance': 'Assistance'
    };
    return labels[category] || 'Other';
}

// Helper: Get category background color
function getCategoryColor(category) {
    const colors = {
        'mutual-aid': '#2196F3',
        'social': '#4CAF50',
        'assistance': '#9C27B0'
    };
    return colors[category] || '#757575';
}

// Create navigation buttons
function createNavButtons() {
    const nav = document.createElement('div');
    nav.style.marginBottom = '20px';
    nav.style.display = 'flex';
    nav.style.gap = '10px';
    
    const postsBtn = document.createElement('button');
    postsBtn.textContent = '📝 Posts';
    postsBtn.className = 'lc-button lc-button--primary';
    postsBtn.style.padding = '10px 20px';
    
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button';
    eventsBtn.style.padding = '10px 20px';
    eventsBtn.onclick = async () => {
        // Import and call initEvents
        const controller = await import('../../controller/adminController.js');
        controller.initEvents();
    };

    // Add Users button
    const usersBtn = document.createElement('button');
    usersBtn.textContent = '👥 Users';
    usersBtn.className = 'lc-button';
    usersBtn.style.padding = '10px 20px';
    usersBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.initUsers();
    };
    
    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(usersBtn);
    
    return nav;
}

// Helper: Get status color
function getStatusColor(status) {
    const colors = {
        'Open': '#28a745',      // Green
        'In Progress': '#ffc107', // Yellow
        'Closed': '#dc3545'     // Red
    };
    return colors[status] || '#28a745'; // Default to Open (green)
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