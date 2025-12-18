import createButton from '../../components/button/button.js';
import "./post.css";
import openModal from '../../components/modal/modal.js';
import postService from '../../service/postService.js';
import { createGenericList } from '../../components/list/list.js';

function render(items = [], currentUser = null, handlers = {}, currentScope = 'mine') {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  // Header
  const header = document.createElement('h1');
  header.textContent = 'Posts';
  header.style.textAlign = 'center';
  header.style.marginBottom = '24px';
  container.appendChild(header);

  // Tabs
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
  tabs.append(mkTab('My posts', 'mine'), mkTab('Accepted', 'accepted'), mkTab('Available', 'available'));
  container.appendChild(tabs);

  const createBtn = createButton({
    label: 'New Post',
    className: 'lc-button lc-button--primary',
    onClick: () => {
      if (!currentUser?.id) { alert('Login required'); return; }
      const form = document.createElement('div');
      const postTitleInput = document.createElement('input');
      postTitleInput.placeholder = "What's this about?";
      postTitleInput.className = 'modal-input';
      const descInput = document.createElement('textarea');
      descInput.placeholder = "Provide more details...";
      descInput.rows = 3;
      descInput.className = 'modal-input';
      form.append(postTitleInput, descInput);

      openModal({
        title: 'Create a Post',
        content: form,
        actions: [
          { label: 'Cancel', className: 'lc-button lc-button--secondary' },
          {
            label: 'Post to Community', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
              if (!postTitleInput.value.trim()) { alert('Please add a title before posting.'); return; }
              const postData = { title: postTitleInput.value, content: descInput.value, userId: currentUser?.id, buildingId: currentUser?.buildingId };
              try {
                await postService.createPost(postData);
                close();
                handlers?.onFilter?.(currentScope);
              } catch (err) {
                alert('Failed to create post.');
              }
            }
          }
        ]
      });
    }
  });
  createBtn.style.width = '100%';
  container.appendChild(createBtn);

  // Create list mount point
  const listMount = document.createElement('div');
  listMount.id = 'posts-list-mount';
  container.appendChild(listMount);

  // Create the list component
  // Ensure handlers carries current scope for item renderer
  const scopedHandlers = { ...handlers, currentScope };
  const listComponent = createGenericList('posts-list-mount', {
    renderItem: (post) => createPostCard(post, currentUser, scopedHandlers, currentScope)
  });

  // Load data into list
  listComponent.updateData(Promise.resolve(items));
}

function createPostCard(post, currentUser = null, handlers = {}) {
  const author = post.authorName || 'Unknown';
  const unit = post.authorUnit ? ` (Apt ${post.authorUnit})` : '';
  const timeAgo = getTimeAgo(post.createdAt);
  const title = post.title;
  const bodyText = post.content;
  const status = post.status || 'OPEN';

  const card = document.createElement('li');
  card.className = 'lc-card post-card';

  // HEADER
  const header = document.createElement('header');
  header.className = 'post-card-header';

  const meta = document.createElement('div');
  meta.className = 'post-meta';

  const avatar = document.createElement('div');
  avatar.className = 'post-avatar';
  avatar.textContent = author.charAt(0).toUpperCase();

  const metaText = document.createElement('div');
  metaText.className = 'post-meta-text';

  const authorElement = document.createElement('div');
  authorElement.className = 'post-author';
  authorElement.textContent = `${author}${unit}`;

  const timeElement = document.createElement('div');
  timeElement.className = 'post-time';
  timeElement.textContent = timeAgo;

  metaText.append(authorElement, timeElement);
  meta.append(avatar, metaText);
  header.appendChild(meta);

  // BODY
  const body = document.createElement('div');
  body.className = 'lc-card-body';

  if (title) {
    const h5 = document.createElement('h5');
    h5.className = 'post-title';
    h5.textContent = title;
    body.appendChild(h5);
  }

  if (bodyText) {
    const p = document.createElement('p');
    p.className = 'post-description';
    p.textContent = bodyText;
    body.appendChild(p);
  }

  // STATUS ROW
  const statusEl = document.createElement('span');
  statusEl.className = 'post-status';
  statusEl.textContent = status;
  statusEl.style.display = 'inline-flex';
  statusEl.style.alignItems = 'center';
  statusEl.style.padding = '4px 10px';
  statusEl.style.borderRadius = '12px';
  statusEl.style.background = '#f1f5f9';
  statusEl.style.color = '#475569';
  statusEl.style.fontWeight = '600';
  statusEl.style.fontSize = '12px';
  statusEl.style.marginTop = '8px';
  body.appendChild(statusEl);

  // FOOTER BUTTONS
  const footer = document.createElement('footer');
  footer.className = 'post-card-footer';
  footer.style.display = 'flex';
  footer.style.gap = '8px';
  footer.style.marginTop = 'auto';
  footer.style.alignItems = 'stretch';
  footer.style.width = '100%';
  footer.style.flexWrap = 'nowrap';

  const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
  const isOwner = fullName && author === fullName;

  if (isOwner) {
    const viewBtn = createButton({
      label: 'View acceptances',
      className: 'lc-button',
      onClick: async () => {
        viewBtn.disabled = true;
        await handlers?.onViewAcceptances?.(post.id, (arr) => {
          const mount = card.querySelector('.acceptances') || document.createElement('div');
          mount.className = 'acceptances';
          mount.innerHTML = '';
          if (!arr || !arr.length) { mount.textContent = 'No acceptances yet.'; }
          else {
            const ul = document.createElement('ul');
            arr.forEach(a => { const li = document.createElement('li'); li.textContent = `${a.userName} - ${a.status}`; ul.appendChild(li); });
            mount.appendChild(ul);
          }
          card.appendChild(mount);
        });
        viewBtn.disabled = false;
      }
    });
    viewBtn.style.flex = '1';
    viewBtn.style.minWidth = '0';
    viewBtn.style.padding = '10px 12px';
    viewBtn.style.whiteSpace = 'nowrap';
    footer.appendChild(viewBtn);

    const editBtn = createButton({
      label: 'Edit',
      className: 'lc-button lc-button--primary',
      onClick: () => {
        const form = document.createElement('div');
        const titleInput = document.createElement('input');
        titleInput.className = 'modal-input';
        titleInput.placeholder = 'Title';
        titleInput.value = title || '';
        const descInput = document.createElement('textarea');
        descInput.className = 'modal-input';
        descInput.rows = 3;
        descInput.placeholder = 'Details';
        descInput.value = bodyText || '';
        form.append(titleInput, descInput);
        openModal({
          title: 'Edit Post',
          content: form,
          actions: [
            { label: 'Cancel', className: 'lc-button lc-button--secondary' },
            {
              label: 'Save', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
                if (!titleInput.value.trim()) { alert('Title required'); return; }
                await handlers?.onEdit?.(post.id, { title: titleInput.value.trim(), content: descInput.value });
                close();
              }
            }
          ]
        });
      }
    });
    editBtn.style.flex = '1';
    editBtn.style.minWidth = '0';
    editBtn.style.padding = '10px 12px';
    editBtn.style.whiteSpace = 'nowrap';
    footer.appendChild(editBtn);
  } else {
    // Check if current user has already accepted this post
    const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    const hasAccepted = (post.acceptedByMe === true) || (post.acceptances && post.acceptances.some(a => a.userName === currentUserName));

    const acceptBtn = createButton({
      label: (hasAccepted && (handlers?.currentScope ?? currentScope ?? 'mine') === 'accepted') ? 'Unaccept' : (hasAccepted ? 'Accepted' : 'Accept'),
      className: `lc-button${hasAccepted && (handlers?.currentScope ?? currentScope ?? 'mine') !== 'accepted' ? '' : ' lc-button--primary'}`,
      onClick: async () => {
        const sc = handlers?.currentScope ?? currentScope ?? 'mine';
        if (!hasAccepted) {
          await handlers?.onAccept?.(post.id);
        } else if (sc === 'accepted') {
          await handlers?.onUnaccept?.(post.id);
        }
      },
      disabled: hasAccepted && (handlers?.currentScope ?? currentScope ?? 'mine') !== 'accepted'
    });
    acceptBtn.style.flex = '1';
    acceptBtn.style.minWidth = '0';
    acceptBtn.style.padding = '10px 12px';
    acceptBtn.style.whiteSpace = 'nowrap';
    if (hasAccepted && (handlers?.currentScope ?? currentScope ?? 'mine') === 'accepted') {
      acceptBtn.style.backgroundColor = '#dc3545';
      acceptBtn.style.color = '#fff';
    }
    footer.appendChild(acceptBtn);
  }

  card.append(header, body, footer);
  return card;
}

function getTimeAgo(timestamp) {
  if (!timestamp) return 'Recently';
  const now = new Date();
  const dt = new Date(timestamp);
  const diff = Math.floor((now - dt) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default { render };
