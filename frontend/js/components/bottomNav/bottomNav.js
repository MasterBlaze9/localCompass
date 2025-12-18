import "./bottomNav.css"
import routes from "../../routes.js"
import auth from "../../service/authService.js"

export default function bottomNav() {
	const loggedIn = auth.isAuthenticated();
	if (!loggedIn) {
		const hidden = document.createElement('nav');
		hidden.id = 'bottom-nav';
		hidden.style.display = 'none';
		return hidden;
	}

	const bottomNavContainer = document.createElement("nav")
	bottomNavContainer.id = "bottom-nav"
	bottomNavContainer.className = "bottom-nav"

	const current = window.location.pathname

	// Define navigation items
	const navItems = []

	// Add standard routes
	Object.entries(routes)
		.filter(([key, val]) => key !== 'currentPath' && key !== 'login' && key !== 'register' && key !== 'admin' && val?.controller && typeof val.path === 'string')
		.forEach(([key, val]) => {
			navItems.push({
				key,
				path: val.path,
				label: key.charAt(0).toUpperCase() + key.slice(1),
				icon: getIconForRoute(key)
			})
		})

	// Create nav items
	navItems.forEach(item => {
		const navItem = document.createElement('a')
		navItem.href = item.path
		navItem.className = 'bottom-nav-item'

		if (item.path === current) {
			navItem.classList.add('active')
		}

		const icon = document.createElement('div')
		icon.className = 'bottom-nav-icon'
		icon.innerHTML = item.icon

		const label = document.createElement('div')
		label.className = 'bottom-nav-label'
		label.textContent = item.label

		navItem.appendChild(icon)
		navItem.appendChild(label)
		bottomNavContainer.appendChild(navItem)
	})

	// Check for admin status and add admin item if needed
	fetch('/api/users/me', { headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() } })
		.then(r => r.ok ? r.json() : null)
		.then(me => {
			if (me?.admin) {
				const adminItem = document.createElement('a')
				adminItem.href = routes.admin.path
				adminItem.className = 'bottom-nav-item'

				if (routes.admin.path === current) {
					adminItem.classList.add('active')
				}

				const icon = document.createElement('div')
				icon.className = 'bottom-nav-icon'
				icon.innerHTML = getIconForRoute('admin')

				const label = document.createElement('div')
				label.className = 'bottom-nav-label'
				label.textContent = 'Admin'

				adminItem.appendChild(icon)
				adminItem.appendChild(label)
				bottomNavContainer.appendChild(adminItem)
			}
		}).catch(() => { })

	return bottomNavContainer
}

function getIconForRoute(routeKey) {
	const icons = {
		home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M6 9l6-6 6 6v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"></path>
			<rect x="9" y="12" width="6" height="6"></rect>
		</svg>`,
		events: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<rect x="2" y="4" width="20" height="16" rx="2"></rect>
			<path d="M7 2v6M17 2v6"></path>
			<path d="M2 11h20"></path>
		</svg>`,
		posts: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"></path>
			<line x1="8" y1="8" x2="16" y2="8"></line>
			<line x1="8" y1="12" x2="16" y2="12"></line>
			<line x1="8" y1="16" x2="14" y2="16"></line>
		</svg>`,
		createPost: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10"></circle>
			<line x1="12" y1="8" x2="12" y2="16"></line>
			<line x1="8" y1="12" x2="16" y2="12"></line>
		</svg>`,
		reports: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 2L2 8v10c0 8 10 12 10 12s10-4 10-12V8l-10-6z"></path>
			<path d="M12 9v4M12 17h.01"></path>
		</svg>`,
		admin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="8" r="4"></circle>
			<path d="M4 20c0-3 4-5 8-5s8 2 8 5"></path>
			<path d="M2 12h20" stroke-width="2"></path>
		</svg>`
	}
	return icons[routeKey] || icons.home
}
