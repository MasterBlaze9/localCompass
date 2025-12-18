import './admin.css';
import createButton from '../../components/button/button.js';
import { createGenericList } from '../../components/list/list.js';

function render(reports, onDelete) {
  const container = document.querySelector('#container');
  container.innerHTML = '';

  const adminDiv = document.createElement('div');
  adminDiv.className = 'admin-container';

  const header = document.createElement('h1');
  header.textContent = 'Admin Panel - Reports Management';
  adminDiv.appendChild(header);

  const subtitle = document.createElement('p');
  subtitle.textContent = `Total reports: ${reports.length}`;
  adminDiv.appendChild(subtitle);

  const nav = createNavButtons();
  adminDiv.appendChild(nav);

  const mount = document.createElement('div');
  mount.id = 'admin-reports-list-mount';
  adminDiv.appendChild(mount);

  container.appendChild(adminDiv);

  const list = createGenericList('admin-reports-list-mount', { renderItem: (r) => createReportCard(r, onDelete) });
  list.updateData(Promise.resolve(reports));
  const ul = document.querySelector('#admin-reports-list-mount .lc-list-group');
  if (ul) ul.classList.add('lc-cols-2');
}

function createReportCard(report, onDelete) {
  const card = document.createElement('li');
  card.className = 'lc-card post-card';

  const header = document.createElement('div');
  header.className = 'post-header';
  const title = document.createElement('h3');
  title.textContent = report.title || 'Untitled report';
  header.appendChild(title);
  card.appendChild(header);

  if (report.description) {
    const p = document.createElement('p');
    p.className = 'post-description';
    p.textContent = report.description;
    card.appendChild(p);
  }

  const footer = document.createElement('div');
  footer.className = 'post-footer';
  const status = document.createElement('span');
  status.textContent = report.status || 'OPEN';
  footer.appendChild(status);
  card.appendChild(footer);

  const del = createButton({ label: '🗑️ Delete', className: 'lc-button', onClick: () => onDelete(report.id) });
  del.style.backgroundColor = '#dc3545';
  del.style.color = '#fff';
  del.style.border = 'none';
  card.appendChild(del);

  return card;
}

function createNavButtons() {
  const nav = document.createElement('div');
  nav.style.marginBottom = '20px';
  nav.style.display = 'flex';
  nav.style.gap = '10px';

  const postsBtn = document.createElement('button');
  postsBtn.textContent = '📝 Posts';
  postsBtn.className = 'lc-button';
  postsBtn.style.padding = '10px 20px';
  postsBtn.onclick = async () => { const c = await import('../../controller/adminController.js'); c.initPosts({ skipLoading: true }); };

  const eventsBtn = document.createElement('button');
  eventsBtn.textContent = '📅 Events';
  eventsBtn.className = 'lc-button';
  eventsBtn.style.padding = '10px 20px';
  eventsBtn.onclick = async () => { const c = await import('../../controller/adminController.js'); c.initEvents({ skipLoading: true }); };

  const reportsBtn = document.createElement('button');
  reportsBtn.textContent = '🚩 Reports';
  reportsBtn.className = 'lc-button lc-button--primary';
  reportsBtn.style.padding = '10px 20px';

  const usersBtn = document.createElement('button');
  usersBtn.textContent = '👥 Users';
  usersBtn.className = 'lc-button';
  usersBtn.style.padding = '10px 20px';
  usersBtn.onclick = async () => { const c = await import('../../controller/adminController.js'); c.initUsers({ skipLoading: true }); };

  nav.append(postsBtn, eventsBtn, reportsBtn, usersBtn);
  return nav;
}

export default { render };
