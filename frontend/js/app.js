import router from './router.js'
import navBar from './components/navbar/navbar.js'

addEventListener('DOMContentLoaded', () => {
    const root = document.body
    const existing = document.getElementById('anchors')
    if (!existing) {
        const navbar = navBar()
        root.insertBefore(navbar, document.getElementById('container'))
    }
    router.init();
})