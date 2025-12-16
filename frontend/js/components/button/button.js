import './button.css';

export default function createButton({
	label = 'Button',
	color,
	width,
	height,
	onClick,
	className = 'lc-button',
	type = 'button',
	disabled = false,
	//border radius could be added later if needed
}) {
	const btn = document.createElement('button');
	btn.type = type;
	btn.disabled = disabled;
	btn.textContent = label;


	btn.className = className;


	if (color) btn.style.color = color;
	if (width) btn.style.width = typeof width === 'number' ? `${width}px` : width;
	if (height) btn.style.height = typeof height === 'number' ? `${height}px` : height;

	if (typeof onClick === 'function') {
		btn.addEventListener('click', onClick);
	}

	return btn;
}