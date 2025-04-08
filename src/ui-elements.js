// ui-elements.js
import config from '../config.js';

let numberCircleElements = [];

function clearNumberCircles() {
    numberCircleElements.forEach(element => {
        element.remove();
    });
    numberCircleElements = [];
}

export function createNumberCircle(ctx, x, y, numbers, onClick) {
    const circleRadius = 20;
    const numberSpacing = 1.2;
    const angleIncrement = (2 * Math.PI) / numbers.length;
    const centerX = x;
    const centerY = y;

    clearNumberCircles();

    const numberElements = [];

    numbers.forEach((number, index) => {
        const angle = index * angleIncrement;
        const numberX = centerX + Math.cos(angle) * circleRadius * numberSpacing;
        const numberY = centerY + Math.sin(angle) * circleRadius * numberSpacing;

        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.style.position = 'absolute';
        numberElement.style.left = `${numberX - parseFloat(config.numberCircleSize) / 2}px`;
        numberElement.style.top = `${numberY - parseFloat(config.numberCircleSize) / 2}px`;
        numberElement.style.width = config.numberCircleSize;
        numberElement.style.height = config.numberCircleSize;
        numberElement.style.borderRadius = '50%';
        numberElement.style.backgroundColor = config.numberCircleBackgroundColor;
        numberElement.style.color = config.numberCircleTextColor;
        numberElement.style.textAlign = 'center';
        numberElement.style.lineHeight = config.numberCircleSize;
        numberElement.style.cursor = 'pointer';
        numberElement.style.fontSize = config.numberCircleFont;
        numberElement.classList.add('number-circle');

        numberElement.addEventListener('click', () => {
            onClick(number);
            clearNumberCircles();
        });

        document.body.appendChild(numberElement);
        numberElements.push(numberElement);
    });

    numberCircleElements = numberElements;
}

export function handleFretInput(event) {
    const fretElement = event.target;
    const measureIndex = parseInt(fretElement.dataset.measure);
    const stringIndex = parseInt(fretElement.dataset.string);
    const fretIndexInMeasure = parseInt(fretElement.dataset.fret);
    const newFretValue = fretElement.textContent;

    if (isNaN(measureIndex) || isNaN(stringIndex) || isNaN(fretIndexInMeasure)) {
        console.error("Data attributes missing or invalid on fret element.");
        return;
    }

    let tabData = getTabData();

    if (!tabData || !tabData.measures[measureIndex] || !tabData.measures[measureIndex].strings[stringIndex]) {
        console.error("TabData structure is invalid or measure/string is out of bounds.");
        return;
    }

    tabData.measures[measureIndex].strings[stringIndex][fretIndexInMeasure] = newFretValue;
    setTabData(tabData);
    renderTab(tabData);
}

export function removeActiveFretClass() {
    document.querySelectorAll('.fret.active-fret').forEach(fret => fret.classList.remove('active-fret'));
}

export function showNumberCircle(fretElement) {
    const rect = fretElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 60;

    createNumberCircle(ctx, x, y, [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        '1x', '2x'
    ], (value) => {
        handleNumberCircleClickForDOMFret(fretElement, value);
    });
}

function handleNumberCircleClickForDOMFret(fretElement, value) {
    fretElement.textContent = value;
    handleFretInput({ target: fretElement });
}

