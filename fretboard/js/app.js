// app.js
// Main application logic - event listeners, initialization

import { addMeasure, clearTab, getTabData, setTabData } from './tab-data.js';
import { renderTab } from './rendering.js';
import { handleFretInput, showNumberCircle, showSecondNumberCircle } from './ui-elements.js';
import { exportMIDI } from './audio.js'; // Import the exportMIDI function
//import { playTab, stopPlayback } from './audio.js'; // Import the playTab and stopPlayback functions

document.addEventListener('DOMContentLoaded', () => {
    console.log('Fretboard on fire');
    // Check if Tone is defined
    if (typeof Tone !== 'undefined') {
        console.log('Tone.js loaded successfully');
    } else {
        console.error('Tone.js failed to load');
        alert('Failed to load Tone.js. Playback will not be available.');
    }
    setupUI();
    addMeasure(); // Call addMeasure to initialize the tab
    renderTab(getTabData()); // Call renderTab after addMeasure to render the initial tab
});

function setupUI() {
    // Get references to the tool bar buttons
    const addMeasureButton = document.querySelector('.tool-bar button:nth-child(1)');
    const clearTabButton = document.querySelector('.tool-bar button:nth-child(2)');
    const exportTabButton = document.querySelector('.tool-bar button:nth-child(3)');
    const showBPMInputButton = document.querySelector('.tool-bar button:nth-child(4)');
    const playTabButton = document.querySelector('.tool-bar button:nth-child(5)');
    const stopTabButton = document.createElement('button');
    stopTabButton.textContent = 'Stop';
    //stopTabButton.onclick = stopPlayback; // Removed, as stopPlayback is not yet implemented
    stopTabButton.style.display = 'none'; // Initially hidden
    const saveTabButton = document.querySelector('.tool-bar button:nth-child(7)');
    const loadTabButton = document.querySelector('.tool-bar button:nth-child(8)');
    const exportMIDButton = document.querySelector('.tool-bar button:nth-child(9)');

    const toolBar = document.querySelector('.tool-bar');
    toolBar.insertBefore(stopTabButton, playTabButton.nextSibling);

    // Attach event listeners to the tool bar buttons
    addMeasureButton.addEventListener('click', () => {
        addMeasure();
        renderTab(getTabData());
    });
    clearTabButton.addEventListener('click', () => {
        clearTab();
        renderTab(getTabData());
    });
    exportTabButton.addEventListener('click', exportTab);
    showBPMInputButton.addEventListener('click', showBPMInput);
    //playTabButton.addEventListener('click', playTab); // Removed, as playTab is not yet implemented
    //stopTabButton.addEventListener('click', stopPlayback); // Removed, as stopPlayback is not yet implemented
    saveTabButton.addEventListener('click', saveTab);
    loadTabButton.addEventListener('click', loadTab);
    exportMIDButton.addEventListener('click', exportMIDI);

    // Attach event listeners to fret divs after they are rendered
    document.getElementById('tab-display').addEventListener('input', (event) => {
        if (event.target.classList.contains('fret')) {
            handleFretInput(event);
        }
    });

    document.getElementById('tab-display').addEventListener('click', (event) => {
        if (event.target.classList.contains('fret')) {
            showNumberCircle(event.target);
        }
    });
}

function exportTab() {
    // Placeholder for tab export
    alert('Tab export not yet implemented.');
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
