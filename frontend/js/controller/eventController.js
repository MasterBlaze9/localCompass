import eventView from "../view/event/eventView.js"
import eventService from "../service/eventService.js"
import openModal from "../components/modal/modal.js"

export async function init() {
  // Load events and current user
  let items = [];
  let me = null;
  let currentScope = 'mine';
  let attendingIdSet = null;
  try {
    const [eventsRes, meRes, attendingRes] = await Promise.all([
      // Ensure initial view respects the default scope ("mine")
      eventService.getAllEvents({ scope: currentScope }),
      fetch('/api/users/me', { headers: { 'Content-Type': 'application/json', ...(await import('../service/authService.js')).default.getAuthHeader() } }).then(r => r.ok ? r.json() : null),
      eventService.getAllEvents({ scope: 'attending' })
    ]);
    items = eventsRes || [];
    me = meRes || null;
    attendingIdSet = new Set((attendingRes || []).map(ev => (ev.id ?? ev.event_id ?? ev.eventId)));
  } catch (e) {
    items = [];
  }

  const handlers = {
    onFilter: async (scope) => {
      currentScope = scope;
      const [newItems, attendingRes] = await Promise.all([
        eventService.getAllEvents({ scope }),
        eventService.getAllEvents({ scope: 'attending' })
      ]);
      attendingIdSet = new Set((attendingRes || []).map(ev => (ev.id ?? ev.event_id ?? ev.eventId)));
      eventView.render(newItems, me, handlers, currentScope, attendingIdSet);
    },
    onCreate: () => {
      if (!me?.id) { alert('Login required'); return; }
      const form = document.createElement('div');
      const t = document.createElement('input'); t.placeholder = 'Title'; t.className = 'modal-input';
      const d = document.createElement('textarea'); d.placeholder = 'Description'; d.rows = 3; d.className = 'modal-input';
      const loc = document.createElement('input'); loc.placeholder = 'Location'; loc.className = 'modal-input';
      const dt = document.createElement('input'); dt.type = 'datetime-local'; dt.className = 'modal-input';
      form.append(t, d, loc, dt);

      openModal({
        title: 'Create Event',
        content: form,
        actions: [
          { label: 'Cancel', className: 'lc-button', onClick: (_e, { close }) => close() },
          {
            label: 'Create', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
              if (!t.value.trim()) { alert('Title required'); return; }
              if (!me?.buildingId) { alert('You are not assigned to a building'); return; }
              await eventService.createEvent({
                title: t.value.trim(),
                description: d.value.trim(),
                location: loc.value.trim(),
                datetime: dt.value ? dt.value : null,
                buildingId: me.buildingId,
                creatorId: me.id
              });
              close();
              init();
            }
          }
        ]
      });
    },
    onJoin: async (eventId) => {
      if (!me?.id) return alert('Login required');
      await eventService.joinEvent(eventId, me.id);
      alert('Joined event!');
    },
    onViewAttendees: async (eventId, cb) => {
      const list = await eventService.getAttendees(eventId);
      cb(list);
    },
    onEdit: async (eventId, data) => {
      if (!me?.id) return alert('Login required');
      await eventService.updateEvent(eventId, data);
      const [newItems, attendingRes] = await Promise.all([
        eventService.getAllEvents({ scope: currentScope }),
        eventService.getAllEvents({ scope: 'attending' })
      ]);
      attendingIdSet = new Set((attendingRes || []).map(ev => (ev.id ?? ev.event_id ?? ev.eventId)));
      eventView.render(newItems, me, handlers, currentScope, attendingIdSet);
    }
  };

  eventView.render(items, me, handlers, currentScope, attendingIdSet);
}
