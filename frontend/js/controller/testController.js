import testView from "../view/test/testView.js";
import userService from "../service/userService.js";

export async function init() {
    async function load() {
        // 1. Fetch 'me' for permissions/context (following your postController pattern)
        const me = await userService.getMe().catch(() => null);

        const handlers = {
            onDelete: async (userId) => {
                if (confirm('Are you sure you want to remove this user?')) {
                    await userService.deleteUser(userId);
                    load(); // Refresh list
                }
            },
            onMessage: (user) => console.log('Messaging:', user.email)
        };

        // 2. Render the view shell
        const view = testView.render(me, handlers);

        // 3. Trigger the generic list to fetch actual user data
        // This passes the promise to the component's internal state manager
        const fetchPromise = userService.getAllUsers();
        view.listComponent.updateData(fetchPromise);
    }

    await load();
}