// Admin Events View - renders events list
import './admin.css';
import createButton from '../../components/button/button.js';

// Normalize attendee data across API shapes and fall back to zero
function resolveAttendeeCount(event) {
    const candidates = [
        event.attendees,
        event.attendees_count,
        event.attendeesCount,
        event.attendee_count,
        event.attendeeCount
    ];

    // If an array is provided, dedupe by user ID and count only active statuses
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            const activeStatuses = new Set(['joined', 'attending', 'accepted']);
            const declinedStatuses = new Set(['declined', 'cancelled', 'canceled', 'removed']);
            const uniqueIds = new Set();
            let count = 0;
            for (const a of candidate) {
                // Primitive ID
                if (a === null || a === undefined) continue;
                if (typeof a !== 'object') {
                    const idVal = String(a);
                    if (!uniqueIds.has(idVal)) {
                        uniqueIds.add(idVal);
                        count++;
                    }
                    continue;
                }

                // Object attendee
                const id = a.id ?? a.userId ?? a.user_id ?? a.uid ?? null;
                const statusRaw = a.status ?? a.state ?? a.attendanceStatus ?? null;
                const status = typeof statusRaw === 'string' ? statusRaw.toLowerCase() : null;

                // Exclude explicit declined/cancelled statuses
                if (status && declinedStatuses.has(status)) continue;
                // If status provided, include only known active statuses; if no status, treat as active
                const isActive = status ? activeStatuses.has(status) : true;
                if (!isActive) continue;

                const idKey = id !== null && id !== undefined ? String(id) : JSON.stringify(a);
                if (!uniqueIds.has(idKey)) {
                    uniqueIds.add(idKey);
                    count++;
                }
            }
            return count;
        }

        const numeric = Number(candidate);
        if (Number.isFinite(numeric)) return numeric;
    }

    return 0;
}

// Normalize organizer name across possible payload shapes
function resolveOrganizerName(event) {
    const nameCandidates = [
        event.organizerName,
        event.creatorName,
        event.ownerName,
        event.userName,
        event.organizer,
        event.creator,
        event.owner,
        event.user
    ];
    for (const c of nameCandidates) {
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

// Normalize event date/datetime across fields
function resolveEventDate(event) {
    return (
        event.datetime ||
        event.date ||
        event.event_date ||
        null
    );
}

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
    organizerInfo.style.marginBottom = '10px';

    const organizerName = document.createElement('strong');
    organizerName.textContent = resolveOrganizerName(event);
    organizerInfo.appendChild(organizerName);

    const eventDate = document.createElement('span');
    eventDate.style.color = '#666';
    eventDate.style.fontSize = '14px';
    eventDate.style.marginLeft = '10px';
    eventDate.textContent = formatDate(resolveEventDate(event));
    organizerInfo.appendChild(eventDate);

    card.appendChild(organizerInfo);

    // Title
    const title = document.createElement('h3');
    title.textContent = event.title || event.name;
    title.style.margin = '10px 0';
    card.appendChild(title);

    // Description
    const description = document.createElement('p');
    description.textContent = event.description;
    description.style.color = '#555';
    card.appendChild(description);

    // Footer (location & attendees)
    const footer = document.createElement('div');
    footer.style.marginTop = '10px';
    footer.style.fontSize = '14px';
    footer.style.color = '#666';

    const location = document.createElement('span');
    location.textContent = `📍 ${event.location || 'No location'}`;
    footer.appendChild(location);

    const attendeesCount = resolveAttendeeCount(event);
    const attendees = document.createElement('span');
    attendees.style.marginLeft = '15px';
    attendees.textContent = `👥 ${attendeesCount} attending`;
    footer.appendChild(attendees);

    card.appendChild(footer);

    // Delete button
    const deleteBtn = createButton({
        label: '🗑️ Delete',
        className: 'lc-button',
        onClick: () => onDelete(event.event_id)
    });
    deleteBtn.style.marginTop = '10px';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';

    card.appendChild(deleteBtn);

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
        controller.init({ skipLoading: true });
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
        controller.initUsers({ skipLoading: true });
    };

    nav.appendChild(postsBtn);
    nav.appendChild(eventsBtn);
    nav.appendChild(usersBtn);

    return nav;
}
export default { render };