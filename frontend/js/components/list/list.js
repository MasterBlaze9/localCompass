import spinner from '../../components/spinner/spinner.js';
import './list.css';

/**
 * Creates a generic list component using the DOM construction pattern.
 * Supports loading, error, and empty states with a flexible item renderer.
 * 
 * @param {string} containerId - The ID of the container element
 * @param {Object} options - Configuration options
 * @param {Function} options.renderItem - Function to render each item (required)
 * @returns {Object} - Object with updateData method to load list data
 */
export function createGenericList(containerId, options = {}) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return { updateData: () => { } };
  }

  const renderItem = options.renderItem || ((item) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = item.toString ? item.toString() : item;
    return li;
  });

  let state = { data: [], loading: false, error: null };

  const render = () => {
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'lc-list-wrapper';

    const body = document.createElement('div');
    body.className = 'lc-list-body';

    if (state.loading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'lc-list-centered p-5';
      loadingDiv.appendChild(spinner.create());
      body.appendChild(loadingDiv);
    }
    else if (state.error) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger d-flex align-items-center m-3';
      const msg = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = 'Error: ';
      msg.append(strong, state.error);
      errorDiv.appendChild(msg);
      body.appendChild(errorDiv);
    }
    else if (state.data.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'text-center p-4 text-muted';
      emptyDiv.textContent = 'No results found.';
      body.appendChild(emptyDiv);
    }
    else {
      const ul = document.createElement('ul');
      ul.className = 'lc-list-group';

      state.data.forEach(item => {
        const itemNode = renderItem(item);
        ul.appendChild(itemNode);
      });
      body.appendChild(ul);
    }

    wrapper.appendChild(body);
    container.appendChild(wrapper);
  };

  const updateData = async (fetchPromise) => {
    state = { ...state, loading: true, error: null };
    render();
    try {
      const data = await fetchPromise;
      state = { ...state, data, loading: false };
    } catch (err) {
      state = { ...state, error: err.message, loading: false };
    }
    render();
  };

  return { updateData };
}