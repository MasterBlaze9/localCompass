export default {
    home: {
        path: '/',
        controller: 'homeController'
    },
    events: {
        path: '/events',
        controller: 'eventController'
    },
     posts: {
        path: '/posts',
        controller: 'postController'
    },
    currentPath: {
        path: '',
        controller: ''
    },
    register: {
        path: '/register',
        controller: 'registerController'
    },

    login: {
        path: '/login',
        controller: 'loginController'
    }
};
