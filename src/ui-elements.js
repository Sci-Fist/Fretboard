// ui-elements.js
import config from '../config.js';

let numberCircleElements = [];

function clearNumberCircles() {
    numberCircleElements.forEach(element => element.remove());
    numberCircleElements = [];
}

export function createNumberCircle(x, y, numbers, onClick) {
    clearNumberCircles();
    const numberElements = numbers.map((number, index) => {
        const angle = (index / numbers.length) * 2 * Math.PI;
        const radius = 20;
        const offsetX = Math.cos(angle) * radius * 1.2;
        const offsetY = Math.sin(angle) * radius * 1.2;
        const element = document.createElement('div');
        element.textContent = number;
        element.style.position = 'absolute';
        element.style.left = `${x + offsetX - parseFloat(config.numberCircleSize) / 2}px`;
        element.style.top = `${y + offsetY - parseFloat(config.numberCircleSize) / 2}px`;
        element.style.width = config.numberCircleSize;
        element.style.height = config.numberCircleSize;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = config.numberCircleBackgroundColor;
        element.style.color = config.numberCircleTextColor;
        element.style.textAlign = 'center';
        element.style.lineHeight = config.numberCircleSize;
        element.style.cursor = 'pointer';
        element.style.fontSize = config.numberCircleFont;
        element.classList.add('number-circle');
        element.addEventListener('click', () => {
            onClick(number);
            clearNumberCircles();
        });
        return element;
    });
    numberElements.forEach(element => document.body.appendChild(element));
    numberCircleElements = numberElements;
}

export function handleFretInput(event) {
    const fretElement = event.target;
    const measureIndex = parseInt(fretElement.dataset.measure);
    const stringIndex = parseInt(fretElement.dataset.string);
    const fretIndex = parseInt(fretElement.dataset.fret);
    const newValue = fretElement.textContent;

    if (isNaN(measureIndex) || isNaN(stringIndex) || isNaN(fretIndex)) {
        console.error('Invalid data attributes on fret element.');
        return;
    }

    const tabData = getTabData();

    if (!tabData.measures[measureIndex] || !tabData.measures[measureIndex].strings[stringIndex]) {
        console.error('Invalid tab data structure.');
        return;
    }

    tabData.measures[measureIndex].strings[stringIndex][fretIndex] = newValue;
    setTabData(tabData);
    renderTab(tabData);
}

export function removeActiveFretClass() {
    document.querySelectorAll('.fret.active-fret').forEach(el => el.classList.remove('active-fret'));
}

export function showNumberCircle(fretElement) {
    const rect = fretElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height; // Position below the fret

    createNumberCircle(x, y, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1x', '2x'], (value) => {
        fretElement.textContent = value;
        handleFretInput({ target: fretElement });
    });
}
