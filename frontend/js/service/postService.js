import auth from './authService.js'
const BASE_URL = '/api';

const postService = {

  // Fetch all posts from backend (optional filters)
  async getAllPosts(params = {}) {
    try {
      const q = new URLSearchParams(params).toString();
      const url = q ? `${BASE_URL}/posts?${q}` : `${BASE_URL}/posts`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  async updatePost(id, data) {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Accept a post
  async acceptPost(postId, userId) {
    const response = await fetch(`${BASE_URL}/posts/${postId}/acceptances?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // List post acceptances (creator/admin only)
  async listAcceptances(postId) {
    const response = await fetch(`${BASE_URL}/posts/${postId}/acceptances`, {
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Delete a post by ID
  async deletePost(postId) {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // Some backends may return 204 No Content; handle gracefully
      if (response.status === 204) return true;
      try { return await response.json(); } catch { return true; }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  async removeAcceptance(postId, userId) {
    const url = userId ? `${BASE_URL}/posts/${postId}/acceptances/${userId}` : `${BASE_URL}/posts/${postId}/acceptances`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    if (response.status === 204) return true;
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
}

export default postService;
