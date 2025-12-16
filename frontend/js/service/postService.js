const BASE_URL = 'https://53d27f99-4eb8-4287-ab9f-5476af247510.mock.pstmn.io';

const postService = {
    // Fetch all posts from backend
    async getAllPosts() {
        try {
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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

    // Delete a post by ID
    async deletePost(postId) {
        try {
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
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
