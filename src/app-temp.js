// app.js
// Main application logic - event listeners, initialization

import { addMeasure, clearTab, getTabData, setTabData, initializeTabData } from './tab-data.js';
import { renderTab } from './rendering.js';
import { handleFretInput, showNumberCircle, setupToolBar } from './ui-elements-temp.js';
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
        initializeTabData();
        renderTab(getTabData()); // Initial render after setup
        attachFretEventListeners(); // Attach event listeners to fret elements
    } catch (error) {
        console.error('app.js: Error during UI setup:', error);
        alert('Failed to initialize the application. Please check your browser settings.');
    }
    console.log('app.js: Finished setupUI');
}

/**
 * Attaches event listeners to the fret elements.
 */
function attachFretEventListeners() {
    const tabDisplay = document.getElementById('tab-display');
    if (!tabDisplay) {
        console.error('app.js: tab-display element not found!');
        return;
    }

    tabDisplay.addEventListener('input', (event) => {
        if (event.target.classList.contains('fret')) {
            handleFretInput(event);
        }
    });

    tabDisplay.addEventListener('click', (event) => {
        if (event.target.classList.contains('fret')) {
            showNumberCircle(event.target);
        }
    });
}
export { addMeasure, clearTab, getTabData, setTabData, initializeTabData, renderTab, handleFretInput, exportMIDI, playTab, stopPlayback };
