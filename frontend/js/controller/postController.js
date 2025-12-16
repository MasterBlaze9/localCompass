import postView from "../view/post/postView";
import postService from "../service/postService.js";

export async function init() {
    const posts = await postService.getAllPosts();
    postView.render(posts); 
} 