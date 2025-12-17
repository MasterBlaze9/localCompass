import createButton from '../../components/button/button.js';
import "./post.css";
import openModal from '../../components/modal/modal.js';
import postService from '../../service/postService.js';

function render(items = [], currentUser = null, handlers = {}, currentScope = 'mine') {
  const container = document.getElementById('container');
  if (!container) return;
  container.innerHTML = '';

  // Tabs
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
          { label: 'Post to Community', className: 'lc-button lc-button--primary', onClick: async (_e, { close }) => {
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
  container.appendChild(createBtn);

  const list = document.createElement('div');
  list.className = 'posts-list';

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No posts to display.';
    list.appendChild(empty);
    container.appendChild(list);
    return;
  }

  items.forEach(post => {
    const author = post.authorName || 'Unknown';
    const unit = post.authorUnit ? ` (Apt ${post.authorUnit})` : '';
    const timeAgo = getTimeAgo(post.createdAt);
    const title = post.title;
    const bodyText = post.content;
    const status = post.status || 'OPEN';

    const card = document.createElement('article');
    card.className = 'post-card';

    // HEADER
    const header = document.createElement('header');
    header.className = 'post-card-header';

    const meta = document.createElement('div');
    meta.className = 'post-meta';

    const avatar = document.createElement('div');
    avatar.className = 'post-avatar';

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
    body.className = 'post-card-body';

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

    // FOOTER
    const footer = document.createElement('footer');
    footer.className = 'post-card-footer';

    const leftFooter = document.createElement('div');
    leftFooter.className = 'post-footer-left';

    const statusEl = document.createElement('span');
    statusEl.className = 'post-status';
    statusEl.textContent = status;
    leftFooter.appendChild(statusEl);

    const rightFooter = document.createElement('div');
    rightFooter.className = 'post-footer-right';

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
      rightFooter.appendChild(viewBtn);
    } else {
      const acceptBtn = createButton({
        label: 'Accept',
        className: 'lc-button lc-button--primary',
        onClick: async () => { await handlers?.onAccept?.(post.id); }
      });
      rightFooter.appendChild(acceptBtn);
    }

    footer.append(leftFooter, rightFooter);

    card.append(header, body, footer);
    list.appendChild(card);
  });

  container.appendChild(list);
}

function getTimeAgo(timestamp){
  if (!timestamp) return 'Recently';
  const now = new Date();
  const dt = new Date(timestamp);
  const diff = Math.floor((now - dt)/1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default { render };
