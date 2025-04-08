// src/app.js
// Main app logic - setting things up and making it go!

// Main app logic - setting things up and making it go!

import * as rendering from './rendering.js';
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab, getNote } from './tab-data.js'; // Added getNote
import { setupToolBar, handleFretInput, showNumberCircle, removeOpenNumberCircle, showSecondNumberCircle, removeActiveFretClass } from './ui-elements.js'; // Added more UI imports
import { initializeAudio, playTab, stopPlayback, exportMIDI } from './audio.js'; // Adjusted audio imports for individual exports
import config from '../config.js';

console.log("app.js: Starting app.js");


let isMeasureRotated = false; // State variable to track measure rotation
let isPlaying = false; // Playback state
let currentMeasureIndex = -1; // Track current measure during playback
let playbackIntervalId = null; // Interval ID for playback timing


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
    // Add Time Signature info
    tabString += `Time Signature: ${tabData.timeSignature || '4/4'}\n`;


    return tabString;
}

function toggleMeasureRotation() {
    console.log("app.js: toggleMeasureRotation - before toggle:", isMeasureRotated); // ADDED LOG
    isMeasureRotated = !isMeasureRotated; // Toggle the rotation state
    const tabData = getTabData();
    tabData.isMeasureRotated = isMeasureRotated; // Store rotation state in tabData
    setTabData(tabData); // Update tabData
    console.log("toggleMeasureRotation - after toggle:", isMeasureRotated); // ADDED LOG
    console.log("toggleMeasureRotation - tabData.isMeasureRotated:", tabData.isMeasureRotated); // ADDED LOG
    console.log(`app.js: Measure rotation toggled to: ${isMeasureRotated}`);
}

// --- Playback Controls ---
function handlePlay() {
    if (!isPlaying) {
        console.log("app.js: Playback started");
        playTab(); // Call audio.js playTab function
        isPlaying = true;
        // Update UI to reflect playing state
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'none'; // Hide Play button
            pauseButton.style.display = 'inline-block'; // Show Pause button
            stopButton.style.display = 'inline-block'; // Show Stop button
            playButton.textContent = 'Resume'; // Change Play to Resume
        }
        startPlaybackHighlight(); // Start visual highlighting
    } else {
        handlePause(); // If already playing, treat "Play" as "Resume" (or could be separate "Resume" button)
    }
}

function handlePause() {
    if (isPlaying) {
        console.log("app.js: Playback paused");
        stopPlayback(); // For now, using stopPlayback to pause as well (can be refined)
        isPlaying = false;
        // Update UI to reflect paused state (can be different from stopped if needed)
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'inline-block'; // Show Play button (now acts as Resume)
            pauseButton.style.display = 'none'; // Hide Pause button
            stopButton.style.display = 'inline-block'; // Keep Stop button visible
            playButton.textContent = 'Resume'; // Keep text as Resume
        }
        stopPlaybackHighlight(); // Stop visual highlighting
    }
}


function handleStop() {
    if (isPlaying) { // Or if paused, depending on desired stop behavior
        console.log("app.js: Playback stopped");
        stopPlayback(); // Call audio.js stopPlayback
        isPlaying = false;
        currentMeasureIndex = -1; // Reset measure index
        // Update UI to reflect stopped state
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'inline-block'; // Show Play button
            pauseButton.style.display = 'none'; // Hide Pause button
            stopButton.style.display = 'none'; // Hide Stop button
            playButton.textContent = 'Play'; // Change back to Play
        }
        stopPlaybackHighlight(); // Stop visual highlighting and clear any highlights
        resetMeasureHighlight(); // Ensure all measure highlights are cleared
    }
}

function handleTimeSignatureChange(event) {
    const newTimeSignature = event.target.value;
    console.log(`app.js: Time signature changed to: ${newTimeSignature}`);
    const tabData = getTabData();
    tabData.timeSignature = newTimeSignature; // Update time signature in tab data
    setTabData(tabData);
    rendering.renderTab(getTabData()); // Re-render the tab to reflect changes (if needed visually)
    // TODO: Implement logic to change measure structure or playback behavior based on time signature
}

// --- Playback Highlighting ---
function startPlaybackHighlight() {
    if (!isPlaying) {
        isPlaying = true;
        currentMeasureIndex = 0; // Start from the first measure
        const tabData = getTabData();
        const bpm = tabData.bpm || 120;
        const measures = tabData.measures;

        if (!measures || measures.length === 0) {
            console.warn("No measures to play.");
            isPlaying = false;
            return;
        }

        const millisecondsPerBeat = 60000 / bpm;
        // Assuming 4 beats per measure for now - adjust based on time signature later if needed
        const millisecondsPerMeasure = millisecondsPerBeat * 4; // Default to 4 beats/measure

        playbackIntervalId = setInterval(() => {
            if (currentMeasureIndex < measures.length) {
                highlightMeasure(currentMeasureIndex);
                currentMeasureIndex++;
            } else {
                stopPlaybackHighlight(); // Stop interval when all measures played
                handleStop(); // Automatically stop playback
            }
        }, millisecondsPerMeasure);
    }
}

function stopPlaybackHighlight() {
    isPlaying = false;
    if (playbackIntervalId) {
        clearInterval(playbackIntervalId);
        playbackIntervalId = null;
    }
    resetMeasureHighlight(); // Clear all highlights when playback stops
}

function highlightMeasure(measureIndex) {
    resetMeasureHighlight(); // Clear any previous highlights
    const measureDiv = document.querySelector(`.measure:nth-child(${measureIndex + 1})`);
    if (measureDiv) {
        measureDiv.classList.add('playing-measure');
    }
}

function resetMeasureHighlight() {
    document.querySelectorAll('.measure.playing-measure').forEach(measure => {
        measure.classList.remove('playing-measure');
    });
}


// --- UI Setup ---
/**
 * Sets up UI elements and event listeners.
 */
function setupUI() {
    console.log("app.js: setupUI called");

    // Apply config (example - could be more extensive)
    document.body.style.fontSize = config.bodyFontSize;

    // Get time signature select element
    const timeSignatureSelect = document.getElementById('timeSignatureSelect');
    if (timeSignatureSelect) {
        timeSignatureSelect.addEventListener('change', handleTimeSignatureChange);
    } else {
        console.error("app.js: timeSignatureSelect element not found.");
    }

    // Get BPM input element
    const bpmInputElement = document.getElementById('bpmInput');
    if (bpmInputElement) {
        bpmInputElement.addEventListener('change', (event) => {
            const newBPM = parseInt(event.target.value, 10);
            if (!isNaN(newBPM) && newBPM > 0) {
                const tabData = getTabData();
                tabData.bpm = newBPM;
                setTabData(tabData);
                console.log(`BPM set to ${tabData.bpm}`);
            } else {
                alert("Invalid BPM value. Please enter a number greater than 0.");
                bpmInputElement.value = getTabData().bpm || 120; // Revert to previous value
            }
        });
    } else {
        console.error("app.js: bpmInput element not found.");
    }


    // Pass dependencies to setupToolBar
    setupToolBar({
        addMeasure: handleAddMeasureWithInput, // Changed to use handleAddMeasureWithInput
        clearTab,
        exportTab, // Now defined in app.js
        playTab: handlePlay, // Use handlePlay function
        pauseTab: handlePause, // Use handlePause function
        stopPlayback: handleStop, // Use handleStop function (renamed for clarity in toolbar context)
        saveTab, // Now defined in app.js
        loadTab, // Now defined in app.js
        exportMIDI, // Imported from audio.js
        renderTab: rendering.renderTab, // Pass the rendering function
        getTabData,
        setTabData,
        toggleMeasureRotation, // Pass the toggleMeasureRotation function
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

function handleAddMeasureWithInput() {
    console.log("app.js: handleAddMeasureWithInput called");
    const tabData = getTabData();
    const timeSignature = prompt("Enter time signature for the new measure (e.g., 4/4, 6/8):", "4/4"); // Prompt for time signature
    if (!timeSignature) {
        return; // User cancelled
    }

    const [beats, noteValue] = timeSignature.split('/').map(Number);

    if (isNaN(beats) || isNaN(noteValue) || beats <= 0 || noteValue <= 0) {
        alert("Invalid time signature. Please use the format 'X/Y' where X and Y are positive numbers.");
        return;
    }

    // Create a new measure with the specified time signature
    const newMeasure = {
        strings: Array(6).fill(Array(beats).fill('-')) // Initialize with '-' for each fret based on beats
    };
    tabData.measures.push(newMeasure);

    setTabData(tabData);
    rendering.renderTab(getTabData());
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
