// src/app.js
// Main app logic - setting things up and making it go!

// Main app logic - setting things up and making it go!

import * as rendering from './rendering.js';
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab, getNote } from './tab-data.js'; // Added getNote
import { setupToolBar, handleFretInput, showNumberCircle, removeOpenNumberCircle, showSecondNumberCircle, removeActiveFretClass } from './ui-elements.js'; // Added more UI imports
import { initializeAudio, playTab, stopPlayback, exportMIDI } from './audio.js'; // Adjusted audio imports for individual exports
import config from '../config.js';

console.log("app.js: Starting app.js");

// --- Placeholder Functions ---
// TODO: Implement actual functionality
function exportTab() {
    console.log("app.js: exportTab called (placeholder)");
    const tabData = getTabData();
    // Using the generateTablature function (consider moving it)
    const tabText = generateTablature(tabData);
    const blob = new Blob([tabText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guitar_tab.txt";
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Tab exported as text!");
}

function showBPMInput() {
    console.log("app.js: showBPMInput called (placeholder)");
    const currentBPM = getTabData().bpm || 120;
    const newBPM = prompt("Enter new BPM:", currentBPM);
    if (newBPM !== null && !isNaN(newBPM) && newBPM > 0) {
        const tabData = getTabData();
        tabData.bpm = parseInt(newBPM, 10);
        setTabData(tabData);
        alert(`BPM set to ${tabData.bpm}`);
        // Optionally re-render or update UI elements showing BPM
    } else if (newBPM !== null) {
        alert("Invalid BPM value.");
    }
}

function saveTab() {
    console.log("app.js: saveTab called");
    try {
        const tabData = getTabData();
        localStorage.setItem('guitarTab', JSON.stringify(tabData));
        alert('Tab saved to local storage!');
    } catch (error) {
        console.error('Error saving tab to local storage:', error);
        alert('Error saving tab. Check the console for more details.');
    }
}

function loadTab() {
    console.log("app.js: loadTab called");
    const savedTab = localStorage.getItem('guitarTab');
    if (savedTab) {
        try {
            const tabData = JSON.parse(savedTab);
            setTabData(tabData);
            rendering.renderTab(getTabData()); // Re-render after loading
            alert('Tab loaded from local storage!');
        } catch (error) {
            console.error('Error loading tab from local storage:', error);
            alert('Error loading tab. Check the console for more details.');
        }
    } else {
        alert('No tab found in local storage.');
    }
}

// Helper function (consider moving to ui-elements or utils) - needed for exportTab
function generateTablature(tabData) {
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        return "No tab data.";
    }

    let tabString = "";
    const tuning = tabData.tuning || ['E', 'A', 'D', 'G', 'B', 'E']; // Default tuning if not present
    const stringLabels = ["E", "A", "D", "G", "B", "e"]; // Standard tuning labels

    tabData.measures.forEach((measure, measureIndex) => {
        tabString += `Measure ${measureIndex + 1}:\n`;
        // Ensure measure.strings exists and has the correct length
        const strings = measure.strings && measure.strings.length === 6 ? measure.strings : Array(6).fill(['-', '-', '-', '-']);

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            tabString += `${stringLabels[stringIndex]}|`;
            // Ensure the string array exists and has the correct length
            const frets = strings[stringIndex] && strings[stringIndex].length === 4 ? strings[stringIndex] : ['-', '-', '-', '-'];
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                // Pad for basic alignment, ensure '-' for empty/undefined
                const fretValue = (frets[fretIndex] !== undefined && frets[fretIndex] !== '') ? String(frets[fretIndex]) : "-";
                tabString += fretValue.padEnd(2, ' '); // Pad with space
                tabString += "|";
            }
            tabString += "\n";
        }
        tabString += "\n";
    });

    // Add BPM info
    tabString += `BPM: ${tabData.bpm || 120}\n`;

    return tabString;
}


// --- UI Setup ---
/**
 * Sets up UI elements and event listeners.
 */
function setupUI() {
    console.log("app.js: setupUI called");

    // Apply config (example - could be more extensive)
    document.body.style.fontSize = config.bodyFontSize;

    // Pass dependencies to setupToolBar
    setupToolBar({
        addMeasure,
        clearTab,
        exportTab, // Now defined in app.js
        showBPMInput, // Now defined in app.js
        playTab,
        stopPlayback,
        saveTab, // Now defined in app.js
        loadTab, // Now defined in app.js
        exportMIDI, // Imported from audio.js
        renderTab: rendering.renderTab, // Pass the rendering function
        getTabData,
        setTabData,
    });

    // Add event listener for fret clicks/focus to show number circle
    const tabDisplay = document.getElementById("tab-display");
    if (tabDisplay) {
        tabDisplay.addEventListener('click', (e) => {
            if (e.target.classList.contains('fret')) {
                // Remove active class from any previously active fret
                removeActiveFretClass();
                // Add active class to the currently focused fret
                e.target.classList.add('active-fret');
                // Store the active fret's ID in localStorage so it can be re-applied after re-render
                localStorage.setItem('activeFretId', e.target.id);
                showNumberCircle(e.target);
            } else {
                removeActiveFretClass(); // Remove highlight if clicking outside frets
            }
        });

        // Add input handling for direct typing
        tabDisplay.addEventListener('input', (e) => {
            if (e.target.classList.contains('fret')) {
                handleFretInput(e, getTabData, setTabData, rendering.renderTab);
            }
        });

        // Add keydown handling for navigation/deletion
        tabDisplay.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('fret')) {
                // Basic example: Clear fret on backspace/delete
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault(); // Prevent default browser back navigation on backspace
                    e.target.textContent = '';
                    // Trigger input event to update data model
                    e.target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault(); // Prevent default scrolling
                    handleArrowKeyNavigation(e.key, e.target);
                }
            }
        });
    } else {
        console.error("app.js: tab-display element not found for event listeners.");
    }

    // Close number circle logic (moved from ui-elements.js for better cohesion)
    document.addEventListener('click', function(event) {
        const numberCircle = document.querySelector('.number-circle');
        if (numberCircle) {
            // Check if the click is outside the circle AND not on a fret element
            if (!numberCircle.contains(event.target) && !event.target.classList.contains('fret')) {
                // Use a small timeout to allow number selection click to register first
                 setTimeout(() => {
                    // Double-check if the target is still outside after potential DOM changes
                    if (!event.target.closest('.number-circle')) {
                         removeOpenNumberCircle();
                    }
                 }, 50); // Reduced timeout
            }
        }
    });

    console.log("app.js: UI setup complete.");
}

/**
 * Handles arrow key navigation between frets.
 * @param {string} key - The arrow key pressed.
 * @param {HTMLElement} currentFret - The currently focused fret element.
 */
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
                // Move to the last fret of the previous measure on the same string
                nextFret = document.getElementById(`fret-${measureIndex - 1}-${stringIndex}-3`);
            }
            break;
        case 'ArrowRight':
            if (fretIndex < 3) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex + 1}`);
            } else {
                // Move to the first fret of the next measure on the same string
                // For now, let's just stay on the last fret if it's the last measure
                const nextMeasureIndex = measureIndex + 1;
                if (document.querySelector(`.fret[data-measure='${nextMeasureIndex}'][data-string='${stringIndex}'][data-fret='0']`)) {
                    nextFret = document.getElementById(`fret-${nextMeasureIndex}-${stringIndex}-0`);
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
        currentFret.classList.remove('active-fret'); // Remove from current
        nextFret.classList.add('active-fret'); // Add to next
        nextFret.focus();
        localStorage.setItem('activeFretId', nextFret.id); // Update stored active fret ID
    }
}


/**
 * Sets up the entire application.
 */
async function setupApp() {
  console.log("app.js: setupApp called");
  try {
    console.log("app.js: Calling initializeTabData...");
    initializeTabData();
    console.log("app.js: initializeTabData finished.");
    const currentTabData = getTabData();
    console.log("app.js: Calling renderTab with data:", JSON.stringify(currentTabData)); // Log the data being passed
    rendering.renderTab(currentTabData);
    console.log("app.js: renderTab finished.");
    setupUI();
    console.log("app.js: setupUI finished.");
    // Initialize Audio after UI setup (or ensure context is resumed on interaction)
    await initializeAudio();
    console.log("app.js: initializeAudio finished.");
    // Config variables and log are now inside setupUI.
  } catch (error) {
    // This catch block now handles errors from initializeTabData, renderTab, setupUI, AND initializeAudio
    console.error("app.js: Error during app setup:", error);
    console.trace(); // Add stack trace
    alert("Failed to initialize the application. Please check the console for details.");
  }
  console.log("app.js: Finished setupApp");
}

// --- Start the App ---
setupApp(); // Call the setup function to run the application
