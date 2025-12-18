// Admin Controller - coordinates admin panel logic
import adminView from '../view/admin/adminView.js';
import adminEventsView from '../view/admin/adminEventsView.js';
import createAddUserModal from '../components/addUserModal/addUserModal.js';
import postService from '../service/postService.js';
import eventService from '../service/eventService.js';
import userService from '../service/userService.js';
import reportService from '../service/reportService.js';
import adminReportsView from '../view/admin/adminReportsView.js';

// Store posts data
let posts = [];

// Initialize admin panel entry point (defaults to posts)
export async function init(options = {}) {
    return initPosts(options);
}

// Initialize reports management
export async function initReports(options = {}) {
    const { skipLoading = false } = options;
    try {
        console.log('Loading reports management...');
        if (!skipLoading) showLoading('Loading reports...');
        const reports = await reportService.getAllReports({ scope: 'building' });
        adminReportsView.render(reports, handleDeleteReport);
    } catch (error) {
        console.error('Error loading admin panel:', error);
        showError('Failed to load reports');
    }
}

// Initialize posts management
export async function initPosts(options = {}) {
    const { skipLoading = false } = options;
    try {
        console.log('Loading posts management...');
        const shouldSkipLoading = skipLoading || (posts && posts.length > 0);
        if (!shouldSkipLoading) showLoading('Loading posts...');

        posts = await postService.getAllPosts({ scope: 'building' });

        adminView.render(posts, handleDeletePost);
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load posts');
    }
}

// Handle delete post action
async function handleDeletePost(postId) {
    const confirmed = confirm('Delete this post?');
    if (!confirmed) return;

    try {
        await postService.deletePost(postId);

        // Remove from local array
        posts = posts.filter(post => (post.id ?? post.post_id ?? post.postId) !== postId);

        // Re-render
        adminView.render(posts, handleDeletePost);

        alert('Post deleted!');

    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
    }
}

// Show loading state
function showLoading(message = 'Loading...') {
    const container = document.querySelector('#container');
    container.innerHTML = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.style.padding = '40px';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.innerHTML = `<h2>${message}</h2>`;

    container.appendChild(loadingDiv);
}

// Show error state
function showError(message) {
    const container = document.querySelector('#container');
    container.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '40px';
    errorDiv.style.color = 'red';
    errorDiv.innerHTML = `<h2>Error!</h2><p>${message}</p>`;

    container.appendChild(errorDiv);
}

// ========================================
// EVENTS MANAGEMENT
// ========================================

let events = [];

// Initialize events management
export async function initEvents(options = {}) {
    const { skipLoading = false } = options;
    try {
        console.log('Loading events management...');

        const shouldSkipLoading = skipLoading || (events && events.length > 0);
        if (!shouldSkipLoading) showLoading('Loading events...');

        // Fetch events from backend
        events = await eventService.getAllEvents();
        console.log('Events loaded:', events);

        // Render events view
        adminEventsView.render(events, handleDeleteEvent);

    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events');
    }
}

// Handle delete event action
async function handleDeleteReport(reportId) {
    const confirmed = confirm('Delete this report?');
    if (!confirmed) return;
    try {
        await reportService.deleteReport(reportId);
        const reports = await reportService.getAllReports({ scope: 'building' });
        adminReportsView.render(reports, handleDeleteReport);
        alert('Report deleted!');
    } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
    }
}

async function handleDeleteEvent(eventId) {
    const confirmed = confirm('Delete this event?');
    if (!confirmed) return;

    try {
        await eventService.deleteEvent(eventId);

        // Remove from local array
        events = events.filter(event => (event.id ?? event.event_id ?? event.eventId) !== eventId);

        // Re-render
        adminEventsView.render(events, handleDeleteEvent);

        alert('Event deleted!');

    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
    }
}

// ========================================
// NAVIGATION
// ========================================

// Create navigation buttons for switching views
function createNavigation() {
    const nav = document.createElement('div');
    nav.style.marginBottom = '20px';
    nav.style.display = 'flex';
    nav.style.gap = '10px';

    // Posts button
    const postsBtn = document.createElement('button');
    postsBtn.textContent = '📝 Posts';
    postsBtn.className = 'lc-button';
    postsBtn.style.padding = '10px 20px';
    postsBtn.onclick = async () => {
        await init({ skipLoading: true });
    };

    // Events button
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button';
    eventsBtn.style.padding = '10px 20px';
    eventsBtn.onclick = async () => {
        await initEvents({ skipLoading: true });
    };

    // Reports button
    const reportsBtn = document.createElement('button');
    reportsBtn.textContent = '🚩 Reports';
    reportsBtn.className = 'lc-button';
    reportsBtn.style.padding = '10px 20px';
    reportsBtn.onclick = async () => {
        await init({ skipLoading: true });
    };

    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(reportsBtn);

    return nav;
}

// ========================================
// USERS MANAGEMENT
// ========================================

let users = [];

// Initialize users management
export async function initUsers(options = {}) {
    const { skipLoading = false } = options;
    try {
        console.log('Loading users management...');

        if (!skipLoading) showLoading('Loading users...');

        // Fetch users from backend
        users = await userService.getAllUsers();
        console.log('Users loaded:', users);

        // Import users view
        const adminUsersView = await import('../view/admin/adminUsersView.js');

        // Render users view
        adminUsersView.default.render(users, handleDeleteUser, handleAddUser);

    } catch (error) {
        console.error('Error loading users:', error);
        showError('Failed to load users');
    }
}

// Handle add user action
async function handleAddUser() {
    // Open modal
    createAddUserModal(
        // onConfirm callback - receives (data, ctx)
        async (data, ctx) => {
            try {
                const newUser = await userService.addUser(data);
                users.push(newUser);
                const adminUsersView = await import('../view/admin/adminUsersView.js');
                adminUsersView.default.render(users, handleDeleteUser, handleAddUser);
                ctx.close();
            } catch (error) {
                console.error('Error adding user:', error);
                const msg = error?.message || 'Failed to add user';
                const field = error?.field;
                const lower = msg.toLowerCase();
                // Prefer backend field mapping
                if (field === 'email') return ctx.setEmailError(msg);
                if (field === 'phone' || field === 'phoneNumber') return ctx.setPhoneError(msg);
                // Fallback heuristics
                if (lower.includes('email') && (lower.includes('duplicate') || lower.includes('exists') || lower.includes('registered'))) {
                    return ctx.setEmailError('This email is already registered');
                }
                if (lower.includes('phone') && (lower.includes('duplicate') || lower.includes('exists') || lower.includes('registered'))) {
                    return ctx.setPhoneError('This phone number is already registered');
                }
                ctx.setGlobalError(msg);
            } finally {
                ctx.setSubmitting(false);
            }
        },
        // onCancel callback (optional)
        () => {
            console.log('Add user cancelled');
        }
    );
}

// Handle delete user action
async function handleDeleteUser(userId) {
    const confirmed = confirm('Remove this user?');
    if (!confirmed) return;

    try {
        await userService.deleteUser(userId);

        // Remove from local array
        users = users.filter(user => user.user_id !== userId);

        // Re-render
        const adminUsersView = await import('../view/admin/adminUsersView.js');
        adminUsersView.default.render(users, handleDeleteUser, handleAddUser);

        alert('User removed!');

    } catch (error) {
        console.error('Error removing user:', error);
        alert('Failed to remove user');
    }
}
