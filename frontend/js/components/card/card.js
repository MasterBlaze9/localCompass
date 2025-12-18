// Reusable card component for posts, reports, and events
// Usage: import { createCard } from './components/card/card.js';
// createCard({ type: 'post'|'report'|'event', data, options })

export function createCard({ type, data, options = {} }) {
	const card = document.createElement('li');
	card.className = `lc-card ${type}-card`;

	// Header
	const header = document.createElement('header');
	header.className = `${type}-card-header`;
	if (type === 'post' || type === 'report') {
		const title = document.createElement('h3');
		title.textContent = data.title || (type === 'report' ? `Report #${data.id}` : '');
		header.appendChild(title);
	} else if (type === 'event') {
		const title = document.createElement('h3');
		title.textContent = data.title || 'Event';
		header.appendChild(title);
	}
	card.appendChild(header);

	// Body
	const body = document.createElement('div');
	body.className = 'lc-card-body';
	if (data.content || data.description) {
		const p = document.createElement('p');
		p.textContent = data.content || data.description;
		body.appendChild(p);
	}
	card.appendChild(body);

	// Status/Badge
	if (data.status) {
		const badge = document.createElement('span');
		badge.className = `lc-badge status-${data.status.toLowerCase()}`;
		badge.textContent = data.status;
		body.appendChild(badge);
	}

	// Meta (date, author, etc.)
	if (data.createdAt) {
		const meta = document.createElement('small');
		meta.textContent = new Date(data.createdAt).toLocaleString();
		body.appendChild(meta);
	}

	// Footer (actions)
	if (options.footer) {
		const footer = document.createElement('footer');
		footer.className = 'lc-card-footer';
		footer.appendChild(options.footer);
		card.appendChild(footer);
	}

	return card;
}
