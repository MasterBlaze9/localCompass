
import { createGenericList } from '../../components/list/list.js';
import '../post/post.css';
import { createCard } from '../../components/card/card.js';

function render(items = [], me, handlers = {}, scope = 'mine') {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  // Header
  const header = document.createElement('h1');
  header.textContent = 'Reports';
  header.style.textAlign = 'center';
  header.style.marginBottom = '24px';
  container.appendChild(header);

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
    renderItem: (r) => createReportCard(r, me, handlers, scope)
  });
  listComponent.updateData(Promise.resolve(items));
}

function createReportCard(r, me, handlers = {}, scope) {
  const isOwner = me && (r.userId ? r.userId === me.id : (r.user?.id === me.id));
  let footer = null;
  if (isOwner && (scope === 'mine' || scope === undefined)) {
    const editBtn = document.createElement('button');
    editBtn.className = 'lc-button lc-button--primary';
    editBtn.textContent = 'Edit';
    editBtn.style.flex = '1';
    editBtn.style.minWidth = '0';
    editBtn.style.padding = '10px 12px';
    editBtn.style.whiteSpace = 'nowrap';
    editBtn.addEventListener('click', () => {
      const form = document.createElement('div');
      const tInput = document.createElement('input'); tInput.className = 'lc-input'; tInput.placeholder = 'Title'; tInput.value = r.title || '';
      const dInput = document.createElement('textarea'); dInput.className = 'lc-input'; dInput.rows = 3; dInput.placeholder = 'Description'; dInput.value = r.description || '';
      form.append(tInput, dInput);
      import('../../components/modal/modal.js').then(({ default: openModal }) => {
        openModal({
          title: 'Edit Report',
          content: form,
          actions: [
            { label: 'Cancel', className: 'lc-button lc-button--secondary' },
            {
              label: 'Save', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
                if (!tInput.value.trim()) {
                  import('../../components/error/errorDisplay.js').then(({ showError }) => {
                    showError(form, 'Title is required.');
                  });
                  return;
                }
                await handlers?.onEdit?.(r.id, { title: tInput.value.trim(), description: dInput.value });
                close();
              }
            }
          ]
        });
      });

    });
    footer = document.createElement('div');
    footer.appendChild(editBtn);
    const del = document.createElement('button');
    del.className = 'lc-button lc-button--danger';
    del.textContent = 'Delete';
    del.style.backgroundColor = '#dc3545';
    del.style.color = '#fff';
    del.addEventListener('click', () => handlers?.onDelete?.(r.id));
    del.style.flex = '1';
    del.style.minWidth = '0';
    del.style.padding = '10px 12px';
    del.style.whiteSpace = 'nowrap';
    footer.appendChild(del);
  }
  return createCard({
    type: 'report',
    data: {
      title: r.title,
      description: r.description,
      status: r.status || 'OPEN',
      createdAt: r.createdAt
    },
    options: { footer }
  });
}

export default { render };
