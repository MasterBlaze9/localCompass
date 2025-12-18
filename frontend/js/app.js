import router from './router.js'
import navBar from './components/navbar/navbar.js'
import bottomNav from './components/bottomNav/bottomNav.js'

addEventListener('DOMContentLoaded', () => {
    const root = document.body
    const existing = document.getElementById('anchors')
    if (!existing) {
        const navbar = navBar()
        root.insertBefore(navbar, document.getElementById('container'))
    }

    // Add bottom navigation for mobile
    const existingBottomNav = document.getElementById('bottom-nav')
    if (!existingBottomNav) {
        const bottomNavElement = bottomNav()
        root.appendChild(bottomNavElement)
    }

    router.init();
})