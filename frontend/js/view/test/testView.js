import { createGenericList } from "../../components/list/list.js";
import createButton from '../../components/button/button.js';

function render(currentUser = null, handlers = {}) {
    const container = document.getElementById('container');
    if (!container) return;
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'mb-4 mt-3';
    title.textContent = 'Your Neighbors';
    container.appendChild(title);

    const listMount = document.createElement('div');
    listMount.id = 'user-directory-mount';
    container.appendChild(listMount);

    const listComponent = createGenericList('user-directory-mount', {
        renderItem: (user) => {
            const item = document.createElement('li');
            item.className = 'lc-card';

            item.innerHTML = `
                <div class="lc-card-header">
                    <div class="lc-avatar">${user.firstName?.charAt(0).toUpperCase() || 'U'}</div>
                    <div>
                        <div class="lc-card-title">${user.firstName || 'New'} ${user.lastName || 'Neighbor'}</div>
                        <div style="font-size: 12px; color: #64748b;">
                            <i class="bi bi-patch-check"></i> Verified Resident
                        </div>
                    </div>
                </div>
                <div class="lc-card-body" style="flex-grow: 1; margin-bottom: 16px;">
                  
                </div>
            `;

            const connectBtn = createButton({
                label: 'Send Message',
                className: 'lc-button--primary',
                onClick: () => handlers.onConnect?.(user)
            });

            item.appendChild(connectBtn);
            return item;
        }
    });

    return { listComponent };
}

export default { render };