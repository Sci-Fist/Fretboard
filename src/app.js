// src/app.js
// Main application logic - event listeners, initialization

import * as rendering from './rendering.js';
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab } from './tab-data.js';
import { setupToolBar, handleFretInput, showNumberCircle } from './ui-elements.js';
import { playTab, stopPlayback, exportMIDI } from './audio.js'; // Import audio functions

console.log('app.js: Starting app.js');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('app.js: DOMContentLoaded event fired');
    await setupApp();
    console.log('app.js: Finished DOMContentLoaded');
});

/**
 * Sets up the entire application.
 */
async function setupApp() {
    console.log('app.js: setupApp called');
    try {
        await Tone.start(); // Initialize Tone.js
        console.log('app.js: Tone.js initialized'); // Add a log to confirm
        initializeTabData(); // Initialize tab data
        rendering.renderTab(getTabData()); // Initial rendering of the tab
        setupUI(); // Setup UI elements and event listeners
        console.log('app.js: UI setup complete');
    } catch (error) {
        console.error('app.js: Error during app setup:', error);
        alert('Failed to initialize the application. Please check the console for details.');
    }
    console.log('app.js: Finished setupApp');
}


/**
 * Sets up the user interface and attaches event listeners.
 */
function setupUI() {
    console.log('app.js: setupUI called');
    setupToolBar({ // Pass dependencies to setupToolBar
        addMeasure: addMeasure,
        clearTab: clearTab,
        exportTab: exportTab,
        showBPMInput: showBPMInput,
        playTab: playTab,
        stopPlayback: stopPlayback,
        saveTab: saveTab,
        loadTab: loadTab,
        exportMIDI: exportMIDI,
        renderTab: rendering.renderTab,
        getTabData: getTabData,
        setTabData: setTabData
    });
    attachFretEventListeners(); // Attach listeners to frets
    console.log('app.js: setupUI complete');
}


/**
 * Attaches event listeners to the fret elements in the tab display.
 */
function attachFretEventListeners() {
    const tabDisplay = document.getElementById('tab-display');
    if (!tabDisplay) {
        console.error('app.js: tab-display element not found!');
        return;
    }

    tabDisplay.addEventListener('input', (event) => {
        if (event.target.classList.contains('fret')) {
            handleFretInput(event, getTabData, setTabData, rendering.renderTab); // Pass necessary functions
        }
    });

    tabDisplay.addEventListener('click', (event) => {
        if (event.target.classList.contains('fret')) {
            showNumberCircle(event.target);
        }
    });
    console.log('app.js: Fret event listeners attached');
}


/**
 * Exports the tab data as a text file.
 */
function exportTab() {
    console.log('app.js: exportTab called');
    const tabData = getTabData();

    if (!tabData.measures || tabData.measures.length === 0) {
        alert('No tab data to export.');
        return;
    }

    try {
        const tabString = generateTabString(tabData);
        // Create a download link
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tabString));
        element.setAttribute('download', 'guitar_tab.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        console.log('app.js: Tab exported successfully');
    } catch (error) {
        console.error('app.js: Error during tab export:', error);
        alert('Failed to export the tab. Please try again.');
    }
}

/**
 * Generates a string representation of the tab data.
 * @param {object} tabData - The tab data object.
 * @returns {string} The tab string.
 */
function generateTabString(tabData) {
    const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];
    let tabString = '';

    tabData.measures.forEach(measure => {
        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            tabString += stringLabels[stringIndex] + '|';
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                tabString += measure.strings[stringIndex][fretIndex] || '-';
            }
            tabString += '|\n';
        }
        tabString += '\n'; // Add a blank line between measures
    });

    return tabString;
}

/**
 * Shows the BPM input field and button.
 */
function showBPMInput() {
    console.log('app.js: showBPMInput called');
    const tabData = getTabData();

    // Create the input element
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'bpmInput';
    input.value = tabData.bpm; // Set the current BPM as the default value
    input.min = 40;
    input.max = 240;
    input.style.width = '50px';
    input.style.marginRight = '10px';

    // Create the button to set the BPM
    const setBPMButton = document.createElement('button');
    setBPMButton.textContent = 'Set BPM';
    setBPMButton.onclick = () => {
        const newBPM = parseInt(input.value);
        if (!isNaN(newBPM) && newBPM >= 40 && newBPM <= 240) {
            setTabData({ ...getTabData(), bpm: newBPM }); // Update BPM using setTabData
            console.log('app.js: BPM set to:', getTabData().bpm);
            // Remove the input and button after setting the BPM
            bpmInputContainer.remove();
        } else {
            alert('Please enter a valid BPM between 40 and 240.');
        }
    };

    // Create a container for the input and button
    const bpmInputContainer = document.createElement('div');
    bpmInputContainer.id = 'bpmInputContainer';
    bpmInputContainer.style.marginTop = '10px';
    bpmInputContainer.appendChild(input);
    bpmInputContainer.appendChild(setBPMButton);

    // Append the container to the tool-bar
    const toolBar = document.querySelector('.tool-bar');
    toolBar.appendChild(bpmInputContainer);
}

/**
 * Saves the tab data to local storage.
 */
function saveTab() {
    console.log('app.js: saveTab called');
    try {
        localStorage.setItem('tabData', JSON.stringify(getTabData()));
        alert('Tab saved to local storage.');
        console.log('app.js: Tab saved to local storage');
    } catch (error) {
        console.error('app.js: Error saving tab to local storage:', error);
        alert('Failed to save the tab. Please check your browser settings.');
    }
}

/**
 * Loads the tab data from local storage.
 */
function loadTab() {
    console.log('app.js: loadTab called');
    try {
        const savedTabData = localStorage.getItem('tabData');
        if (savedTabData) {
            setTabData(JSON.parse(savedTabData));
            rendering.renderTab(getTabData());
            alert('Tab loaded from local storage.');
            console.log('app.js: Tab loaded from local storage');
        } else {
            alert('No saved tab data found in local storage.');
            console.log('app.js: No saved tab data found');
        }
    } catch (error) {
        console.error('app.js: Error loading tab from local storage:', error);
        alert('Failed to load the tab. Please check your browser settings.');
    }
}
