// Admin Events View - renders events list
import './admin.css';
import createButton from '../../components/button/button.js';

function render(events, onDelete) {
    const container = document.querySelector('#container');
    container.innerHTML = '';
    
    // Main wrapper
    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-container';
    
    // Header
    const header = document.createElement('h1');
    header.textContent = 'Admin Panel - Events Management';
    adminDiv.appendChild(header);
    
    const subtitle = document.createElement('p');
    subtitle.textContent = `Total events: ${events.length}`;
    adminDiv.appendChild(subtitle);

    // ADD NAVIGATION HERE (new lines)
    const nav = createNavButtons();
    adminDiv.appendChild(nav);
    
    // Events list
    const eventsList = document.createElement('div');
    eventsList.className = 'posts-list';
    
    if (events.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No events found.';
        eventsList.appendChild(emptyMsg);
    } else {
        events.forEach(event => {
            const eventCard = createEventCard(event, onDelete);
            eventsList.appendChild(eventCard);
        });
    }
    
    adminDiv.appendChild(eventsList);
    container.appendChild(adminDiv);
}

// Create a single event card element
function createEventCard(event, onDelete) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    // Organizer info
    const organizerInfo = document.createElement('div');
    organizerInfo.className = 'event-organizer-info';
    
    const organizerName = document.createElement('strong');
    organizerName.className = 'post-author-name';
    organizerName.textContent = event.organizer || 'Anonymous';
    organizerInfo.appendChild(organizerName);
    
    const eventDate = document.createElement('span');
    eventDate.className = 'post-author-unit';
    eventDate.textContent = formatDate(event.date || event.event_date);
    organizerInfo.appendChild(eventDate);
    
    card.appendChild(organizerInfo);
    
    // Content section (title + description)
    const contentSection = document.createElement('div');
    contentSection.className = 'event-content-section';
    
    // Title
    const title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent = event.title || event.name;
    contentSection.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.className = 'post-description';
    description.textContent = event.description;
    contentSection.appendChild(description);
    
    card.appendChild(contentSection);
    
    // Footer (location & attendees)
    const footer = document.createElement('div');
    footer.className = 'post-footer';
    
    const location = document.createElement('span');
    location.className = 'post-location';
    location.textContent = `📍 ${event.location || 'No location'}`;
    footer.appendChild(location);
    
    const attendees = document.createElement('span');
    attendees.className = 'post-responses';
    attendees.textContent = `👥 ${event.attendees || 0} attending`;
    footer.appendChild(attendees);
    
    card.appendChild(footer);
    
    // Delete button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'post-actions';
    
    const deleteBtn = createButton({
        label: '🗑️ Delete',
        className: 'lc-button',
        onClick: () => onDelete(event.event_id)
    });
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);
    
    return card;
}

// Helper: Format date
function formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Create navigation buttons
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
        // Import and call init (posts)
        const controller = await import('../../controller/adminController.js');
        controller.init();
    };
    
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = '📅 Events';
    eventsBtn.className = 'lc-button lc-button--primary';
    eventsBtn.style.padding = '10px 20px';

    // NEW: Add Users button
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