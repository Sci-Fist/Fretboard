// rendering.js
import { drawFretboard, drawStrings, drawFrets, drawNotes, clearCanvas } from './fretboard-processor.js'; // Add .js extension
import { getTablatureData } from './tab-data.js'; // Add .js extension
import { playNote } from './audio.js'; // Add .js extension
import { createNumberCircle } from './ui-elements.js'; // Add .js extension
import { handleFretInput } from './ui-elements.js'; // Add .js extension

// --- Rendering Variables ---
let canvas;
let ctx;
let fretboardData;
let currentTab = []; // Not used in this rendering approach, using tabData from tab-data.js now
let selectedString = null;
let selectedFret = null;
let isPlaying = false;
let currentNoteIndex = 0;
let animationFrameId;

// --- Initialization ---

/**
 * Initializes the rendering system.
 * @param {string} canvasId - The ID of the canvas element.
 */
export function initializeRendering(canvasId) {
    // Get the canvas element and its 2D rendering context.
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

    // Add event listener for bar clicks.
    canvas.addEventListener('click', handleCanvasClick);

    // Initialize fretboard data.
    fretboardData = {
        strings: 6,
        frets: 12, // Number of frets to *draw* on the fretboard canvas (visual frets)
        stringSpacing: 20,
        fretSpacing: 60,
        startPositionX: 50,
        startPositionY: 50,
        noteRadius: 8,
        noteColor: 'red',
        textColor: 'black',
        font: '12px Arial',
    };

    // Initial draw of the fretboard.
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

    // Adjust canvas size based on fretboard data.
    canvas.width = fretboardData.startPositionX * 2 + fretboardData.fretSpacing * fretboardData.frets;
    canvas.height = fretboardData.startPositionY * 2 + fretboardData.stringSpacing * (fretboardData.strings - 1);

    // Redraw the fretboard after resizing.
    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
    // drawNotes(ctx, fretboardData, currentTab); // Notes are now rendered in renderTab function
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
        measureDiv.dataset.measureIndex = measureIndex; // Store measure index

        const measureLabel = document.createElement('div');
        measureLabel.className = 'measure-label';
        measureLabel.textContent = `Measure ${measureIndex + 1} (${measure.name}, ${measure.timeSignature})`;
        measureDiv.appendChild(measureLabel);


        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement('div');
            stringDiv.className = 'tab-string';
            stringDiv.dataset.stringIndex = stringIndex; // Store string index

            for (let fretIndex = 0; fretIndex < measure.strings[stringIndex].length; fretIndex++) {
                const fretElement = document.createElement('div');
                fretElement.className = 'fret';
                fretElement.textContent = measure.strings[stringIndex][fretIndex]; // Display fret value from tabData
                fretElement.dataset.measure = measureIndex;
                fretElement.dataset.string = stringIndex;
                fretElement.dataset.fret = fretIndex;
                fretElement.setAttribute('tabindex', '0'); // Make fret focusable

                // Add event listeners to fret element
                fretElement.addEventListener('click', handleFretClick);
                fretElement.addEventListener('keydown', handleFretKeydown);
                fretElement.addEventListener('blur', handleFretBlur);


                stringDiv.appendChild(fretElement);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });

    console.log("rendering.js: Tab rendered to DOM.");
}


// --- Event Handlers for DOM rendered frets ---

/**
 * Handles clicks on a fret element in the DOM.
 * @param {MouseEvent} event - The click event.
 */
function handleFretClick(event) {
    console.log("rendering.js: handleFretClick called");
    const fretElement = event.target;
    // Remove any existing number circles
    const fretsWithCircles = document.querySelectorAll('.fret .number-circle');
    fretsWithCircles.forEach(circle => circle.remove());
    // Show the number circle on the clicked fret
    showNumberCircleForDOMFret(fretElement);
}

/**
 * Handles keydown events on a fret element.
 * @param {KeyboardEvent} event - The keydown event.
 */
function handleFretKeydown(event) {
    console.log("rendering.js: handleFretKeydown called");
    const key = event.key;
    const fretElement = event.target;

    if (key >= '0' && key <= '9') {
        fretElement.textContent = key; // Update fret text content directly
        handleFretInputEvent(event); // Call handleFretInput with the event
        event.preventDefault(); // Prevent default input behavior if needed
    } else if (key === 'Delete' || key === 'Backspace') {
        fretElement.textContent = '-'; // Clear fret value
        handleFretInputEvent(event); // Call handleFretInput with the event
        event.preventDefault();
    } else if (key.startsWith('Arrow')) {
        handleArrowKeyNavigation(key, fretElement);
    }
}

/**
 * Handles blur event on a fret element.
 * @param {FocusEvent} event - The blur event.
 */
function handleFretBlur(event) {
    console.log("rendering.js: handleFretBlur called");
    event.target.classList.remove('active-fret');
}


/**
 * Shows the number circle for a DOM fret element.
 * @param {HTMLElement} fretElement - The fret element.
 */
function showNumberCircleForDOMFret(fretElement) {
    console.log("rendering.js: showNumberCircleForDOMFret called");
    const rect = fretElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 60; // Position above the fret

    // Create and display the number circle.
    createNumberCircle(ctx, x, y, [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        '1x', '2x'
    ], (value) => {
        // Handle the number circle click.
        handleNumberCircleClickForDOMFret(fretElement, value);
    });
}

/**
 * Handles clicks on the number circle for DOM fret elements.
 * @param {HTMLElement} fretElement - The fret element.
 * @param {string} value - The value of the clicked number.
 */
function handleNumberCircleClickForDOMFret(fretElement, value) {
    console.log(`rendering.js: handleNumberCircleClickForDOMFret called with value: ${value}`);
    fretElement.textContent = value; // Update fret text content with selected value
    handleFretInputEvent({ target: fretElement }); // Simulate event and call handleFretInput
}


/**
 * Simulates a generic event and calls handleFretInput.
 * @param {object} eventData - Data to simulate the event (e.g., { target: fretElement }).
 */
function handleFretInputEvent(eventData) {
    console.log("rendering.js: handleFretInputEvent called");
    if (eventData && eventData.target) {
        handleFretInput(eventData, getTabData, setTabData, renderTab); // Call handleFretInput
    } else {
        console.error("Invalid event data provided to handleFretInputEvent.");
    }
}


// --- Canvas Click Handling (Currently Not Used for Tab Editing) ---

/**
 * Handles clicks on the canvas (currently used for fretboard interaction, not tab editing).
 * @param {MouseEvent} event - The mouse click event.
 */
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate the string and fret based on the click coordinates on the *canvas* (visual fretboard)
    const string = Math.floor((y - fretboardData.startPositionY) / fretboardData.stringSpacing);
    const fret = Math.floor((x - fretboardData.startPositionX) / fretboardData.fretSpacing);

    // Check if the click is within the fretboard bounds.
    if (string >= 0 && string < fretboardData.strings && fret >= 0 && fret <= fretboardData.frets) {
        console.log(`Clicked on canvas string: ${string}, fret: ${fret}`);
        playNote(string, fret); // Play note on canvas click for visual fretboard interaction
        // showNumberCircle(fret, string); // Potentially re-enable number circle on canvas click if needed
    }
}


// --- Playback Control (Placeholders - to be implemented) ---

/**
 * Starts the tablature playback.
 */
export function playTab() {
    console.log("rendering.js: playTab called (placeholder)");
    // Implementation will be moved to app.js and audio.js, this will trigger playback start
    alert("Tab Playback - Feature in progress.");
}

/**
 * Stops the tablature playback.
 */
export function stopTab() {
    console.log("rendering.js: stopTab called (placeholder)");
    // Implementation will be moved to app.js and audio.js, this will trigger playback stop
    alert("Tab Stop - Feature in progress.");
}
