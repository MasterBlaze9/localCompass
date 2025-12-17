import "./event.css";

function render(items = [], currentUser = null, handlers = {}, currentScope = 'mine') {
	const container = document.getElementById('container')
	if (!container) return;
	container.innerHTML = '';

	const div = document.createElement('div');
	const header = document.createElement('h1');
	header.textContent = 'Events';
	div.appendChild(header);

	// Filter Tabs
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

	// Create Event button
	const createBtn = document.createElement('button');
	createBtn.textContent = 'Create Event';
	createBtn.className = 'lc-button lc-button--primary';
	createBtn.addEventListener('click', () => handlers?.onCreate && handlers.onCreate());
	div.appendChild(createBtn);

	// Events list
	const list = document.createElement('div');
	list.className = 'events-list';

	if (!items || !items.length) {
		const empty = document.createElement('p');
		empty.textContent = 'No events to display.';
		list.appendChild(empty);
	} else {
		const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
		items.forEach(ev => {
			const card = document.createElement('article');
			card.className = 'event-card';

			const t = document.createElement('h3');
			t.textContent = ev.title || 'Untitled';
			card.appendChild(t);

			const meta = document.createElement('div');
			meta.className = 'event-meta';
			const when = document.createElement('span');
			when.textContent = ev.datetime ? new Date(ev.datetime).toLocaleString() : '';
			const where = document.createElement('span');
			where.textContent = ev.location ? ` @ ${ev.location}` : '';
			const status = document.createElement('span');
			status.textContent = ev.status || 'SCHEDULED';
			meta.append(when, where, status);
			card.appendChild(meta);

			if (ev.description) {
				const d = document.createElement('p');
				d.textContent = ev.description;
				card.appendChild(d);
			}

			const footer = document.createElement('div');
			footer.style.display = 'flex';
			footer.style.gap = '8px';

			const isCreator = fullName && ev.creatorName === fullName;
			if (isCreator) {
				const viewBtn = document.createElement('button');
				viewBtn.textContent = 'View attendees';
				viewBtn.className = 'lc-button';
				const mount = document.createElement('div');
				mount.className = 'attendees';
				viewBtn.addEventListener('click', async () => {
					viewBtn.disabled = true;
					await handlers?.onViewAttendees?.(ev.id, (arr) => {
						mount.innerHTML = '';
						if (!arr || !arr.length) { mount.textContent = 'No attendees yet.'; return; }
						const ul = document.createElement('ul');
						arr.forEach(a => { const li = document.createElement('li'); li.textContent = `${a.userName} - ${a.status}`; ul.appendChild(li); });
						mount.appendChild(ul);
					});
					viewBtn.disabled = false;
				});
				footer.appendChild(viewBtn);
				card.appendChild(footer);
				card.appendChild(mount);
			} else {
				const joinBtn = document.createElement('button');
				joinBtn.textContent = 'Join';
				joinBtn.className = 'lc-button lc-button--primary';
				joinBtn.addEventListener('click', async () => {
					joinBtn.disabled = true;
					await handlers?.onJoin?.(ev.id);
					joinBtn.disabled = false;
				});
				footer.appendChild(joinBtn);
				card.appendChild(footer);
			}

			list.appendChild(card);
		});
	}
	div.appendChild(list);
	container.appendChild(div);
}

export default { render };
