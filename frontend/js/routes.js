export default {
    home: {
        path: '/',
        controller: 'homeController'
    },
    events: {
        path: '/events',
        controller: 'eventController'
    },
<<<<<<< admin-page
    admin: {
        path: '/admin',
        controller: 'adminController'
    },
    createPost: { 
        path: '/posts/create',
        controller: 'createPostController'
    },
    currentPath: {
        path: '',
        controller: ''
    }
=======
     posts: {
        path: '/posts',
        controller: 'postController'
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
>>>>>>> dev
};
