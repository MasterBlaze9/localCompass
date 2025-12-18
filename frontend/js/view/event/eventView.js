import '../../components/button/button.css';
import './event.css';
import openModal from '../../components/modal/modal.js';
import { createGenericList } from '../../components/list/list.js';

// Normalize a datetime value into the string format expected by a datetime-local input
function formatDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function render(items = [], currentUser = null, handlers = {}, currentScope = 'mine', attendingIdSet = null) {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  // --- Header ---
  const header = document.createElement('h1');
  header.textContent = 'Events';
  header.style.textAlign = 'center';
  header.style.marginBottom = '24px';
  container.appendChild(header);

  // --- Filter Tabs ---
  const tabs = document.createElement('div');
  tabs.style.display = 'flex';
  tabs.style.gap = '8px';
  tabs.style.margin = '8px 0 16px';
  tabs.style.flexWrap = 'wrap';
  const mkTab = (label, scope) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = 'lc-button' + (currentScope === scope ? ' lc-button--primary' : '');
    b.style.flex = '1';
    b.style.minWidth = '100px';
    b.addEventListener('click', () => handlers?.onFilter && handlers.onFilter(scope));
    return b;
  };
  tabs.append(mkTab('My events', 'mine'), mkTab('Attending', 'attending'), mkTab('Available', 'available'));
  container.appendChild(tabs);

  // --- Create Event Button ---
  const createBtn = document.createElement('button');
  createBtn.textContent = 'Create Event';
  createBtn.className = 'lc-button lc-button--primary';
  createBtn.style.width = '100%';
  createBtn.addEventListener('click', () => handlers?.onCreate && handlers.onCreate());
  container.appendChild(createBtn);

  // --- Events List ---
  const listMount = document.createElement('div');
  listMount.id = 'events-list-mount';
  container.appendChild(listMount);

  // Create the list component
  const listComponent = createGenericList('events-list-mount', {
    renderItem: (ev) => createEventCard(ev, currentUser, handlers, attendingIdSet, currentScope)
  });

  // Load data into list
  listComponent.updateData(Promise.resolve(items));
}

function createEventCard(ev, currentUser = null, handlers = {}, attendingIdSet = null, currentScope = 'mine') {
  const card = document.createElement('li');
  card.className = 'lc-card event-card';
  card.style = " word-wrap: break-word;"

  // Title
  const t = document.createElement('h3');
  t.textContent = ev.title || 'Untitled';
  t.style.marginBottom = '8px';
  card.appendChild(t);

  // Meta Info
  const meta = document.createElement('div');
  meta.className = 'event-meta';
  meta.style.marginBottom = '8px';
  const when = document.createElement('span');
  const dt = resolveEventDate(ev);
  when.textContent = dt ? new Date(dt).toLocaleString() : '';
  const where = document.createElement('span');
  where.textContent = ev.location ? ` @ ${ev.location}` : '';
  meta.append(when, where);
  card.appendChild(meta);

  // Description
  if (ev.description) {
    const d = document.createElement('p');
    d.textContent = ev.description;
    d.style.marginBottom = '12px';
    d.style.flexGrow = '1';
    card.appendChild(d);
  }

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '8px';
  footer.style.marginTop = 'auto';
  footer.style.flexWrap = 'nowrap';
  footer.style.width = '100%';
  footer.style.alignItems = 'stretch';

  // Normalize commonly used IDs to handle different payload shapes
  const eventId = ev.id ?? ev.event_id ?? ev.eventId;
  const creatorObj = (typeof ev.creator === 'object' && ev.creator)
    || (typeof ev.owner === 'object' && ev.owner)
    || (typeof ev.user === 'object' && ev.user)
    || (typeof ev.organizer === 'object' && ev.organizer)
    || null;
  const creatorId =
    ev.creatorId ?? ev.creator_id ??
    ev.createdById ?? ev.created_by_id ??
    ev.createdBy ?? ev.created_by ??
    ev.organizerId ?? ev.organizer_id ??
    ev.ownerId ?? ev.owner_id ??
    ev.userId ?? ev.user_id ??
    (creatorObj ? (creatorObj.id ?? creatorObj.userId ?? creatorObj.user_id) : null);

  const isCreator = (
    Boolean(currentUser && creatorId && (creatorId == currentUser.id))
  ) || (currentScope === 'mine');

  const isAttendingFromSet = attendingIdSet && (attendingIdSet.has((ev.id ?? ev.event_id ?? ev.eventId)));
  const isAttendingFromArray = Array.isArray(ev.attendees) && currentUser && ev.attendees.some(a => {
    const aId = (typeof a === 'object' && a !== null) ? (a.id ?? a.userId ?? a.user_id) : a;
    return aId == currentUser.id;
  });
  // Allow creators to still see and use the Attend button; do not auto-mark them as attending
  const isAttending = isCreator
    ? false
    : Boolean(isAttendingFromSet) || (currentScope === 'attending') || Boolean(ev.isAttending) || isAttendingFromArray;

  const mount = document.createElement('div');
  mount.className = 'attendees';
  mount.style.marginTop = '10px';

  if (isCreator) {
    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View attendees';
    viewBtn.className = 'lc-button';
    viewBtn.style.flex = '1';
    viewBtn.style.minWidth = '0';
    viewBtn.style.padding = '10px 12px';
    viewBtn.style.whiteSpace = 'nowrap';
    const loadAttendees = async () => {
      await handlers?.onViewAttendees?.(eventId, (arr) => {
        mount.innerHTML = '';
        if (!arr || !arr.length) {
          mount.textContent = 'No attendees yet.';
          return;
        }
        const ul = document.createElement('ul');
        arr.forEach(a => {
          const li = document.createElement('li');
          const name = a.userName || a.name || `User ${a.id || ''}`;
          li.textContent = `${name} - ${a.status || 'Joined'}`;
          ul.appendChild(li);
        });
        mount.appendChild(ul);
      });
    };
    viewBtn.addEventListener('click', async () => {
      viewBtn.disabled = true;
      await loadAttendees();
      viewBtn.disabled = false;
    });
    footer.appendChild(viewBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'lc-button lc-button--primary';
    editBtn.style.flex = '1';
    editBtn.style.minWidth = '0';
    editBtn.style.padding = '10px 12px';
    editBtn.style.whiteSpace = 'nowrap';
    editBtn.addEventListener('click', () => {
      const form = document.createElement('div');

      const titleInput = document.createElement('input');
      titleInput.placeholder = 'Title';
      titleInput.className = 'modal-input';
      titleInput.value = ev.title || '';

      const descInput = document.createElement('textarea');
      descInput.placeholder = 'Description';
      descInput.rows = 3;
      descInput.className = 'modal-input';
      descInput.value = ev.description || '';

      const locInput = document.createElement('input');
      locInput.placeholder = 'Location';
      locInput.className = 'modal-input';
      locInput.value = ev.location || '';

      const dtInput = document.createElement('input');
      dtInput.type = 'datetime-local';
      dtInput.className = 'modal-input';
      dtInput.value = formatDateTimeLocal(ev.datetime);

      const dtError = document.createElement('div');
      dtError.style.color = 'red';
      dtError.style.fontSize = '12px';
      dtError.style.marginTop = '4px';
      dtError.style.display = 'none';

      form.append(titleInput, descInput, locInput, dtInput, dtError);

      openModal({
        title: 'Edit Event',
        content: form,
        actions: [
          { label: 'Cancel', className: 'lc-button lc-button--secondary' },
          {
            label: 'Save',
            className: 'lc-button lc-button--primary',
            onClick: async (_e, { close }) => {
              if (!titleInput.value.trim()) {
                alert('Title required');
                return;
              }
              // Validate that event datetime is not in the past
              if (dtInput.value) {
                const eventDateTime = new Date(dtInput.value);
                const now = new Date();
                if (eventDateTime < now) {
                  dtInput.style.borderColor = 'red';
                  dtInput.style.backgroundColor = '#ffe6e6';
                  dtError.textContent = 'Event date cannot be in the past';
                  dtError.style.display = 'block';
                  return;
                }
              }

              // Reset styling if valid
              dtInput.style.borderColor = '';
              dtInput.style.backgroundColor = '';
              dtError.style.display = 'none';

              await handlers?.onEdit?.(eventId, {
                title: titleInput.value.trim(),
                description: descInput.value,
                location: locInput.value.trim(),
                datetime: dtInput.value ? dtInput.value : null
              });
              close();
            }
          }
        ]
      });
    });
    footer.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'lc-button';
    deleteBtn.style.flex = '1';
    deleteBtn.style.minWidth = '0';
    deleteBtn.style.padding = '10px 12px';
    deleteBtn.style.whiteSpace = 'nowrap';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = '#fff';
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this event?')) {
        await handlers?.onDelete?.(eventId);
      }
    });
    footer.appendChild(deleteBtn);
  }

  if (!isCreator) {
    const attendBtn = document.createElement('button');
    attendBtn.textContent = (isAttending && currentScope === 'attending') ? 'Unattend' : (isAttending ? 'Attending' : 'Attend');
    attendBtn.className = `lc-button${isAttending ? ' lc-button--primary' : ''}`;
    attendBtn.style.flex = '1';
    attendBtn.style.minWidth = '0';
    attendBtn.style.padding = '10px 12px';
    attendBtn.style.whiteSpace = 'nowrap';
    attendBtn.style.backgroundColor = '#2563eb';
    attendBtn.style.color = '#fff';

    if (isAttending && currentScope === 'attending') {
      attendBtn.style.backgroundColor = '#dc3545';
      attendBtn.style.color = '#fff';
    }

    attendBtn.disabled = isAttending && currentScope !== 'attending';
    attendBtn.addEventListener('click', async () => {
      if (!isAttending) {
        await handlers?.onAttend?.(eventId, (success) => {
          if (success) {
            attendBtn.textContent = currentScope === 'attending' ? 'Unattend' : 'Attending';
            attendBtn.className = 'lc-button lc-button--primary';
            if (currentScope === 'attending') {
              attendBtn.style.backgroundColor = '#dc3545';
              attendBtn.style.color = '#fff';
            } else {
              attendBtn.style.backgroundColor = '';
              attendBtn.style.color = '';
              attendBtn.disabled = true;
            }
          }
        });
      } else if (currentScope === 'attending') {
        // Unattend when viewing Attending filter
        await handlers?.onUnattend?.(eventId);
      }
    });
    footer.appendChild(attendBtn);
  }

  card.appendChild(footer);
  card.appendChild(mount);

  return card;
}

export default { render };

// Helpers
function resolveEventDate(ev) {
  return ev.datetime || ev.date || ev.event_date || null;
}
