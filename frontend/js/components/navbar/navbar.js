import "./navbar.css"
import routes from "../../routes.js"

export default function navBar() {

	const navbar = document.createElement("nav")
	navbar.id = "anchors"
	navbar.className = "navbar navbar-expand-lg navbar-light bg-light"

	const container = document.createElement('div')
	container.className = 'container-fluid'

	const brand = document.createElement('a')
	brand.className = 'navbar-brand'
	brand.href = routes.home?.path || '/'
	brand.textContent = 'LocalCompass'

	const toggler = document.createElement('button')
	toggler.className = 'navbar-toggler'
	toggler.type = 'button'
	toggler.setAttribute('data-bs-toggle', 'collapse')
	toggler.setAttribute('data-bs-target', '#navbarSupportedContent')
	toggler.setAttribute('aria-controls', 'navbarSupportedContent')
	toggler.setAttribute('aria-expanded', 'false')
	toggler.setAttribute('aria-label', 'Toggle navigation')
	toggler.innerHTML = '<span class="navbar-toggler-icon"></span>'

	const collapse = document.createElement('div')
	collapse.className = 'collapse navbar-collapse'
	collapse.id = 'navbarSupportedContent'

	const ul = document.createElement('ul')
	ul.className = 'navbar-nav me-auto mb-2 mb-lg-0'

	const current = window.location.pathname

	Object.entries(routes)
		.filter(([key, val]) => key !== 'currentPath' && val?.controller && typeof val.path === 'string')
		.forEach(([key, val]) => {
			const li = document.createElement('li')
			li.className = 'nav-item'

			const a = document.createElement('a')
			a.className = 'nav-link'
			a.href = val.path
			a.textContent = key.charAt(0).toUpperCase() + key.slice(1)

			if (val.path === current) {
				a.classList.add('active')
				a.setAttribute('aria-current', 'page')
			}

			li.appendChild(a)
			ul.appendChild(li)
		})

	collapse.appendChild(ul)
	container.appendChild(brand)
	container.appendChild(toggler)
	container.appendChild(collapse)
	navbar.appendChild(container)

	return navbar
}