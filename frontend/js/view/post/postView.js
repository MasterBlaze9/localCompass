import createButton from '../../components/button/button.js';
import "./post.css";

function render(items) {
const container = document.getElementById('container');
if (!container) return;


container.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'posts-list';

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No posts to display.';
    list.appendChild(empty);
    container.appendChild(list);
    return;
  }

  items.forEach(post => {
    const user_id = post.user_id ;
    const timeAgo = post.timeAgo ;
    const title = post.title ;
    const bodyText = post.body ;
    const location = post.location ;
    const replys = post.replys ;

    const card = document.createElement('article');
    card.className = 'post-card';

    /* ---------- HEADER ---------- */
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
    authorElement.textContent = user_id;

    const timeElement = document.createElement('div');
    timeElement.className = 'post-time';
    timeElement.textContent = timeAgo;

    metaText.append(authorElement, timeElement);
    meta.append(avatar, metaText);
    header.appendChild(meta);

    /* ---------- BODY ---------- */
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

    /* ---------- FOOTER ---------- */
    const footer = document.createElement('footer');
    footer.className = 'post-card-footer';

    const leftFooter = document.createElement('div');
    leftFooter.className = 'post-footer-left';

    if (location) {
      const loc = document.createElement('span');
      loc.className = 'post-location';
      loc.textContent = `📍 ${location}`;
      leftFooter.appendChild(loc);
    }

    const rightFooter = document.createElement('div');
    rightFooter.className = 'post-footer-right';

    const replyButton = createButton({
      label: 'Reply',
      className: 'lc-button lc-button--primary',
      onClick: () => {
         
      }
    });

    rightFooter.appendChild(replyButton);

    footer.append(leftFooter, rightFooter);

    /* ---------- ASSEMBLE ---------- */
    card.append(header, body, footer);
    list.appendChild(card);
  });

  container.appendChild(list);
}

export default { render };
