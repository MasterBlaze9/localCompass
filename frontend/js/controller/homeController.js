import homeView from '../view/home/homeView.js';
import postService from '../service/postService.js';
import eventService from '../service/eventService.js';
import reportService from '../service/reportService.js';

export async function init() {
    try {
        // Fetch data in parallel
        const [reports, posts, events] = await Promise.all([
            reportService.getAllReports({ scope: 'building' }).catch(() => []),
            postService.getAllPosts({ scope: 'mine' }).catch(() => []),
            eventService.getAllEvents({ scope: 'mine' }).catch(() => [])
        ]);

        // Sort reports by most recent first
        const sortedReports = (reports || []).sort((a, b) => {
            const dateA = new Date(a.createdAt || a.timestamp || 0);
            const dateB = new Date(b.createdAt || b.timestamp || 0);
            return dateB - dateA; // Descending (newest first)
        });

        // Sort posts by most recent first
        const sortedPosts = (posts || []).sort((a, b) => {
            const dateA = new Date(a.createdAt || a.timestamp || 0);
            const dateB = new Date(b.createdAt || b.timestamp || 0);
            return dateB - dateA; // Descending (newest first)
        });

        // Sort events by closest upcoming first
        const sortedEvents = (events || []).sort((a, b) => {
            const dateA = new Date(a.datetime || a.date || a.event_date || '9999-12-31');
            const dateB = new Date(b.datetime || b.date || b.event_date || '9999-12-31');
            return dateA - dateB; // Ascending (soonest first)
        });

        // Take only 2 most recent posts and events
        const recentPosts = sortedPosts.slice(0, 2);
        const recentEvents = sortedEvents.slice(0, 2);

        // Take only 1 most recent report
        const recentReport = sortedReports.slice(0, 1);

        // Render the home view
        homeView.render({
        reports: recentReport,
        posts: recentPosts,
        events: recentEvents
});

    } catch (error) {
        console.error('Error loading home page:', error);
        homeView.render({ reports: [], posts: [], events: [] });
    }
}