import auth from './authService.js'
const BASE_URL = '/api';

const reportService = {
  async getAllReports(params = {}) {
    // Always restrict to user's building by default
    let buildingId = params.buildingId;
    if (!buildingId) {
      const meRes = await fetch(`${BASE_URL}/users/me`, { headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() } });
      if (meRes.ok) {
        const me = await meRes.json();
        buildingId = me?.buildingId;
      }
    }
    const qs = new URLSearchParams({ ...params, ...(buildingId ? { buildingId } : {}) }).toString();
    const url = `${BASE_URL}/reports${qs ? `?${qs}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async createReport(data) {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async updateReport(id, data) {
    const response = await fetch(`${BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async deleteReport(id) {
    const response = await fetch(`${BASE_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
    });
    if (response.status === 204) return true;
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    try { return await response.json(); } catch { return true; }
  }
};

export default reportService;
