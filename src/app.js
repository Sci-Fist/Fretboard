import { initializeTabData, getTabData, setTabData, addMeasure, clearTab, getNote } from './tab-data.js';
import { handleFretInput, removeActiveFretClass, toggleMeasureRotation } from './ui-elements.js';
import { initializeAudio, playTab, stopPlayback } from './audio.js';
import config from '../config.js';
import { renderTab } from './rendering.js'; // Import renderTab

console.log("app.js: Starting Fretboard app.js");

// Application State
let isMeasureRotated = false;
let isPlaying = false;
let currentMeasureIndex = -1;
let playbackIntervalId = null;

// --- Helper Functions ---

/**
 * Exports the tab data as a text file.
 */
function exportTab() {
    console.log("app.js: exportTab called (placeholder)");
    const tabData = getTabData();
    const tabText = generateTablature(tabData);
    const blob = new Blob([tabText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guitar_tab.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Tab exported as text!");
}

/**
 * Saves the tab data to local storage.
 */
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

/**
 * Loads tab data from a JSON file.
 */
function loadTab() {
    console.log("app.js: loadTab called");
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // Accept only JSON files
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const tabData = JSON.parse(e.target.result);
                    setTabData(tabData);
                    renderTab(getTabData());
                    alert('Tab loaded from file!');
                } catch (error) {
                    console.error('Error loading tab from file:', error);
                    alert('Error loading tab from file. Check the console for more details.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click(); // Trigger the file selection dialog
}
/**
 * Handles adding a measure with user input for time signature and measure name.
 * @param {string} timeSignature - The time signature to use for the new measure.
 * @param {string} measureName - The name of the measure.
 */
function handleAddMeasureWithInput(timeSignature, measureName) {
    console.log("app.js: handleAddMeasureWithInput called with timeSignature:", timeSignature, "and measureName:", measureName);
    const tabData = getTabData();

    // Validate time signature format
    const timeSignatureRegex = /^\d+\/\d+$/;
    if (!timeSignatureRegex.test(timeSignature)) {
        alert("Invalid time signature format. Please use the format 'X/Y'.");
        return;
    }

    const [beats, noteValue] = timeSignature.split('/').map(Number);

    if (isNaN(beats) || isNaN(noteValue) || beats <= 0 || noteValue <= 0) {
        alert("Invalid time signature. Please enter positive numbers for beats and note value.");
        return;
    }

    // Create a new measure with the specified time signature and name
    const newMeasureOptions = {
        timeSignature: timeSignature,
        name: measureName
    };
    addMeasure(newMeasureOptions);

    setTabData(tabData);
    renderTab(getTabData());
}

/**
 * Generates tablature text from the tab data.
 * @param {object} tabData - The tab data object.
 * @returns {string} The tablature text.
 */
function generateTablature(tabData) {
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        return "No tab data.";
    }

    let tabString = "";
    const tuning = tabData.tuning || ['E', 'A', 'D', 'G', 'B', 'E'];
    const stringLabels = ["E", "A", "D", "G", "B", "e"];

    tabData.measures.forEach((measure, measureIndex) => {
        tabString += `Measure ${measureIndex + 1} (${measure.name}, ${measure.timeSignature}):\n`; // Include measure name and time signature
        const strings = measure.strings && measure.strings.length === 6 ? measure.strings : Array(6).fill(['-', '-', '-', '-']);

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            tabString += `${stringLabels[stringIndex]}|`;
            const frets = strings[stringIndex] && strings[stringIndex].length === 4 ? strings[stringIndex] : ['-', '-', '-', '-'];
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                const fretValue = (frets[fretIndex] !== undefined && frets[fretIndex] !== '') ? String(frets[fretIndex]) : "-";
                tabString += fretValue.padEnd(2, ' ');
                tabString += "|";
            }
            tabString += "\n";
        }
        tabString += "\n";
    });

    tabString += `BPM: ${tabData.bpm || 120}\n`;
    // Time Signature is now per measure, so removing from here.

    return tabString;
}

// --- Playback Controls ---
/**
 * Handles the play action.
 */
function handlePlay() {
    if (!isPlaying) {
        console.log("app.js: Playback started");
        playTab();
        isPlaying = true;
        // Update button visibility
        updatePlayPauseStopButtons();
        startPlaybackHighlight();
    } else {
        handlePause();
    }
}

/**
 * Handles the pause action.
 */
function handlePause() {
    if (isPlaying) {
        console.log("app.js: Playback paused");
        stopPlayback();
        isPlaying = false;
        // Update button visibility
        updatePlayPauseStopButtons();
        stopPlaybackHighlight();
    }
}

/**
 * Handles the stop action.
 */
function handleStop() {
    if (isPlaying) {
        console.log("app.js: Playback stopped");
        stopPlayback();
        isPlaying = false;
        currentMeasureIndex = -1;
        // Update button visibility
        updatePlayPauseStopButtons();
        stopPlaybackHighlight();
        resetMeasureHighlight();
    }
}

/**
 * Updates the visibility of the play, pause, and stop buttons.
 */
function updatePlayPauseStopButtons() {
    const playButton = document.getElementById('playTabBtn');
    const pauseButton = document.getElementById('pauseTabBtn');
    const stopButton = document.getElementById('stopTabBtn');

    if (playButton && pauseButton && stopButton) {
        playButton.style.display = isPlaying ? 'none' : 'inline-block';
        pauseButton.style.display = isPlaying ? 'inline-block' : 'none';
        stopButton.style.display = isPlaying ? 'inline-block' : 'none';
        playButton.textContent = isPlaying ? 'Resume' : 'Play';
    }
}

/**
 * Handles the time signature change for the *entire tab* (currently unused as time signature is per measure).
 * @param {Event} event - The change event.
 */
function handleTimeSignatureChange(event) {
    const newTimeSignature = event.target.value;
    console.log(`app.js: Global time signature changed to: ${newTimeSignature}`);
    const tabData = getTabData();
    tabData.timeSignature = newTimeSignature;

    // Update the number of frets in *all* measures to match the new global time signature - this might not be desired anymore.
    tabData.measures.forEach(measure => {
        const [beats] = newTimeSignature.split('/').map(Number);
        for (let stringIndex = 0; stringIndex < measure.strings.length; stringIndex++) {
            measure.strings[stringIndex] = Array(beats).fill('-');
        }
    });

    setTabData(tabData);
    renderTab(getTabData());
    // TODO: Implement logic to change playback behavior based on time signature
}


// --- Playback Highlighting ---
/**
 * Starts the playback highlighting.
 */
function startPlaybackHighlight() {
    if (!isPlaying) {
        isPlaying = true;
        currentMeasureIndex = 0;
        const tabData = getTabData();
        const bpm = tabData.bpm || 120;
        const measures = tabData.measures;

        if (!measures || measures.length === 0) {
            console.warn("No measures to play.");
            isPlaying = false;
            return;
        }

        const millisecondsPerBeat = 60000 / bpm;
        const millisecondsPerMeasure = millisecondsPerBeat * 4; // Default to 4 beats/measure - TODO: Use measure's time signature for duration

        playbackIntervalId = setInterval(() => {
            if (currentMeasureIndex < measures.length) {
                highlightMeasure(currentMeasureIndex);
                currentMeasureIndex++;
            } else {
                stopPlaybackHighlight();
                handleStop();
            }
        }, millisecondsPerMeasure); // TODO: Adjust interval based on measure time signature
    }
}

/**
 * Stops the playback highlighting.
 */
function stopPlaybackHighlight() {
    isPlaying = false;
    if (playbackIntervalId) {
        clearInterval(playbackIntervalId);
        playbackIntervalId = null;
    }
    resetMeasureHighlight();
}

/**
 * Highlights a specific measure.
 * @param {number} measureIndex - The index of the measure to highlight.
 */
function highlightMeasure(measureIndex) {
    resetMeasureHighlight();
    const measureDiv = document.querySelector(`.measure:nth-child(${measureIndex + 1})`);
    if (measureDiv) {
        measureDiv.classList.add('playing-measure');
    }
}

/**
 * Resets the measure highlighting.
 */
function resetMeasureHighlight() {
    document.querySelectorAll('.measure.playing-measure').forEach(measure => {
        measure.classList.remove('playing-measure');
    });
}

// --- UI Setup ---
/**
 * Sets up UI elements and event listeners.
 */
async function setupUI() {
    console.log("app.js: setupUI called"); // DEBUG LOG

    // Apply config (example - could be more extensive)
    document.body.style.fontSize = config.bodyFontSize;

    // Get time signature select element - this is now for global time signature, might be removed later.
    const timeSignatureSelect = document.getElementById('timeSignatureSelect');
    if (timeSignatureSelect) {
        timeSignatureSelect.addEventListener('change', handleTimeSignatureChange);
    } else {
        console.warn("app.js: timeSignatureSelect element not found. This is expected if time signature is now per-measure.");
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
            }
        });
    } else {
        console.error("app.js: bpmInput element not found.");
    }


    // --- Add Measure Modal Setup ---
    const addMeasureModal = document.createElement('div');
    addMeasureModal.id = 'addMeasureModal';
    addMeasureModal.style.display = 'none'; // Initially hidden
    addMeasureModal.style.position = 'fixed';
    addMeasureModal.style.zIndex = '1000'; // Ensure it's on top
    addMeasureModal.style.left = '50%';
    addMeasureModal.style.top = '50%';
    addMeasureModal.style.transform = 'translate(-50%, -50%)';
    addMeasureModal.style.backgroundColor = '#fff';
    addMeasureModal.style.padding = '20px';
    addMeasureModal.style.border = '1px solid #ccc';
    addMeasureModal.style.borderRadius = '5px';
    addMeasureModal.innerHTML = `
        <h2>Add Measure</h2>
        <label for="measureName">Measure Name:</label>
        <input type="text" id="measureName" value="" placeholder="Measure Name">
        <br><br>
        <label for="timeSignature">Time Signature:</label>
        <select id="timeSignature">
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
            <option value="2/4">2/4</option>
        </select>
        <br><br>
        <button id="addMeasureModalSubmit">Add Measure</button>
        <button id="addMeasureModalCancel">Cancel</button>
    `;
    document.body.appendChild(addMeasureModal);

    // Modal event listeners
    const addMeasureModalSubmit = document.getElementById('addMeasureModalSubmit');
    const addMeasureModalCancel = document.getElementById('addMeasureModalCancel');
    const timeSignatureSelectModal = document.getElementById('timeSignature');
    const measureNameInputModal = document.getElementById('measureName'); // New input for measure name


    if (addMeasureModalSubmit) {
        addMeasureModalSubmit.addEventListener('click', () => {
            const selectedTimeSignature = timeSignatureSelectModal.value;
            const measureName = measureNameInputModal.value; // Get measure name from input
            handleAddMeasureWithInput(selectedTimeSignature, measureName); // Pass measure name to handler
            closeAddMeasureModal();
        });
    } else {
        console.error("app.js: addMeasureModalSubmit element not found.");
    }

    if (addMeasureModalCancel) {
        addMeasureModalCancel.addEventListener('click', closeAddMeasureModal);
    } else {
        console.error("app.js: addMeasureModalCancel element not found.");
    }

    function openAddMeasureModal() {
        addMeasureModal.style.display = 'block';
        measureNameInputModal.value = ''; // Clear measure name input when opening modal
        measureNameInputModal.focus(); // ADD THIS LINE to focus on measure name input
    }

    function closeAddMeasureModal() {
        addMeasureModal.style.display = 'none';
    }

    // --- End Add
    // --- Context Menu Setup ---
    const tabDisplay = document.getElementById("tab-display");
    if (tabDisplay) {
        tabDisplay.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent the default context menu

            if (e.target.classList.contains('fret')) {
                showFretContextMenu(e);
            }
        });
    }
    // --- End Context Menu Setup ---

    console.log("app.js: UI setup complete.");

    // Call setupToolBar *after* the tab display is rendered and the buttons are in the DOM
    // setupToolBar({  // Removed setupToolBar call
    //     addMeasure: openAddMeasureModal, // Changed to openAddMeasureModal
    //     clearTab: clearTab,
    //     exportTab: exportTab,
    //     playTab: handlePlay,
    //     pauseTab: handlePause,
    //     stopPlayback: handleStop,
    //     saveTab: saveTab,
    //     loadTab: loadTab,
    //     renderTab: rendering.renderTab,
    //     getTabData: getTabData,
    //     setTabData: setTabData,
    //     toggleMeasureRotation: toggleMeasureRotation,
    //     handleFretInput: handleFretInput, // Add handleFretInput to the setupToolBar options
    // });
}

/**
 * Shows the context menu for a fret element.
 * @param {Event} e - The contextmenu event.
 */
function showFretContextMenu(e) {
    console.log("app.js: showFretContextMenu called");
    // Create the context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.backgroundColor = '#333';
    contextMenu.style.color = '#fff';
    contextMenu.style.padding = '5px';
    contextMenu.style.borderRadius = '5px';
    contextMenu.style.zIndex = '1000'; // Ensure it's on top

    // Get the fret element
    const fretElement = e.target;

    // Add menu items
    const menuItems = [
        { text: 'Clear Fret', action: () => { fretElement.textContent = ''; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
        { text: 'Set to 0', action: () => { fretElement.textContent = '0'; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
        { text: 'Set to 1', action: () => { fretElement.textContent = '1'; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
        // Add more menu items as needed
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.padding = '5px';
        menuItem.style.cursor = 'pointer';
        menuItem.addEventListener('mouseover', () => { menuItem.style.backgroundColor = '#555'; });
        menuItem.addEventListener('mouseout', () => { menuItem.style.backgroundColor = '#333'; });
        menuItem.addEventListener('click', item.action);
        contextMenu.appendChild(menuItem);
    });

    // Position the context menu
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;

    // Append the context menu to the body
    document.body.appendChild(contextMenu);

    // Remove the context menu when clicking outside, *except* when clicking on a fret
    document.addEventListener('click', function removeContextMenu(event) {
        if (!contextMenu.contains(event.target) && !event.target.classList.contains('fret')) {
            contextMenu.remove();
            document.removeEventListener('click', removeContextMenu); // Remove the listener after use
        }
    });
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
                nextFret = document.getElementById(`fret-${measureIndex - 1}-${stringIndex}-3`);
            }
            break;
        case 'ArrowRight':
            if (fretIndex < 3) {
                nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex + 1}`);
            } else {
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
        currentFret.classList.remove('active-fret');
        nextFret.classList.add('active-fret');
        nextFret.focus();
        localStorage.setItem('activeFretId', nextFret.id);
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
        renderTab(currentTabData);
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
setupApp();
