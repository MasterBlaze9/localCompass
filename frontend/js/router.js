import routes from "./routes.js";
import auth from "./service/authService.js";

function setCurrentRoute({ path, controller }) {
    routes.currentPath.path = path;
    routes.currentPath.controller = controller;
}

function navigate(path, firstLoad = false) {
    if (path === routes.currentPath.path) {
        return
    }

    const routeKey = Object.keys(routes).find(key => routes[key].path === path)
    let route = routes[routeKey] || routes.home;

    const publicKeys = ['login', 'register'];
    const isPublic = publicKeys.includes(routeKey);
    if (!isPublic && !auth.isAuthenticated()) {
        route = routes.login;
    }

    setCurrentRoute(route);

    firstLoad
        ? history.replaceState(route, '', route.path)
        : history.pushState(route, '', route.path);

    launchController(route.controller);
    updateActiveNav();
}

function handlePopState({ state }) {
    let route = state || routes.home;

    const publicPaths = [routes.login.path, routes.register.path];
    if (!publicPaths.includes(route.path) && !auth.isAuthenticated()) {
        route = routes.login;
    }

    setCurrentRoute(route)

    const container = document.getElementById('container');
    if (container) container.innerHTML = '';

    launchController(route.controller)
    updateActiveNav();
}

async function launchController(controllerName) {
    try {
        const module = await import(`./controller/${controllerName}.js`)
        module.init();
    } catch (error) {
        console.log(error)
    }
}

function setAnchorEventListener() {
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const url = new URL(a.getAttribute('href'), window.location.origin);
        // Only handle same-origin internal links
        if (url.origin === window.location.origin) {
            e.preventDefault();
            navigate(url.pathname);
        }
    });
}

function updateActiveNav() {
    const current = routes.currentPath.path;
    // Update navbar links
    document.querySelectorAll('nav a.nav-link').forEach(a => {
        if (a.pathname === current) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        } else {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
        }
    });

    // Update bottom nav items
    document.querySelectorAll('.bottom-nav-item').forEach(a => {
        const href = a.getAttribute('href') || a.pathname;
        if (href === current) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

export function init() {
    const path = window.location.pathname

    const publicPaths = [routes.login.path, routes.register.path];
    const initialPath = (!auth.isAuthenticated() && !publicPaths.includes(path)) ? routes.login.path : path;

    navigate(initialPath, true);
    addEventListener('popstate', handlePopState)
    setAnchorEventListener();
    updateActiveNav();
}

export default { init }
