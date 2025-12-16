const API_BASE = process.env.BASE_URL;


async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const userService = {
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

    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return handleResponse(response);
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

    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    return handleResponse(response);
  }
};
