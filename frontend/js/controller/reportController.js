import reportService from '../service/reportService.js';
import reportView from '../view/report/reportView.js';
import openModal from "../components/modal/modal.js";
import authService from '../service/authService.js';

export async function init() {
  let items = [];
  let me = null;
  let currentScope = 'mine';
  try {
    [items, me] = await Promise.all([
      reportService.getAllReports({ scope: currentScope }),
      fetch('/api/users/me', { headers: { 'Content-Type': 'application/json', ...authService.getAuthHeader() } }).then(r => r.ok ? r.json() : null)
    ]);
  } catch (e) {
    items = [];
  }
  const handlers = {
    onFilter: async (scope) => {
      currentScope = scope;
      try {
        const data = await reportService.getAllReports({ scope });
        reportView.render(data, me, handlers, currentScope);
      } catch (e) {
        const fallback = await reportService.getAllReports({ scope: 'mine' });
        currentScope = 'mine';
        reportView.render(fallback, me, handlers, currentScope);
      }
    },
    onCreate: () => {
      if (!me?.id) { alert('Login required'); return; }
      const form = document.createElement('div');
      const t = document.createElement('input'); t.placeholder = 'Title'; t.className = 'modal-input';
      const d = document.createElement('textarea'); d.placeholder = 'Description'; d.rows = 3; d.className = 'modal-input';
      form.append(t, d);
      openModal({
        title: 'Create Report',
        content: form,
        actions: [
          { label: 'Cancel', className: 'lc-button', onClick: (_e, { close }) => close() },
          {
            label: 'Create', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
              if (!t.value.trim()) { alert('Title required'); return; }
              await reportService.createReport({ title: t.value.trim(), description: d.value.trim(), userId: me.id, buildingId: me.buildingId });
              close();
              const data = await reportService.getAllReports({ scope: currentScope });
              reportView.render(data, me, handlers, currentScope);
            }
          }
        ]
      });
    },
    onRefresh: async () => {
      try {
        const data = await reportService.getAllReports({ scope: currentScope });
        reportView.render(data, me, handlers, currentScope);
      } catch {
        reportView.render([], me, handlers, currentScope);
      }
    },
    onEdit: async (id, data) => { await reportService.updateReport(id, data); await handlers.onRefresh(); },
    onDelete: async (id) => { await reportService.deleteReport(id); await handlers.onRefresh(); }
  };
  reportView.render(items, me, handlers, currentScope);
}

export default { init };
