import openModal from '../../components/modal/modal.js';
import postService from "../../service/postService.js";
import "./createPost.css";

function render() {
    const container = document.getElementById('app');
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'create-post-header';
    
    const title = document.createElement('h1');
    title.textContent = 'Create a Post';
    
    const description = document.createElement('p');
    description.textContent = 'Share an update with your local community';
    description.className = 'create-post-description';

    header.append(title, description);

    const createPostBtn = document.createElement('button');
    createPostBtn.className = 'create-post-btn';
    createPostBtn.textContent = '+ New Post';
    createPostBtn.onclick = () => {
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
                    const postData = { title: postTitleInput.value, content: descInput.value };
                    try {
                        await postService.createPost(postData);
                        close();
                    } catch (err) {
                        alert('Failed to create post.');
                    }
                }}
            ]
        });
    };

    container.append(header, createPostBtn);
}

export default { render };