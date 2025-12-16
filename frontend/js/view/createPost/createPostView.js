import createModal from '../../components/postModal/postModal.js';
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
        createModal({
            onPostCreated: (postData) => {
                console.log('New post created:', postData);
            }
        });
    };

    container.append(header, createPostBtn);
}

export default { render };