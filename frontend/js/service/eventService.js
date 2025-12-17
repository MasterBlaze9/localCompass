// Admin Service - handles API calls to backend
import auth from './authService.js'
const BASE_URL = '/api';

const eventService = {

    // ========================================
    // EVENTS MANAGEMENT
    // ========================================

    // Fetch events (optional params: scope, buildingId, status)
    async getAllEvents(params = {}) {
        try {
            const q = new URLSearchParams(params).toString();
            const url = q ? `${BASE_URL}/events?${q}` : `${BASE_URL}/events`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...auth.getAuthHeader()
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    async createEvent(payload) {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
            body: JSON.stringify(payload)
        });
        return this.handleResponse(response);
    },

    async updateEvent(id, payload) {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() },
            body: JSON.stringify(payload)
        });
        return this.handleResponse(response);
    },

  async joinEvent(eventId) {
    
    const response = await fetch(`${BASE_URL}/events/${eventId}/attendees`, {
      method: 'POST', // Changed from PATCH to POST
      headers: {
        'Content-Type': 'application/json',
        ...auth.getAuthHeader()
      }
    });
    return this.handleResponse(response);
  },

    async getAttendees(eventId) {
        const response = await fetch(`${BASE_URL}/events/${eventId}/attendees`, {
            headers: { 'Content-Type': 'application/json', ...auth.getAuthHeader() }
        });
        return this.handleResponse(response);
    },

    // Delete an event by ID
    async deleteEvent(eventId) {
        try {
            const response = await fetch(`${BASE_URL}/events/${eventId}`, {
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
            console.error('Error deleting event:', error);
            throw error;
        }
    },

    // Common response handler
    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    }

}

export default eventService;
