import { createGenericList } from '../../components/list/list.js';
import '../post/post.css';

function render(items = [], me, handlers = {}, scope = 'mine') {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  // Tabs (match posts/events style, without All)
  const tabs = document.createElement('div');
  tabs.style.display = 'flex';
  tabs.style.gap = '8px';
  tabs.style.margin = '8px 0 16px';
  tabs.style.flexWrap = 'wrap';
  const mkTab = (label, sc) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = 'lc-button' + (scope === sc ? ' lc-button--primary' : '');
    b.style.flex = '1';
    b.style.minWidth = '100px';
    b.addEventListener('click', () => handlers?.onFilter && handlers.onFilter(sc));
    return b;
  };
  tabs.append(mkTab('My reports', 'mine'), mkTab('Building', 'building'));
  container.appendChild(tabs);

  // Create Report button (full-width like posts/events)
  const createBtn = document.createElement('button');
  createBtn.textContent = 'Create Report';
  createBtn.className = 'lc-button lc-button--primary';
  createBtn.style.width = '100%';
  createBtn.addEventListener('click', () => handlers?.onCreate && handlers.onCreate());
  container.appendChild(createBtn);

  // List mount + generic list usage
  const mountId = 'reports-list-mount';
  const listMount = document.createElement('div');
  listMount.id = mountId;
  container.appendChild(listMount);

  const listComponent = createGenericList(mountId, {
    renderItem: (r) => createReportCard(r, me, handlers)
  });
  listComponent.updateData(Promise.resolve(items));
}

function createReportCard(r, me, handlers = {}) {
  const card = document.createElement('li');
  card.className = 'lc-card report-card';

  const header = document.createElement('header');
  header.className = 'report-card-header';
  const title = document.createElement('h3');
  title.textContent = r.title || `Report #${r.id}`;
  header.appendChild(title);

  const body = document.createElement('div');
  body.className = 'lc-card-body';
  if (r.description) {
    const p = document.createElement('p');
    p.textContent = r.description;
    body.appendChild(p);
  }

  const status = document.createElement('span');
  status.className = 'post-status'; // reuse badge style
  status.textContent = r.status || 'OPEN';
  body.appendChild(status);

  const metaSmall = document.createElement('small');
  metaSmall.textContent = r.createdAt ? new Date(r.createdAt).toLocaleString() : '';
  body.appendChild(metaSmall);

  const footer = document.createElement('footer');
  footer.style.display = 'flex';
  footer.style.gap = '8px';
  footer.style.marginTop = 'auto';
  footer.style.alignItems = 'stretch';
  footer.style.width = '100%';
  footer.style.flexWrap = 'nowrap';

  const isOwner = me && (r.authorId ? r.authorId === me.id : true);
  if (isOwner) {
    const editBtn = document.createElement('button');
    editBtn.className = 'lc-button';
    editBtn.textContent = 'Edit';
    editBtn.style.flex = '1';
    editBtn.style.minWidth = '0';
    editBtn.style.padding = '10px 12px';
    editBtn.style.whiteSpace = 'nowrap';
    editBtn.addEventListener('click', () => {
      const form = document.createElement('div');
      const tInput = document.createElement('input'); tInput.className = 'modal-input'; tInput.placeholder = 'Title'; tInput.value = title.textContent || '';
      const dInput = document.createElement('textarea'); dInput.className = 'modal-input'; dInput.rows = 3; dInput.placeholder = 'Description'; dInput.value = r.description || '';
      form.append(tInput, dInput);
      import('../../components/modal/modal.js').then(({ default: openModal }) => {
        openModal({
          title: 'Edit Report',
          content: form,
          actions: [
            { label: 'Cancel', className: 'lc-button lc-button--secondary' },
            { label: 'Save', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
                if (!tInput.value.trim()) { alert('Title required'); return; }
                await handlers?.onEdit?.(r.id, { title: tInput.value.trim(), description: dInput.value });
                close();
              } }
          ]
        });
      });
    });
    footer.appendChild(editBtn);
  }

  const del = document.createElement('button');
  del.className = 'lc-button lc-button--danger';
  del.textContent = 'Delete';
  del.addEventListener('click', () => handlers?.onDelete?.(r.id));
  del.style.flex = '1';
  del.style.minWidth = '0';
  del.style.padding = '10px 12px';
  del.style.whiteSpace = 'nowrap';
  footer.appendChild(del);

  card.append(header, body, footer);
  return card;
}

export default { render };