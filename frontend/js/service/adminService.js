// Admin Service - handles API calls to backend
const BASE_URL = 'https://53d27f99-4eb8-4287-ab9f-5476af247510.mock.pstmn.io';

const adminService = {
    
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

        // ========================================
    // USERS MANAGEMENT
    // ========================================
    
    // Fetch all users from backend
    async getAllUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
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
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    
    // Get single user details by ID
    async getUserById(userId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
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
            console.error('Error fetching user:', error);
            throw error;
        }
    },
    
    // Delete a user by ID
    async deleteUser(userId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
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
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // ========================================
    // EVENTS MANAGEMENT
    // ========================================
    
    // Fetch all events from backend
    async getAllEvents() {
        try {
            const response = await fetch(`${BASE_URL}/events`, {
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
            console.error('Error fetching events:', error);
            throw error;
        }
    },
    
    // Delete an event by ID
    async deleteEvent(eventId) {
        try {
            const response = await fetch(`${BASE_URL}/events/${eventId}`, {
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
            console.error('Error deleting event:', error);
            throw error;
        }
    },

    // ========================================
    // USERS MANAGEMENT
    // ========================================
    
    // Fetch all users
    async getAllUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
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
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    
    // Add new user (by username)
    async addUser(username) {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },
    
    // Delete a user
    async deleteUser(userId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
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
            console.error('Error deleting user:', error);
            throw error;
        }
    }

};

export default adminService;