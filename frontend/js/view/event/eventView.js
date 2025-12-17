import '../../components/button/button.css';
import './event.css';

function render(items = [], currentUser = null, handlers = {}, currentScope = 'mine', attendingIdSet = null) {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  const div = document.createElement('div');
  const header = document.createElement('h1');
  header.textContent = 'Events';
  div.appendChild(header);

  // --- Filter Tabs ---
  const tabs = document.createElement('div');
  tabs.style.display = 'flex';
  tabs.style.gap = '8px';
  tabs.style.margin = '8px 0 16px';
  const mkTab = (label, scope) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = 'lc-button' + (currentScope === scope ? ' lc-button--primary' : '');
    b.addEventListener('click', () => handlers?.onFilter && handlers.onFilter(scope));
    return b;
  };
  tabs.append(mkTab('My events', 'mine'), mkTab('Attending', 'attending'), mkTab('Available', 'available'));
  div.appendChild(tabs);

  // --- Create Event Button ---
  const createBtn = document.createElement('button');
  createBtn.textContent = 'Create Event';
  createBtn.className = 'lc-button lc-button--primary';
  createBtn.addEventListener('click', () => handlers?.onCreate && handlers.onCreate());
  div.appendChild(createBtn);

  // --- Events List ---
  const list = document.createElement('div');
  list.className = 'events-list';

  if (!items || !items.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No events to display.';
    list.appendChild(empty);
  } else {
    items.forEach(ev => {
      const card = document.createElement('article');
      card.className = 'event-card';

      // Title
      const t = document.createElement('h3');
      t.textContent = ev.title || 'Untitled';
      card.appendChild(t);

      // Meta Info
      const meta = document.createElement('div');
      meta.className = 'event-meta';
      const when = document.createElement('span');
      when.textContent = ev.datetime ? new Date(ev.datetime).toLocaleString() : '';
      const where = document.createElement('span');
      where.textContent = ev.location ? ` @ ${ev.location}` : '';
      meta.append(when, where);
      card.appendChild(meta);

      // Description
      if (ev.description) {
        const d = document.createElement('p');
        d.textContent = ev.description;
        card.appendChild(d);
      }

      const footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.gap = '8px';
      footer.style.marginTop = '12px';

      // ============================================================
      // 1. LOGIC CHECKS
      // ============================================================

      // Normalize commonly used IDs to handle different payload shapes
      const eventId = ev.id ?? ev.event_id ?? ev.eventId;
      const creatorId = ev.creatorId ?? ev.creator_id ?? ev.userId ?? ev.ownerId;

      // Ownership: creator only if event.creatorId matches current user
      const isCreator = Boolean(currentUser && creatorId && (creatorId == currentUser.id));

      // Attendance: trust explicit set, scope 'attending', OR flags/arrays
      const isAttendingFromSet = attendingIdSet && (attendingIdSet.has((ev.id ?? ev.event_id ?? ev.eventId)));
      const isAttendingFromArray = Array.isArray(ev.attendees) && currentUser && ev.attendees.some(a => {
        const aId = (typeof a === 'object' && a !== null) ? (a.id ?? a.userId ?? a.user_id) : a;
        return aId == currentUser.id;
      });
      const isAttending = Boolean(isAttendingFromSet) || (currentScope === 'attending') || Boolean(ev.isAttending) || isAttendingFromArray;

      // ============================================================
      // 2. VIEW ATTENDEES BUTTON (Creator only)
      // ============================================================
      const mount = document.createElement('div');
      mount.className = 'attendees';
      mount.style.marginTop = '10px';

      if (isCreator) {
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View attendees';
        viewBtn.className = 'lc-button';
        viewBtn.addEventListener('click', async () => {
          viewBtn.disabled = true;
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
          viewBtn.disabled = false;
        });
        footer.appendChild(viewBtn);
      }

      // ============================================================
      // 3. ACTION BUTTONS (Join/Leave/Admin)
      // ============================================================
      if (isCreator) {
        // --- CREATOR VIEW ---
        const label = document.createElement('span');
        label.textContent = '(Organizer)';
        label.style.alignSelf = 'center';
        label.style.fontSize = '0.8rem';
        label.style.color = '#888';
        footer.appendChild(label);

      } else {
        // --- GUEST VIEW ---
        if (isAttending) {
          // Already Joined
          const statusBadge = document.createElement('span');
          statusBadge.textContent = '✓ You are attending';
          statusBadge.style.color = 'green';
          statusBadge.style.fontWeight = 'bold';
          statusBadge.style.alignSelf = 'center';
          footer.appendChild(statusBadge);
        } else {
          // Not Joined Yet
          const joinBtn = document.createElement('button');
          joinBtn.textContent = 'Join';
          joinBtn.className = 'lc-button lc-button--primary';

          joinBtn.addEventListener('click', async () => {
            joinBtn.disabled = true;
            joinBtn.textContent = 'Joining...';

            try {
              await handlers?.onJoin?.(eventId);

              // OPTIMISTIC UPDATE:
              // Immediately replace button with success message
              // This fixes the "Joining..." stuck state
              const successMsg = document.createElement('span');
              successMsg.textContent = '✓ You are attending';
              successMsg.style.color = 'green';
              successMsg.style.fontWeight = 'bold';
              successMsg.style.alignSelf = 'center';
              joinBtn.replaceWith(successMsg);

            } catch (error) {
              console.error(error);
              joinBtn.textContent = 'Failed';
              joinBtn.disabled = false;
            }
          });
          footer.appendChild(joinBtn);
        }
      }

      card.appendChild(footer);
      card.appendChild(mount);
      list.appendChild(card);
    });
  }
  div.appendChild(list);
  container.appendChild(div);
}

export default { render };
