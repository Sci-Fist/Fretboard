// rendering.js
import { drawFretboard, drawStrings, drawFrets, drawNotes, clearCanvas } from './fretboard-processor';
import { getTablatureData } from './tab-data';
import { playNote } from './audio';
import { createNumberCircle } from './ui-elements'; // Import the function

let canvas;
let ctx;
let fretboardData;
let currentTab = [];
let selectedString = null;
let selectedFret = null;
let isPlaying = false;
let currentNoteIndex = 0;
let animationFrameId;

// Function to initialize the rendering
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
    // Add event listener for bar clicks
    canvas.addEventListener('click', handleCanvasClick);
    // Initialize fretboard data (example)
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
    // Initial draw
    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
}

// Function to resize the canvas
export function resizeCanvas() {
    if (!canvas || !ctx || !fretboardData) return;
    // Adjust canvas size based on fretboard data
    canvas.width = fretboardData.startPositionX * 2 + fretboardData.fretSpacing * fretboardData.frets;
    canvas.height = fretboardData.startPositionY * 2 + fretboardData.stringSpacing * (fretboardData.strings - 1);
    // Redraw the fretboard after resizing
    drawFretboard(ctx, fretboardData);
    drawStrings(ctx, fretboardData);
    drawFrets(ctx, fretboardData);
    drawNotes(ctx, fretboardData, currentTab);
}

// Function to update the tablature
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

// Function to play note playback
export function playTab() {
    if (isPlaying) {
        stopTab();
        return;
    }
    isPlaying = true;
    currentNoteIndex = 0;
    playNextNote();
}

// Function to stop note playback
export function stopTab() {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    currentNoteIndex = 0;
}

// Function to play the next note
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

// Function to handle canvas clicks
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate the string and fret based on the click coordinates
    const string = Math.floor((y - fretboardData.startPositionY) / fretboardData.stringSpacing);
    const fret = Math.floor((x - fretboardData.startPositionX) / fretboardData.fretSpacing);

    // Check if the click is within the fretboard bounds
    if (string >= 0 && string < fretboardData.strings && fret >= 0 && fret <= fretboardData.frets) {
        console.log(`Clicked on string: ${string}, fret: ${fret}`);
        // Show the number circle when a bar is clicked
        showNumberCircle(fret, string);
    }
}

// Function to show the number circle
function showNumberCircle(fret, string) {
    // Get the position to display the number circle
    const x = fretboardData.startPositionX + fret * fretboardData.fretSpacing;
    const y = fretboardData.startPositionY - 20; // Above the fret

    // Create and display the number circle
    createNumberCircle(ctx, x, y, [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        '1x', '2x'
    ], (value) => {
        // Handle the number circle click
        handleNumberCircleClick(fret, string, value);
    });
}

// Function to handle number circle clicks
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

// Function to show the second number circle for two-digit input
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

// Function to update the tab data with the selected fret number
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
