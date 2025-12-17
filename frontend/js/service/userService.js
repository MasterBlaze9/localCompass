// Admin Service - handles API calls to backend
import auth from './authService.js'
const BASE_URL = '/api';

const userService = {
  // ========================================
  // USERS MANAGEMENT
  // ========================================

  // Fetch all users from backend (optionally filter by buildingId)
  async getAllUsers(buildingId) {
    try {
      const url = buildingId ? `${BASE_URL}/users?buildingId=${encodeURIComponent(buildingId)}` : `${BASE_URL}/users`;
      const response = await fetch(url, {
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

  // Get current authenticated user
  async getMe() {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    return this.handleResponse(response);
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

  // Add existing user to admin's building using email or phone
  async addUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/users/add-to-my-building`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...auth.getAuthHeader()
        },
        body: JSON.stringify({ email: userData.email, phoneNumber: userData.phone })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding user to building:', error);
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
    let data;
    let rawText = '';
    try {
      data = await response.json();
    } catch (_) {
      try { rawText = await response.text(); } catch (_) { }
      data = { message: rawText };
    }

    if (!response.ok) {
      const serverMessage = (data && data.message) ? String(data.message) : rawText || '';
      const msg = serverMessage.toLowerCase();

      // Friendly mapping for common constraint errors
      let friendly;
      let field = data?.field || null;
      let code = data?.code || null;

      if (response.status === 409 || msg.includes('duplicate key') || msg.includes('unique constraint')) {
        if (!field) {
          if (msg.includes('email')) field = 'email';
          else if (msg.includes('phone')) field = 'phoneNumber';
        }
        if (!friendly) {
          if (field === 'email' || msg.includes('email')) friendly = 'This email is already registered';
          else if (field === 'phoneNumber' || msg.includes('phone')) friendly = 'This phone number is already registered';
          else friendly = 'Record already exists';
        }
        if (!code) {
          if (field === 'email') code = 'DUPLICATE_EMAIL';
          else if (field === 'phoneNumber') code = 'DUPLICATE_PHONE';
          else code = 'DUPLICATE';
        }
      }

      if (!friendly && response.status === 400) {
        if (msg.includes('invalid') && msg.includes('email')) { friendly = 'Please enter a valid email address'; field = field || 'email'; code = code || 'INVALID_EMAIL'; }
        if (msg.includes('invalid') && msg.includes('phone')) { friendly = 'Please enter a valid phone number'; field = field || 'phoneNumber'; code = code || 'INVALID_PHONE'; }
      }

      const error = new Error(friendly || serverMessage || 'Something went wrong');
      if (field) error.field = field;
      if (code) error.code = code;
      throw error;
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

    // Normalize payload to match backend expectations
    const payload = { ...user };
    if (user.phone && !user.phoneNumber) {
      payload.phoneNumber = user.phone;
      delete payload.phone;
    }

    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...auth.getAuthHeader()
      },
      body: JSON.stringify(payload)
    });

    return this.handleResponse(response);
  }
};

export default userService;
