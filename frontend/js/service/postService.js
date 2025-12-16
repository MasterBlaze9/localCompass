import auth from './authService.js'
const BASE_URL = '/api';

const postService = {

    // Fetch all posts from backend
    async getAllPosts() {
        try {
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...auth.getAuthHeader()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
  },

  // Create a new post
  async createPost(data) {
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...auth.getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

    // Delete a post by ID
    async deletePost(postId) {
        try {
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...auth.getAuthHeader()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },
}

export default postService;
