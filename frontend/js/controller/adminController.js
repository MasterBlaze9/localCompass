// Admin Controller - coordinates admin panel logic
import adminView from '../view/admin/adminView.js';
import adminService from '../service/adminService.js';
import adminEventsView from '../view/admin/adminEventsView.js';

// Store posts data
let posts = [];

// Initialize admin panel
export async function init() {
    try {
        console.log('Loading admin panel...');
        
        showLoading();
        
        // Load posts by default
        posts = await adminService.getAllPosts();
        console.log('Posts loaded:', posts);
        adminView.render(posts, handleDeletePost);
        
    } catch (error) {
        console.error('Error loading admin panel:', error);
        showError('Failed to load posts');
    }
}

// Handle delete post action
async function handleDeletePost(postId) {
    const confirmed = confirm('Delete this post?');
    if (!confirmed) return;
    
    try {
        await adminService.deletePost(postId);
        
        // Remove from local array
        posts = posts.filter(post => post.post_id !== postId);
        
        // Re-render
        adminView.render(posts, handleDeletePost);
        
        alert('Post deleted!');
        
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
    }
}

// Show loading state
function showLoading() {
    const container = document.querySelector('#container');
    container.innerHTML = '';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.style.padding = '40px';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.innerHTML = '<h2>Loading posts...</h2>';
    
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
export async function initEvents() {
    try {
        console.log('Loading events management...');
        
        showLoading();
        
        // Fetch events from backend
        events = await adminService.getAllEvents();
        console.log('Events loaded:', events);
        
        // Render events view
        adminEventsView.render(events, handleDeleteEvent);
        
    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events');
    }
}

// Handle delete event action
async function handleDeleteEvent(eventId) {
    const confirmed = confirm('Delete this event?');
    if (!confirmed) return;
    
    try {
        await adminService.deleteEvent(eventId);
        
        // Remove from local array
        events = events.filter(event => event.event_id !== eventId);
        
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
        await init();
    };
    
    // Events button
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button';
    eventsBtn.style.padding = '10px 20px';
    eventsBtn.onclick = async () => {
        await initEvents();
    };
    
    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    
    return nav;
}

// ========================================
// USERS MANAGEMENT
// ========================================

let users = [];

// Initialize users management
export async function initUsers() {
    try {
        console.log('Loading users management...');
        
        showLoading();
        
        // Fetch users from backend
        users = await adminService.getAllUsers();
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
    const username = prompt('Enter username:');
    if (!username || username.trim() === '') return;
    
    try {
        const newUser = await adminService.addUser(username.trim());
        
        // Add to local array
        users.push(newUser);
        
        // Re-render
        const adminUsersView = await import('../view/admin/adminUsersView.js');
        adminUsersView.default.render(users, handleDeleteUser, handleAddUser);
        
        alert('User added!');
        
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user');
    }
}

// Handle delete user action
async function handleDeleteUser(userId) {
    const confirmed = confirm('Remove this user?');
    if (!confirmed) return;
    
    try {
        await adminService.deleteUser(userId);
        
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