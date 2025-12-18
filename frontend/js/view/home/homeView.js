import './home.css';
import createButton from "../../components/button/button.js";

function render(data) {
    const { reports = [], posts = [], events = [] } = data;
    
    const container = document.querySelector('#container');
    container.innerHTML = '';

    const homeDiv = document.createElement('div');
    homeDiv.className = 'home-view home-container'; // Add 'home-view' wrapper

    // Reports Section (only if there are reports)
    if (reports.length > 0) {
        const reportsSection = createReportsSection(reports);
        homeDiv.appendChild(reportsSection);
    }

    // Main Content Grid (Posts + Events)
    const mainGrid = document.createElement('div');
    mainGrid.className = 'home-main-grid';

    // Posts Section
    const postsSection = createPostsSection(posts);
    mainGrid.appendChild(postsSection);

    // Events Section
    const eventsSection = createEventsSection(events);
    mainGrid.appendChild(eventsSection);

    homeDiv.appendChild(mainGrid);
    container.appendChild(homeDiv);
}

// ========================================
// REPORTS SECTION
// ========================================
function createReportsSection(reports) {
    const section = document.createElement('section');
    section.className = 'home-section reports-section';

    const header = document.createElement('div');
    header.className = 'section-header';

    const title = document.createElement('h2');
    title.textContent = '🚩 Reports';
    header.appendChild(title);

    const viewAllBtn = createButton({
        label: 'View All →',
        className: 'lc-button',
        onClick: () => window.location.href = '/reports'
    });
    header.appendChild(viewAllBtn);

    section.appendChild(header);

    // Reports Grid (horizontal scroll on desktop)
    const reportsGrid = document.createElement('div');
    reportsGrid.className = 'reports-grid';

    reports.forEach(report => {
        const card = createReportCard(report);
        reportsGrid.appendChild(card);
    });

    section.appendChild(reportsGrid);
    return section;
}

function createReportCard(report) {
    const content = document.createElement('div');
    content.className = 'report-content';
    content.onclick = () => window.location.href = '/reports';

    // Title
    const title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent = report.title || 'Untitled Report';
    content.appendChild(title);

    // Status Badge
    const status = document.createElement('span');
    status.className = 'status-badge';
    const statusText = report.status || 'OPEN';
    status.className += ` status-${statusText.toLowerCase().replace(' ', '-')}`;
    status.textContent = statusText;
    content.appendChild(status);

    // Description
    if (report.description) {
        const desc = document.createElement('p');
        desc.className = 'post-description';
        desc.textContent = report.description;
        content.appendChild(desc);
    }

    // Timestamp
    const time = document.createElement('span');
    time.className = 'post-time';
    time.textContent = getTimeAgo(report.createdAt || report.timestamp);
    content.appendChild(time);

    return content;
}

// ========================================
// POSTS SECTION
// ========================================
function createPostsSection(posts) {
    const section = document.createElement('section');
    section.className = 'home-section posts-section';

    const header = document.createElement('div');
    header.className = 'section-header';

    const title = document.createElement('h2');
    title.textContent = '📝 Recent Posts';
    header.appendChild(title);

    const viewAllBtn = createButton({
        label: 'View All →',
        className: 'lc-button',
        onClick: () => window.location.href = '/posts'
    });
    header.appendChild(viewAllBtn);

    section.appendChild(header);

    // Posts List
    const postsList = document.createElement('div');
    postsList.className = 'posts-list-home';

    if (posts.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'No recent posts';
        postsList.appendChild(empty);
    } else {
        posts.forEach(post => {
            const card = createPostCard(post);
            postsList.appendChild(card);
        });
    }

    section.appendChild(postsList);
    return section;
}

function createPostCard(post) {

    const card = document.createElement('div');
    card.className = 'post-card';
    card.onclick = () => window.location.href = '/posts';

    // Author info
    const authorName = resolveAuthorName(post);
    const header = document.createElement('div');
    header.className = 'post-header';

    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.style.backgroundColor = getAvatarColor(authorName);
    avatar.textContent = getInitials(authorName);
    header.appendChild(avatar);

    const nameContainer = document.createElement('div');
    nameContainer.className = 'name-status-container';

    const name = document.createElement('strong');
    name.className = 'post-author-name';
    name.textContent = authorName;
    nameContainer.appendChild(name);

    const statusBadge = document.createElement('span');
    const status = post.status || 'Open';
    statusBadge.className = `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
    statusBadge.textContent = status;
    nameContainer.appendChild(statusBadge);

    header.appendChild(nameContainer);

    const time = document.createElement('span');
    time.className = 'post-time';
    time.textContent = getTimeAgo(post.createdAt || post.timestamp);
    header.appendChild(time);

    card.appendChild(header);

    // Category
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

    // Description (check both 'content' and 'description' fields)
    const desc = document.createElement('p');
    desc.className = 'post-description';
    desc.textContent = truncateText(post.content || post.description, 100);
    card.appendChild(desc);

    return card;
}

// ========================================
// EVENTS SECTION
// ========================================
function createEventsSection(events) {
    const section = document.createElement('section');
    section.className = 'home-section events-section';

    const header = document.createElement('div');
    header.className = 'section-header';

    const title = document.createElement('h2');
    title.textContent = '📅 Upcoming Events';
    header.appendChild(title);

    const viewAllBtn = createButton({
        label: 'View All →',
        className: 'lc-button',
        onClick: () => window.location.href = '/events'
    });
    header.appendChild(viewAllBtn);

    section.appendChild(header);

    // Events List
    const eventsList = document.createElement('div');
    eventsList.className = 'events-list-home';

    if (events.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'No upcoming events';
        eventsList.appendChild(empty);
    } else {
        events.forEach(event => {
            const card = createEventCard(event);
            eventsList.appendChild(card);
        });
    }

    section.appendChild(eventsList);
    return section;
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => window.location.href = '/events';

    // Organizer
    const organizer = document.createElement('strong');
    organizer.className = 'post-author-name';
    organizer.textContent = event.organizer || event.organizerName || 'Anonymous';
    card.appendChild(organizer);

    const eventDate = document.createElement('span');
    eventDate.className = 'post-author-unit';
    eventDate.style.marginLeft = '10px';
    eventDate.textContent = formatDate(event.datetime || event.date || event.event_date);
    card.appendChild(eventDate);

    // Title
    const title = document.createElement('h3');
    title.className = 'post-title';
    title.style.marginTop = '12px';
    title.textContent = event.title || event.name;
    card.appendChild(title);

    // Description
    const desc = document.createElement('p');
    desc.className = 'post-description';
    desc.textContent = truncateText(event.description, 100);
    card.appendChild(desc);

    // Footer
    const footer = document.createElement('div');
    footer.style.marginTop = '12px';
    footer.style.fontSize = '14px';
    footer.style.color = '#666';

    const location = document.createElement('span');
    location.textContent = `📍 ${event.location || 'No location'}`;
    footer.appendChild(location);

    card.appendChild(footer);

    return card;
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function resolveAuthorName(post) {
    return post.authorName || post.userName || post.creatorName || 'Anonymous';
}

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getAvatarColor(name) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    if (!name) return colors[0];
    const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return colors[Math.abs(hash) % colors.length];
}

function getCategoryLabel(category) {
    const labels = {
        'mutual-aid': 'Mutual Aid',
        'social': 'Social',
        'assistance': 'Assistance'
    };
    return labels[category] || 'Other';
}

export default { render };