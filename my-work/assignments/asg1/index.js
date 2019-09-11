const numInput = document.getElementById('num');
const button = document.getElementById('create');
const display = document.getElementById('area');
const clearBtn = document.getElementById('clear');

clearBtn.addEventListener('click', () => {
    display.innerHTML = '';
});

const createBox = () => {
    const div = document.createElement('div');
    div.setAttribute('class', 'box');
    return div;
}

button.addEventListener('click', () => {
    for(let i = 0; i < numInput.value; i++) {
        display.appendChild(createBox())
    }
})