// rendering.js
import { drawFretboard, drawStrings, drawFrets, drawNotes, clearCanvas } from './fretboard-processor';
import { getTablatureData } from './tab-data';
import { playNote } from './audio';
import { createNumberCircle } from './ui-elements'; // Import the function

// --- Rendering Variables ---
let canvas;
let ctx;
let fretboardData;
let currentTab = [];
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
    drawNotes(ctx, fretboardData, currentTab);
}

// --- Tablature Updates ---

/**
 * Updates the tablature being displayed.
 * @param {Array} newTab - The new tablature data.
 */
export function updateTablature(newTab) {
    currentTab = newTab;
    if (ctx && fretboardData) {
        clearCanvas(ctx, canvas.width, canvas.height);
        drawFretboard(ctx, fretboardData);
        drawStrings(ctx, fretboardData);
        drawFrets(ctx, fretboardData);
        drawNotes(ctx, fretboardData, currentTab);
    }
}

// --- Playback Control ---

/**
 * Starts the tablature playback.
 */
export function playTab() {
    if (isPlaying) {
        stopTab();
        return;
    }
    isPlaying = true;
    currentNoteIndex = 0;
    playNextNote();
}

/**
 * Stops the tablature playback.
 */
export function stopTab() {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    currentNoteIndex = 0;
}

/**
 * Plays the next note in the tablature.
 */
function playNextNote() {
    if (!isPlaying || currentNoteIndex >= currentTab.length) {
        stopTab();
        return;
    }
    const note = currentTab[currentNoteIndex];
    if (note) {
        playNote(note.string, note.fret);
    }
    currentNoteIndex++;
    // Delay before playing the next note (adjust as needed)
    setTimeout(() => {
        if (isPlaying) {
            animationFrameId = requestAnimationFrame(playNextNote);
        }
    }, 500); // 500ms delay
}

// --- Event Handlers ---

/**
 * Handles clicks on the canvas.
 * @param {MouseEvent} event - The mouse click event.
 */
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate the string and fret based on the click coordinates.
    const string = Math.floor((y - fretboardData.startPositionY) / fretboardData.stringSpacing);
    const fret = Math.floor((x - fretboardData.startPositionX) / fretboardData.fretSpacing);

    // Check if the click is within the fretboard bounds.
    if (string >= 0 && string < fretboardData.strings && fret >= 0 && fret <= fretboardData.frets) {
        console.log(`Clicked on string: ${string}, fret: ${fret}`);
        // Show the number circle when a bar is clicked.
        showNumberCircle(fret, string);
    }
}

// --- Number Circle Display ---

/**
 * Displays the number circle at the specified fret and string.
 * @param {number} fret - The fret number.
 * @param {number} string - The string number.
 */
function showNumberCircle(fret, string) {
    // Get the position to display the number circle.
    const x = fretboardData.startPositionX + fret * fretboardData.fretSpacing;
    const y = fretboardData.startPositionY - 20; // Above the fret

    // Create and display the number circle.
    createNumberCircle(ctx, x, y, [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        '1x', '2x'
    ], (value) => {
        // Handle the number circle click.
        handleNumberCircleClick(fret, string, value);
    });
}

// --- Number Circle Click Handling ---

/**
 * Handles clicks on the number circle.
 * @param {number} fret - The fret number.
 * @param {number} string - The string number.
 * @param {string} value - The value of the clicked number.
 */
function handleNumberCircleClick(fret, string, value) {
    console.log(`Clicked on number: ${value} for string: ${string}, fret: ${fret}`);

    if (value === '1x' || value === '2x') {
        // Show the second number circle for two-digit input
        showSecondNumberCircle(fret, string, value);
    } else {
        // Handle single-digit fret number selection
        // Update the tab data with the selected fret number
        updateTabWithFretNumber(fret, string, value);
    }
}

// --- Two-Digit Fret Input ---

/**
 * Shows the second number circle for two-digit input (1x or 2x).
 * @param {number} fret - The fret number.
 * @param {number} string - The string number.
 * @param {string} prefix - The prefix ('1x' or '2x').
 */
function showSecondNumberCircle(fret, string, prefix) {
    // Get the position to display the number circle
    const x = fretboardData.startPositionX + fret * fretboardData.fretSpacing;
    const y = fretboardData.startPositionY - 20; // Above the fret

    // Create and display the second number circle
    createNumberCircle(ctx, x, y, ['1', '2', '3', '4', '5', '6', '7', '8', '9'], (secondDigit) => {
        // Handle the second number circle click
        const fretNumber = prefix[0] === '1' ? prefix[0] + secondDigit : prefix[0] + secondDigit;
        updateTabWithFretNumber(fret, string, fretNumber);
    });
}

// --- Tab Data Update ---

/**
 * Updates the tab data with the selected fret number.
 * @param {number} fret - The fret number.
 * @param {number} string - The string number.
 * @param {string} fretNumber - The selected fret number (as a string).
 */
function updateTabWithFretNumber(fret, string, fretNumber) {
    // Convert fretNumber to a number
    const fretValue = parseInt(fretNumber, 10);

    // Ensure fretValue is a valid number
    if (!isNaN(fretValue)) {
        // Update the currentTab with the new fret number
        const newTab = [...currentTab];
        const noteIndex = newTab.findIndex(note => note.string === string && note.fret === fret);

        if (noteIndex !== -1) {
            // If a note already exists at this position, update it
            newTab[noteIndex].fret = fretValue;
        } else {
            // If no note exists, add a new one
            newTab.push({ string: string, fret: fretValue });
        }

        updateTablature(newTab);
    }
}
