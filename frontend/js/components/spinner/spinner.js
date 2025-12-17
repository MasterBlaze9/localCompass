const Spinner = {
    /**
     * Creates a spinner element
     * @param {string} size - 'sm' for small, 'md' for medium (default)
     * @returns {HTMLElement}
     */
    create(size = 'md') {
        const wrapper = document.createElement('div');
        wrapper.className = 'spinner-container';

        const spinner = document.createElement('div');
        spinner.className = `loading-spinner ${size === 'sm' ? 'spinner-sm' : ''}`;
        
        wrapper.appendChild(spinner);
        return wrapper;
    },

    /**
     * Helper to show spinner in a specific element
     * @param {HTMLElement} container 
     */
    showIn(container) {
        container.innerHTML = '';
        container.appendChild(this.create());
    }
};

export default Spinner;