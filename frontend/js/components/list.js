import spinner from '../spinner/spinner.js';
import './list.css';

/**
 * Creates a generic list using the DOM construction pattern.
 */
export function createGenericList(containerId, options = {}) {
  const container = document.getElementById(containerId);
  const renderItem = options.renderItem || ((item) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = item;
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
      // Use the class defined in list.css for the flex grid
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