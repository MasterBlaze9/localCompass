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
  admin: {
    path: '/admin',
    controller: 'adminController'
  },
  register: {
    path: '/register',
    controller: 'registerController'
  },
  login: {
    path: '/login',
    controller: 'loginController'
  },

  currentPath: {
    path: '',
    controller: ''
  }
};
