// Admin View - renders admin panel HTML
import createButton from '../../components/button/button.js';
import { createGenericList } from '../../components/list/list.js';
import "./admin.css"

function render(posts, onDelete) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    // Create admin div container
    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-view';

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

    // Create list mount point
    const listMount = document.createElement('div');
    listMount.id = 'admin-posts-list-mount';
    adminDiv.appendChild(listMount);

    // Attach the admin content before initializing the list so the mount exists in the DOM
    container.appendChild(adminDiv);

    // Create the list component
    const listComponent = createGenericList('admin-posts-list-mount', {
        renderItem: (post) => createPostCard(post, onDelete)
    });
    // force 2 columns for posts
    const ul = document.querySelector('#admin-posts-list-mount .lc-list-group');
    if (ul) ul.classList.add('lc-cols-2');

    // Load data into list
    listComponent.updateData(Promise.resolve(posts));

}

// Create a single post card element
function createPostCard(post, onDelete) {
    const authorName = resolveAuthorName(post);
    // Card container
    const card = document.createElement('li');
    card.className = 'lc-card post-card';

    // Post header - Avatar + Name + Status + Time
    const userInfo = document.createElement('div');
    userInfo.className = 'post-header';

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.style.backgroundColor = getAvatarColor(authorName);
    avatar.textContent = getInitials(authorName);
    userInfo.appendChild(avatar);

    // Name and status container
    const nameStatusContainer = document.createElement('div');
    nameStatusContainer.className = 'name-status-container';

    // User name
    const userName = document.createElement('strong');
    userName.className = 'post-author-name';
    userName.textContent = authorName;
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
    location.textContent = `📍 ${resolveLocation(post)}`;
    footer.appendChild(location);

    const responses = document.createElement('span');
    responses.className = 'post-responses';
    responses.textContent = `💬 ${resolveResponsesCount(post)} responses`;
    footer.appendChild(responses);

    card.appendChild(footer);

    // Delete button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'post-actions';

    const deleteBtn = createButton({
        label: '🗑️ Delete',
        className: 'lc-button',
        onClick: () => onDelete(post.id)
    });
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';

    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);

    return card;
}

// Normalize author name across possible payload shapes
function resolveAuthorName(post) {
    const candidates = [
        post.authorName,
        post.userName,
        post.creatorName,
        post.createdBy,
        post.author,
        post.user,
        post.creator
    ];
    for (const c of candidates) {
        if (!c) continue;
        if (typeof c === 'string' && c.trim()) return c.trim();
        if (typeof c === 'object') {
            const first = c.firstName || c.first_name;
            const last = c.lastName || c.last_name;
            const full = [first, last].filter(Boolean).join(' ').trim();
            if (full) return full;
            const objName = c.name || c.userName;
            if (objName && String(objName).trim()) return String(objName).trim();
        }
    }
    return 'Anonymous';
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

// Normalize post location across possible fields
function resolveLocation(post) {
    const candidates = [
        post.location,
        post.location_name,
        post.address,
        post.place,
        post.area,
        post.buildingName // fallback to building name from backend
    ];
    for (const c of candidates) {
        if (!c) continue;
        const val = typeof c === 'string' ? c : (c.name || c.title || c.label);
        if (val && String(val).trim()) return String(val).trim();
    }
    return 'No location';
}

// Normalize post responses/comments count across fields
function resolveResponsesCount(post) {
    const candidates = [
        post.responses,
        post.response_count,
        post.responses_count,
        post.acceptancesCount, // backend-provided count
        post.comments,
        post.comments_count,
        post.comment_count
    ];
    for (const c of candidates) {
        if (Array.isArray(c)) return c.length;
        const n = Number(c);
        if (Number.isFinite(n)) return n;
    }
    return 0;
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
    usersBtn.className = 'lc-button';
    usersBtn.style.padding = '10px 20px';
    usersBtn.onclick = async () => {
        const controller = await import('../../controller/adminController.js');
        controller.initUsers({ skipLoading: true });
    };

    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(reportsBtn);
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