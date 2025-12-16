// Admin Service - handles API calls to backend
import auth from './authService.js'
const BASE_URL = '/api';

const userService = {
    // ========================================
    // USERS MANAGEMENT
    // ========================================

    // Fetch all users from backend
    async getAllUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
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
                    'Content-Type': 'application/json',
                    ...auth.getAuthHeader()
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

    // Add new user (by username)
    async addUser(userData) {
        try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...auth.getAuthHeader()
            },
            body: JSON.stringify(userData)
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

    async getUserByEmail(email) {
        const response = await fetch(`${BASE_URL}/users/by-email?email=${encodeURIComponent(email)}`, {
            headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
        });
        return this.handleResponse(response);
    },

    async getUserByPhone(phoneNumber) {
        const response = await fetch(`${BASE_URL}/users/by-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
            headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
        });
        return this.handleResponse(response);
    },

    // Delete a user by ID
    async deleteUser(userId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
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
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Handle API response
    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    },

    /**
     * Login a user using email or phone + password
     * @param {string} identifier - email or phone
     * @param {string} password
     * @returns {Promise<Object>} user data or token
     */
    async login(identifier, password) {
        const type = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) ? 'email' : 'phone';

        const payload = {
            type,
            value: identifier,
            password
        };

        // Basic auth: store token then verify with a protected endpoint
        const basic = btoa(`${identifier}:${password}`);
        auth.setAuth(basic);
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...auth.getAuthHeader()
            }
        });
        if (!response.ok) {
            auth.clearAuth();
            throw new Error('Invalid credentials');
        }
        return { ok: true };
    },

    /**
     * Register a new user
     * @param {Object} user - user info {name, email?, phone?, password}
     * @returns {Promise<Object>} user data or token
     */
    async register(user) {
        // You can enforce either email or phone here
        if (!user.email && !user.phone) {
            throw new Error('Either email or phone number is required');
        }

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...auth.getAuthHeader()
            },
            body: JSON.stringify(user)
        });

        return this.handleResponse(response);
    }
};

export default userService;
