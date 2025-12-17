import './modal.css';

/**
 * Open a generic modal.
 * @param {Object} opts
 * @param {string} opts.title
 * @param {HTMLElement|string} opts.content - Node or HTML string
 * @param {Array<{label:string,className?:string,onClick?:function}>} [opts.actions]
 * @param {function} [opts.onClose]
 * @returns {{close: Function}}
 */
export default function openModal({ title = '', content = '', actions = [], onClose } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'lc-modal-overlay';

  const box = document.createElement('div');
  box.className = 'lc-modal-box';

  const header = document.createElement('div');
  header.className = 'lc-modal-header';
  const h = document.createElement('h3');
  h.textContent = title || '';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lc-modal-close';
  closeBtn.innerHTML = '&times;';
  const doClose = () => { overlay.remove(); onClose && onClose(); };
  closeBtn.addEventListener('click', doClose);
  header.append(h, closeBtn);

  const body = document.createElement('div');
  body.className = 'lc-modal-body';
  if (content instanceof HTMLElement) body.appendChild(content);
  else body.innerHTML = content || '';

  const footer = document.createElement('div');
  footer.className = 'lc-modal-footer';

  if (!actions || actions.length === 0) {
    const btn = document.createElement('button');
    btn.className = 'lc-button';
    btn.textContent = 'Close';
    btn.addEventListener('click', doClose);
    footer.appendChild(btn);
  } else {
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = a.className || 'lc-button';
      btn.textContent = a.label || 'Action';
      btn.addEventListener('click', (e) => a.onClick ? a.onClick(e, { close: doClose }) : doClose());
      footer.appendChild(btn);
    });
  }

  box.append(header, body, footer);
  overlay.appendChild(box);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) doClose(); });
  document.body.appendChild(overlay);

  return { close: doClose };
}
