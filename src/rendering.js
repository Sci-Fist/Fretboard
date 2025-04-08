// rendering.js
import { drawFretboard, drawStrings, drawFrets, clearCanvas } from './fretboard-processor.js';
import { getTabData, setTabData } from './tab-data.js';
import { playNote } from './audio.js';
import { createNumberCircle, removeActiveFretClass } from './ui-elements.js';

let canvas;
let ctx;
let fretboardData;

export function initializeRendering(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }
    canvas.addEventListener('click', handleCanvasClick);

    fretboardData = {
        strings: 6,
        frets: 12,
        stringSpacing: 20,
        fretSpacing: 60,
        startPositionX: 50,
        startPositionY: 50,
        noteRadius: 8,
        noteColor: 'red',
        textColor: 'black',
        font: '12px Arial',
    };

    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
}

export function resizeCanvas() {
    if (!canvas || !ctx || !fretboardData) return;
    canvas.width = fretboardData.startPositionX * 2 + fretboardData.fretSpacing * fretboardData.frets;
    canvas.height = fretboardData.startPositionY * 2 + fretboardData.stringSpacing * (fretboardData.strings - 1);
    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
}

export function renderTab(tabData) {
    console.log('rendering.js: renderTab called with tabData:', tabData);
    const tabDisplay = document.getElementById('tab-display');
    if (!tabDisplay) {
        console.error('Tab display element not found.');
        return;
    }
    tabDisplay.innerHTML = '';

    if (!tabData || !tabData.measures.length) {
        tabDisplay.textContent = 'No tablature data available.';
        return;
    }

    tabData.measures.forEach((measure, measureIndex) => {
        const measureDiv = document.createElement('div');
        measureDiv.className = 'measure';
        measureDiv.dataset.measureIndex = measureIndex;

        const measureLabel = document.createElement('div');
        measureLabel.className = 'measure-label';
        measureLabel.textContent = `Measure ${measureIndex + 1} (${measure.name || 'Unnamed'}, ${measure.timeSignature})`;
        measureDiv.appendChild(measureLabel);

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement('div');
            stringDiv.className = 'tab-string';
            for (let fretIndex = 0; fretIndex < measure.strings[stringIndex].length; fretIndex++) {
                const fretElement = document.createElement('div');
                fretElement.className = 'fret';
                fretElement.textContent = measure.strings[stringIndex][fretIndex];
                fretElement.dataset.measure = measureIndex;
                fretElement.dataset.string = stringIndex;
                fretElement.dataset.fret = fretIndex;
                fretElement.addEventListener('click', handleFretClick);
                fretElement.addEventListener('keydown', handleFretKeydown);
                fretElement.addEventListener('blur', handleFretBlur);
                stringDiv.appendChild(fretElement);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
}

function handleFretClick(event) {
    const fretElement = event.target;
    removeActiveFretClass();
    fretElement.classList.add('active-fret');
    showNumberCircle(fretElement);
}

function handleFretKeydown(event) {
    const key = event.key;
    const fretElement = event.target;
    if (key >= '0' && key <= '9') {
        fretElement.textContent = key;
        handleFretInput({ target: fretElement });
        event.preventDefault();
    } else if (key === 'Backspace' || key === 'Delete') {
        fretElement.textContent = '-';
        handleFretInput({ target: fretElement });
        event.preventDefault();
    }
}

function handleFretBlur(event) {
    event.target.classList.remove('active-fret');
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const string = Math.floor((y - fretboardData.startPositionY) / fretboardData.stringSpacing);
    const fret = Math.floor((x - fretboardData.startPositionX) / fretboardData.fretSpacing);
    if (string >= 0 && string < fretboardData.strings && fret >= 0 && fret < fretboardData.frets) {
        playNote(string, fret);
    }
}

export function playTab() {
    console.log('rendering.js: playTab called (placeholder)');
    alert('Tab playback not yet implemented.');
}

export function stopTab() {
    console.log('rendering.js: stopTab called (placeholder)');
    alert('Tab stop not yet implemented.');
}
