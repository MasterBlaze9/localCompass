import createButton from '../../components/button/button.js'; 
import "./postModal.css"; 
/**
 * Creates and renders the "Create a Post" modal component.
 * @param {function} onPostCreated - Callback function with (postData) executed on submit.
 */
export default function createModal({ onPostCreated }) {
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => overlay.remove();

    const title = document.createElement('h2');
    title.textContent = 'Create a Post';
    title.style.marginTop = '0';

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Enter your name';
    nameInput.className = 'modal-input';

    const avatarGroup = document.createElement('div');
    avatarGroup.style.marginBottom = '16px'; 
    
    const avatarLabel = document.createElement('div');
    avatarLabel.textContent = 'Choose Your Avatar';
    avatarLabel.className = 'modal-label';

    const avatarList = document.createElement('div');
    avatarList.className = 'avatar-list';
    
    const emojis = ['👤', '👴', '👩', '👷‍♂️', '🦁', '🐻', '🧑‍✈️', '🧛']; 
    let selectedAvatar = emojis[0]; 

    emojis.forEach((emoji, i) => {
        const avatar = document.createElement('div');
        avatar.className = i === 0 ? 'avatar-option selected' : 'avatar-option';
        avatar.textContent = emoji;
        avatar.onclick = () => {
            avatarList.querySelectorAll('.avatar-option').forEach(element => element.classList.remove('selected'));
            avatar.classList.add('selected');
            selectedAvatar = emoji;
        };
        avatarList.appendChild(avatar);
    });
    avatarGroup.append(avatarLabel, avatarList);

    const categoryGroup = document.createElement('div');
    categoryGroup.style.marginBottom = '16px';
    
    const categoryLabel = document.createElement('div');
    categoryLabel.textContent = 'Category';
    categoryLabel.className = 'modal-label';

    const categoryList = document.createElement('div');
    categoryList.className = 'categories-list';
    
    const categories = [
        { name: 'Mutual Aid', icon: '🔗' },
        { name: 'Social', icon: '👥' },
        { name: 'Assistance', icon: '💼' }
    ];
    let selectedCategory = categories[0].name; 

    categories.forEach((cb, idx) => {
        const category = document.createElement('div');
        category.className = idx === 0 ? 'category-card selected' : 'category-card';
        category.onclick = () => {
            categoryList.querySelectorAll('.category-card').forEach(el => el.classList.remove('selected'));
            category.classList.add('selected');
            selectedCategory = cb.name;
        };
        
        const icon = document.createElement('span');
        icon.className = 'category-icon';
        icon.textContent = cb.icon;

        const name = document.createElement('span');
        name.className = 'category-name';
        name.textContent = cb.name;

        category.append(icon, name);
        categoryList.appendChild(category);
    });
    categoryGroup.append(categoryLabel, categoryList);


    const postTitleInput = document.createElement('input');
    postTitleInput.placeholder = "What's this about?";
    postTitleInput.className = 'modal-input';

    const descInput = document.createElement('textarea');
    descInput.placeholder = "Provide more details...";
    descInput.rows = 3;
    descInput.className = 'modal-input';

    const locationInput = document.createElement('input');
    locationInput.placeholder = "e.g., Oak Street, Downtown, Community Center";
    locationInput.className = 'modal-input';

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    const cancelBtn = createButton({
        label: 'Cancel',
        className: 'lc-button lc-button--secondary', 
        onClick: () => overlay.remove()
    });

    const submitBtn = createButton({
        label: 'Post to Community',
        className: 'lc-button lc-button--primary', 
        onClick: () => {
            if (!postTitleInput.value.trim()) {
                alert("Please add a title before posting.");
                return;
            }

            const newPostData = {
                user_id: nameInput.value,
                avatar: selectedAvatar,
                timeAgo: "Just now",
                title: postTitleInput.value,
                body: descInput.value,
                location: locInput.value,
                category: selectedCategory,
                replys: []
            };

            onPostCreated(newPostData); 
            overlay.remove();           
        }
    });

    actions.append(cancelBtn, submitBtn);

    modal.append(
        closeBtn, title, 
        nameInput, 
        avatarGroup, 
        categoryGroup, 
        postTitleInput, 
        descInput, 
        locInput, 
        actions
    );
    overlay.appendChild(modal);
    
    overlay.onclick = (e) => { 
        if(e.target === overlay) overlay.remove(); 
    };

    document.body.appendChild(overlay);
}