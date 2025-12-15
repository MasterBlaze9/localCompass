import createButton from "../../components/button/button.js"

function render() {
    const container = document.querySelector('#container')
    const div = document.createElement('div');

    div.className = `text-center`;

    const btn = createButton({
        label: 'Go to Events',
        className: 'lc-button lc-button--primary',
        onClick: () => {
          
            window.location.href = '/events';
        },
    });

    div.appendChild(btn);
    container.innerHTML = '';
    container.appendChild(div);
}

export default { render };