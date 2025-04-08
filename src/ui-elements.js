// src/ui-elements.js
import { addMeasure, clearTab, getTabData, initializeTabData, setTabData } from './tab-data.js';
import { playTab, stopPlayback, setOscillatorType, resumeTab, pauseTab } from './audio.js';
import { renderTab } from './rendering.js'; // Import renderTab

// DOM element references
const addMeasureBtn = document.getElementById('addMeasureBtn');
const clearTabBtn = document.getElementById('clearTabBtn');
const bpmInput = document.getElementById('bpmInput');
const playTabBtn = document.getElementById('playTabBtn');
const pauseTabBtn = document.getElementById('pauseTabBtn');
const stopTabBtn = document.getElementById('stopTabBtn');
const saveTabBtn = document.getElementById('saveTabBtn');
const loadTabBtn = document.getElementById('loadTabBtn');
const exportTabBtn = document.getElementById('exportTabBtn');
const timeSignatureSelect = document.getElementById('timeSignatureSelect');
const rotateMeasureBtn = document.getElementById('rotateMeasureBtn');

// Initialize tab data and render the initial tab
initializeTabData();
renderTab(getTabData()); // Initial render

// Function to remove the active-fret class from all frets
function removeActiveFretClass() {
    document.querySelectorAll('.fret.active-fret').forEach(fret => {
        fret.classList.remove('active-fret');
    });
}

// Event listeners
if (addMeasureBtn) {
    addMeasureBtn.addEventListener('click', () => {
        const selectedTimeSignature = timeSignatureSelect ? timeSignatureSelect.value : '4/4';
        addMeasure({ timeSignature: selectedTimeSignature });
        renderTab(getTabData()); // Re-render after adding a measure
    });
}

if (clearTabBtn) {
    clearTabBtn.addEventListener('click', () => {
        clearTab();
        renderTab(getTabData()); // Re-render after clearing
    });
}

if (bpmInput) {
    bpmInput.addEventListener('change', () => {
        // Update the tempo in your tab data or audio settings
        // For example:
        // tabData.tempo = parseInt(bpmInput.value, 10);
        // setTabData(tabData);
        console.log('BPM changed to:', bpmInput.value);
    });
}

if (playTabBtn) {
    playTabBtn.addEventListener('click', () => {
        const tempo = parseInt(bpmInput?.value, 10) || 120; // Use the BPM input value or default to 120
        playTab(tempo);
        // Optionally, update button visibility
        playTabBtn.style.display = 'none';
        pauseTabBtn.style.display = '';
        stopTabBtn.style.display = '';
    });
}

if (pauseTabBtn) {
    pauseTabBtn.addEventListener('click', () => {
        pauseTab();
        // Optionally, update button visibility
        pauseTabBtn.style.display = 'none';
        playTabBtn.style.display = '';
    });
}

if (stopTabBtn) {
    stopTabBtn.addEventListener('click', () => {
        stopPlayback();
        // Optionally, update button visibility
        stopTabBtn.style.display = 'none';
        playTabBtn.style.display = '';
        pauseTabBtn.style.display = 'none';
    });
}

if (saveTabBtn) {
    saveTabBtn.addEventListener('click', () => {
        // Implement save tab functionality
        console.log('Save Tab clicked');
    });
}

if (loadTabBtn) {
    loadTabBtn.addEventListener('click', () => {
        // Implement load tab functionality
        console.log('Load Tab clicked');
    });
}

if (exportTabBtn) {
    exportTabBtn.addEventListener('click', () => {
        // Implement export tab functionality
        console.log('Export Tab clicked');
    });
}

if (rotateMeasureBtn) {
    rotateMeasureBtn.addEventListener('click', () => {
        toggleMeasureRotation();
    });
}
/**
 * Toggles the measure rotation state.
 */
function toggleMeasureRotation() {
  const tabDisplay = document.getElementById('tab-display');
  if (tabDisplay) {
    tabDisplay.classList.toggle('rotated'); // Toggle the 'rotated' class
  }
  removeActiveFretClass();
}

/**
 * Handles input for fret elements.
 * @param {Event} event - The input event.
 * @param {function} getTabData - Function to get the tab data.
 * @param {function} setTabData - Function to set the tab data.
 * @param {function} renderTab - Function to re-render the tab.
 */
function handleFretInput(event, getTabData, setTabData, renderTab) {
    const fretElement = event.target;
    const measureIndex = parseInt(fretElement.dataset.measure, 10);
    const stringIndex = parseInt(fretElement.dataset.string, 10);
    const fretIndex = parseInt(fretElement.dataset.fret, 10);
    const fretValue = fretElement.textContent;

    if (isNaN(measureIndex) || isNaN(stringIndex) || isNaN(fretIndex)) {
        console.warn('Invalid fret element data attributes.');
        return;
    }

    const tabData = getTabData();
    if (!tabData.measures[measureIndex]) {
        console.warn(`Measure at index ${measureIndex} not found.`);
        return;
    }

    if (!tabData.measures[measureIndex].strings[stringIndex]) {
        console.warn(`String at index ${stringIndex} not found in measure ${measureIndex}.`);
        return;
    }

    tabData.measures[measureIndex].strings[stringIndex][fretIndex] = fretValue;
    setTabData(tabData);
    renderTab(tabData);
}

export { setupToolBar, showNumberCircle, removeOpenNumberCircle, showSecondNumberCircle, removeActiveFretClass, toggleMeasureRotation, handleFretInput };
export { handleFretInput };
