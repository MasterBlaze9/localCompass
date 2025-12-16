// Admin View - renders admin panel HTML
import createButton from '../../components/button/button.js';
import adminController from '../../controller/adminController.js';
import "./admin.css"

function render(posts, onDelete) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    // Main wrapper
    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-container';
    adminDiv.style.padding = '20px';
    
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
    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.border = '1px solid #ddd';
    card.style.padding = '15px';
    card.style.marginBottom = '15px';
    card.style.borderRadius = '8px';
    
    // User info
    const userInfo = document.createElement('div');
    userInfo.style.marginBottom = '10px';
    
    const userName = document.createElement('strong');
    userName.textContent = post.userName || post.author || 'Anonymous';
    userInfo.appendChild(userName);
    
    const timeAgo = document.createElement('span');
    timeAgo.style.color = '#666';
    timeAgo.style.fontSize = '14px';
    timeAgo.style.marginLeft = '10px';
    timeAgo.textContent = getTimeAgo(post.createdAt || post.timestamp);
    userInfo.appendChild(timeAgo);
    
    card.appendChild(userInfo);
    
    // Category badge
    if (post.category) {
        const badge = document.createElement('span');
        badge.style.backgroundColor = getCategoryColor(post.category);
        badge.style.color = 'white';
        badge.style.padding = '4px 10px';
        badge.style.borderRadius = '12px';
        badge.style.fontSize = '12px';
        badge.textContent = getCategoryLabel(post.category);
        card.appendChild(badge);
    }
    
    // Title
    const title = document.createElement('h3');
    title.textContent = post.title;
    title.style.margin = '10px 0';
    card.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.textContent = post.description;
    description.style.color = '#555';
    card.appendChild(description);
    
    // Footer (location & responses)
    const footer = document.createElement('div');
    footer.style.marginTop = '10px';
    footer.style.fontSize = '14px';
    footer.style.color = '#666';
    
    const location = document.createElement('span');
    location.textContent = `📍 ${post.location || 'No location'}`;
    footer.appendChild(location);
    
    const responses = document.createElement('span');
    responses.style.marginLeft = '15px';
    responses.textContent = `💬 ${post.responses || 0} responses`;
    footer.appendChild(responses);
    
    card.appendChild(footer);
    
    // Delete button using your button component
    const deleteBtn = createButton({
        label: '🗑️ Delete',
        className: 'lc-button',
        onClick: () => onDelete(post.post_id)
    });
    deleteBtn.style.marginTop = '10px';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    
    card.appendChild(deleteBtn);
    
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

export default { render };