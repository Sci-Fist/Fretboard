// app.js
// Main application logic - event listeners, initialization

import { addMeasure, clearTab, getTabData, setTabData, getNote, initializeTabData } from './tab-data.js';
import { renderTab } from './rendering.js';
import { handleFretInput, showNumberCircle, showSecondNumberCircle, setupToolBar } from './ui-elements.js';
import { exportMIDI } from './audio.js'; // Import the exportMIDI function
import { playTab, stopPlayback } from './audio.js';
import config from '../config.js'; // Import the config file

console.log('app.js: Starting app.js');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('app.js: DOMContentLoaded event fired');
    await setupUI();
    console.log('app.js: Finished DOMContentLoaded');
});

/**
 * Sets up the user interface by attaching event listeners to the tool bar buttons.
 */
async function setupUI() {
    console.log('app.js: setupUI called');
    try {
        await Tone.start();
        setupToolBar();
        // No need to call attachFretEventListeners here, it's handled in setupToolBar
    } catch (error) {
        console.error('app.js: Error during UI setup:', error);
        alert('Failed to initialize the application. Please check your browser settings.');
    }
    console.log('app.js: Finished setupUI');
    initializeTabData();
    renderTab(getTabData()); // Initial render after setup
}

function exportTab() {
    console.log('exportTab called');
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
    } catch (error) {
        console.error('app.js: Error during tab export:', error);
        alert('Failed to export the tab. Please try again.');
    }
}

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

function showBPMInput() {
    console.log('showBPMInput called');
    const tabData = getTabData();

    // Create the input element
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'bpmInput';
    input.value = tabData.bpm; // Set the current BPM as the default value
    input.min = 40; // Set a minimum BPM value
    input.max = 240; // Set a maximum BPM value
    input.style.width = '50px'; // Adjust width as needed
    input.style.marginRight = '10px'; // Add some spacing

    // Create the button to set the BPM
    const setBPMButton = document.createElement('button');
    setBPMButton.textContent = 'Set BPM';
    setBPMButton.onclick = () => {
        const newBPM = parseInt(input.value);
        if (!isNaN(newBPM) && newBPM >= 40 && newBPM <= 240) {
            tabData.bpm = newBPM;
            setTabData(tabData);
            // Optionally, provide feedback to the user, e.g., by updating a display element
            console.log('BPM set to:', getTabData().bpm);
            // Remove the input and button after setting the BPM
            bpmInputContainer.remove();
        } else {
            alert('Please enter a valid BPM between 40 and 240.');
        }
    };

    // Create a container for the input and button
    const bpmInputContainer = document.createElement('div');
    bpmInputContainer.id = 'bpmInputContainer';
    bpmInputContainer.style.marginTop = '10px'; // Add some spacing
    bpmInputContainer.appendChild(input);
    bpmInputContainer.appendChild(setBPMButton);

    // Append the container to the tool-bar
    const toolBar = document.querySelector('.tool-bar');
    toolBar.appendChild(bpmInputContainer);
}

function saveTab() {
    console.log('saveTab called');
    try {
        localStorage.setItem('tabData', JSON.stringify(getTabData()));
    } catch (error) {
        console.error('app.js: Error saving tab:', error);
        alert('Failed to save the tab. Please check your browser settings.');
    }
}

function loadTab() {
    console.log('loadTab called');
    try {
        const savedTabData = localStorage.getItem('tabData');
        if (savedTabData) {
            setTabData(JSON.parse(savedTabData));
            renderTab(getTabData());
        }
    } catch (error) {
        console.error('app.js: Error loading tab:', error);
        alert('Failed to load the tab. Please check your browser settings.');
    }
}
