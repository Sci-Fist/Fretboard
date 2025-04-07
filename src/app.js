// app.js
// Main application logic - event listeners, initialization

import { addMeasure, clearTab, getTabData, setTabData } from './tab-data.js';
import { renderTab } from './rendering.js';
import { handleFretInput, showNumberCircle, showSecondNumberCircle } from './ui-elements.js';
import { exportMIDI } from './audio.js'; // Import the exportMIDI function
import { playTab, stopPlayback } from './audio.js'; // Import the playTab and stopPlayback functions

console.log('app.js: Starting app.js'); // Log when app.js starts

document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js: DOMContentLoaded event fired');
    // No Tone.js check needed anymore
    setupUI();
    addMeasure(); // Call addMeasure to initialize the tab
    renderTab(getTabData()); // Call renderTab after addMeasure to render the initial tab
    console.log('app.js: Finished DOMContentLoaded');
});

/**
 * Sets up the user interface by attaching event listeners to the tool bar buttons.
 */
function setupUI() {
    console.log('app.js: setupUI called');
    // Get references to the tool bar buttons
    const addMeasureButton = document.querySelector('.tool-bar button:nth-child(1)');
    const clearTabButton = document.querySelector('.tool-bar button:nth-child(2)');
    const exportTabButton = document.querySelector('.tool-bar button:nth-child(3)');
    const showBPMInputButton = document.querySelector('.tool-bar button:nth-child(4)');
    const playTabButton = document.querySelector('.tool-bar button:nth-child(5)');
    const stopTabButton = document.createElement('button');
    stopTabButton.textContent = 'Stop';
    stopTabButton.onclick = stopPlayback;
    stopTabButton.style.display = 'none'; // Initially hidden
    const saveTabButton = document.querySelector('.tool-bar button:nth-child(7)');
    const loadTabButton = document.querySelector('.tool-bar button:nth-child(8)');
    const exportMIDButton = document.querySelector('.tool-bar button:nth-child(9)');

    const toolBar = document.querySelector('.tool-bar');
    toolBar.insertBefore(stopTabButton, playTabButton.nextSibling);

    // Attach event listeners to the tool bar buttons
    console.log('app.js: Attaching event listeners to tool bar buttons');
    addMeasureButton.addEventListener('click', () => {
        console.log('app.js: Add Measure button clicked');
        addMeasure();
        renderTab(getTabData());
    });
    clearTabButton.addEventListener('click', () => {
        console.log('app.js: Clear Tab button clicked');
        clearTab();
        renderTab(getTabData());
    });
    exportTabButton.addEventListener('click', () => {
        console.log('app.js: Export Tab button clicked');
        exportTab();
    });
    showBPMInputButton.addEventListener('click', () => {
        console.log('app.js: Set BPM button clicked');
        showBPMInput();
    });
    playTabButton.addEventListener('click', () => {
        console.log('app.js: Play Tab button clicked');
        playTab(getTabData());
    });
    stopTabButton.addEventListener('click', stopPlayback);
    saveTabButton.addEventListener('click', saveTab);
    loadTabButton.addEventListener('click', loadTab);
    exportMIDButton.addEventListener('click', exportMIDI);

    // Attach event listeners to fret divs after they are rendered
    console.log('app.js: Attaching event listeners to fret divs');
    document.getElementById('tab-display').addEventListener('input', (event) => {
        if (event.target.classList.contains('fret')) {
            console.log('app.js: Fret input event fired');
            handleFretInput(event);
        }
    });

    document.getElementById('tab-display').addEventListener('click', (event) => {
        if (event.target.classList.contains('fret')) {
            console.log('app.js: Fret click event fired');
            showNumberCircle(event.target);
        }
    });
    console.log('app.js: Finished setupUI');
}

function exportTab() {
    console.log('exportTab called');
    const tabData = getTabData();
    let tabString = '';

    if (!tabData.measures || tabData.measures.length === 0) {
        alert('No tab data to export.');
        return;
    }

    const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];

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

    // Create a download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tabString));
    element.setAttribute('download', 'guitar_tab.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function showBPMInput() {
    console.log('showBPMInput called'); // Log when showBPMInput is called
    // Create the input element
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'bpmInput';
    input.value = getTabData().bpm; // Set the current BPM as the default value
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
            const tabData = getTabData();
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
    console.log('saveTab called'); // Log when saveTab is called
    localStorage.setItem('tabData', JSON.stringify(getTabData()));
}

function loadTab() {
    console.log('loadTab called'); // Log when loadTab is called
    const savedTabData = localStorage.getItem('tabData');
    if (savedTabData) {
        setTabData(JSON.parse(savedTabData));
        renderTab(getTabData());
    }
}
