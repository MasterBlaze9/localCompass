import postView from "../view/post/postView";
import postService from "../service/postService.js";

export async function init() {
  async function load(scope = 'mine') {
    const [items, me] = await Promise.all([
      postService.getAllPosts({ scope }),
      fetch('/api/users/me', { headers: { 'Content-Type': 'application/json', ...(await import('../service/authService.js')).default.getAuthHeader() } }).then(r => r.ok ? r.json() : null)
    ]);
    const handlers = {
      onFilter: (s) => load(s),
      onAccept: async (postId) => { if (!me?.id) { alert('Login required'); return; } await postService.acceptPost(postId, me.id); await load(scope); },
      onUnaccept: async (postId) => { if (!me?.id) { alert('Login required'); return; } await postService.removeAcceptance(postId); await load(scope); },
      onViewAcceptances: async (postId, cb) => { const list = await postService.listAcceptances(postId); cb(list); },
      onEdit: async (postId, data) => { if (!me?.id) { alert('Login required'); return; } await postService.updatePost(postId, data); await load(scope); },
      onDelete: async (postId) => { if (!me?.id) { alert('Login required'); return; } await postService.deletePost(postId); await load(scope); }
    };
    postView.render(items, me, handlers, scope);
  }
  await load('mine');
}
