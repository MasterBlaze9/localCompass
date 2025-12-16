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
    createPost: { 
        path: '/posts/create',
        controller: 'createPostController'
    },
    currentPath: {
        path: '',
        controller: ''
    }
};
