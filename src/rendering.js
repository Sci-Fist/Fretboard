// rendering.js
import { drawFretboard, drawStrings, drawFrets, drawNotes, clearCanvas } from './fretboard-processor.js';
import { getTabData, setTabData } from './tab-data.js';
import { playNote } from './audio.js';
import { createNumberCircle } from './ui-elements.js';
import { handleFretInput } from './ui-elements.js';

// --- Rendering Variables ---
let canvas;
let ctx;
let fretboardData;
let isPlaying = false;
let currentNoteIndex = 0;
let animationFrameId;

// --- Initialization ---

/**
 * Initializes the rendering system.
 * @param {string} canvasId - The ID of the canvas element.
 */
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

// --- Canvas Resizing ---

/**
 * Resizes the canvas based on the fretboard data.
 */
export function resizeCanvas() {
    if (!canvas || !ctx || !fretboardData) return;
    canvas.width = fretboardData.startPositionX * 2 + fretboardData.fretSpacing * fretboardData.frets;
    canvas.height = fretboardData.startPositionY * 2 + fretboardData.stringSpacing * (fretboardData.strings - 1);
    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
}

/**
 * Renders the entire tablature from tabData.measures.
 * @param {object} tabData - The complete tablature data object.
 */
export function renderTab(tabData) {
    console.log("rendering.js: renderTab called with tabData:", tabData);
    const tabDisplay = document.getElementById('tab-display');
    if (!tabDisplay) {
        console.error("Tab display element not found.");
        return;
    }
    tabDisplay.innerHTML = ''; // Clear existing tab display

    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        tabDisplay.textContent = "No tablature data available.";
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
            stringDiv.dataset.stringIndex = stringIndex;

            for (let fretIndex = 0; fretIndex < measure.strings[stringIndex].length; fretIndex++) {
                const fretElement = document.createElement('div');
                fretElement.className = 'fret';
                fretElement.textContent = measure.strings[stringIndex][fretIndex];
                fretElement.dataset.measure = measureIndex;
                fretElement.dataset.string = stringIndex;
                fretElement.dataset.fret = fretIndex;
                fretElement.setAttribute('tabindex', '0');

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


// --- Event Handlers for DOM rendered frets ---

function handleFretClick(event) {
    console.log("rendering.js: handleFretClick called");
    const fretElement = event.target;
    const fretsWithCircles = document.querySelectorAll('.fret .number-circle');
    fretsWithCircles.forEach(circle => circle.remove());
    showNumberCircleForDOMFret(fretElement);
}

function handleFretKeydown(event) {
    console.log("rendering.js: handleFretKeydown called");
    const key = event.key;
    const fretElement = event.target;

    if (key >= '0' && key <= '9') {
        fretElement.textContent = key;
        handleFretInputEvent(event);
        event.preventDefault();
    } else if (key === 'Delete' || key === 'Backspace') {
        fretElement.textContent = '-';
        handleFretInputEvent(event);
        event.preventDefault();
    } else if (key.startsWith('Arrow')) {
        handleArrowKeyNavigation(key, fretElement);
    }
}

function handleFretBlur(event) {
    console.log("rendering.js: handleFretBlur called");
    event.target.classList.remove('active-fret');
}

function showNumberCircleForDOMFret(fretElement) {
    console.log("rendering.js: showNumberCircleForDOMFret called");
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
    console.log(`rendering.js: handleNumberCircleClickForDOMFret called with value: ${value}`);
    fretElement.textContent = value;
    handleFretInputEvent({ target: fretElement });
}

function handleFretInputEvent(eventData) {
    console.log("rendering.js: handleFretInputEvent called");
    if (eventData && eventData.target) {
        handleFretInput(eventData, getTabData, setTabData, renderTab);
    } else {
        console.error("Invalid event data provided to handleFretInputEvent.");
    }
}

function handleArrowKeyNavigation(key, currentFret) {
    const measureIndex = parseInt(currentFret.dataset.measure);
    const stringIndex = parseInt(currentFret.dataset.string);
    const fretIndex = parseInt(currentFret.dataset.fret);

    let nextFret;

    switch (key) {
        case 'ArrowLeft':
            if (fretIndex > 0) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex - 1}`);
            } else if (measureIndex > 0) {
                nextFret = document.getElementById(`fret-${measureIndex - 1}-${stringIndex}-${getTabData().measures[measureIndex - 1].strings[stringIndex].length - 1}`);
            }
            break;
        case 'ArrowRight':
            if (fretIndex < getTabData().measures[measureIndex].strings[stringIndex].length - 1) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex + 1}`);
            } else {
                const nextMeasureIndex = measureIndex + 1;
                if (document.querySelector(`.measure:nth-child(${nextMeasureIndex + 1}) .tab-string:nth-child(${stringIndex + 1}) .fret[data-fret='0']`)) {
                    nextFret = document.querySelector(`.measure:nth-child(${nextMeasureIndex + 1}) .tab-string:nth-child(${stringIndex + 1}) .fret[data-fret='0']`);
                }
            }
            break;
        case 'ArrowUp':
            if (stringIndex > 0) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex - 1}-${fretIndex}`);
            }
            break;
        case 'ArrowDown':
            if (stringIndex < 5) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex + 1}-${fretIndex}`);
            }
            break;
    }

    if (nextFret) {
        currentFret.classList.remove('active-fret');
        nextFret.classList.add('active-fret');
        nextFret.focus();
        localStorage.setItem('activeFretId', nextFret.id);
    }
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const string = Math.floor((y - fretboardData.startPositionY) / fretboardData.stringSpacing);
    const fret = Math.floor((x - fretboardData.startPositionX) / fretboardData.fretSpacing);

    if (string >= 0 && string < fretboardData.strings && fret >= 0 && fret <= fretboardData.frets) {
        console.log(`Clicked on canvas string: ${string}, fret: ${fret}`);
        playNote(string, fret);
    }
}

export function playTab() {
    console.log("rendering.js: playTab called (placeholder)");
    alert("Tab Playback - Feature in progress.");
}

export function stopTab() {
    console.log("rendering.js: stopTab called (placeholder)");
    alert("Tab Stop - Feature in progress.");
}

