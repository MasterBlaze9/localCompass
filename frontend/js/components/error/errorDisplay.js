// Reusable error display component
// Usage: import { showError, hideError } from './components/error/errorDisplay.js';


// Show an error message with auto-hide (default 4s)
export function showError(container, message, { autoHide = true, duration = 4000 } = {}) {
	let errorBox = container.querySelector('.lc-error');
	if (!errorBox) {
		errorBox = document.createElement('div');
		errorBox.className = 'lc-error';
		container.prepend(errorBox);
	}
	errorBox.textContent = message;
	errorBox.style.display = 'block';
	errorBox.classList.remove('lc-success');
	errorBox.classList.add('lc-error');
	if (autoHide) {
		clearTimeout(errorBox._hideTimeout);
		errorBox._hideTimeout = setTimeout(() => {
			errorBox.style.display = 'none';
		}, duration);
	}
}

// Show a success message with auto-hide (default 3s)
export function showSuccess(container, message, { autoHide = true, duration = 3000 } = {}) {
	let successBox = container.querySelector('.lc-error');
	if (!successBox) {
		successBox = document.createElement('div');
		successBox.className = 'lc-error';
		container.prepend(successBox);
	}
	successBox.textContent = message;
	successBox.style.display = 'block';
	successBox.classList.remove('lc-error');
	successBox.classList.add('lc-success');
	if (autoHide) {
		clearTimeout(successBox._hideTimeout);
		successBox._hideTimeout = setTimeout(() => {
			successBox.style.display = 'none';
		}, duration);
	}
}

export function hideError(container) {
	const errorBox = container.querySelector('.lc-error');
	if (errorBox) {
		errorBox.style.display = 'none';
		errorBox.textContent = '';
	}
}