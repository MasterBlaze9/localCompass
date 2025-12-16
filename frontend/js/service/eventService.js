// Admin Service - handles API calls to backend
const BASE_URL = 'https://53d27f99-4eb8-4287-ab9f-5476af247510.mock.pstmn.io';

const eventService = {

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
    }

}

export default eventService;