// tab-data.js
// This module is responsible for managing the tab data structure.
// It defines the default tab data, provides functions to add, clear, and get tab data,
// and includes a function to calculate the note based on string and fret.

const defaultTabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0,
    timeSignature: '4/4' // Added time signature to default data
};

let tabData = { ...defaultTabData };

/**
 * Initializes the tab data to the default values.
 */
function initializeTabData() {
    // Ensure deep copy for measures array if defaultTabData could be modified elsewhere (though unlikely here)
    tabData = {
      ...defaultTabData,
      measures: [], // Start with empty measures before adding one
      timeSignature: defaultTabData.timeSignature // Initialize time signature
    };
    addMeasure(); // Add the initial measure with default time signature
}


/**
 * Adds a new measure to the tab data.
 */
function addMeasure() {
    console.log('tab-data.js: addMeasure called');
    const timeSignature = tabData.timeSignature;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10); // Get numerator
    const measure = {
        strings: Array(6).fill(Array(beatsPerMeasure).fill('-')) // Use beatsPerMeasure for fret count
    };
    tabData.measures.push(measure);
    console.log('tab-data.js: tabData after addMeasure:', tabData);
}

/**
 * Clears all measures from the tab data.
 */
function clearTab() {
    console.log('tab-data.js: clearTab called');
    tabData.measures = []; // Correctly clears measures
    tabData.timeSignature = defaultTabData.timeSignature; // Reset time signature to default
    addMeasure(); // Add an initial measure with default time signature after clearing
    // Optionally reset other properties if needed, e.g., bpm
    // tabData.bpm = defaultTabData.bpm;
}

/**
 * Returns the current tab data.
 * @returns {object} The tab data object.
 */
function getTabData() {
    return tabData;
}

/**
 * Sets the tab data.
 * @param {object} data - The new tab data object.
 */
function setTabData(data) {
    tabData = data;
}

/**
 * Gets the note for a given string and fret number, based on the tuning.
 * @param {number} stringIndex - The index of the string (0-5).
 * @param {number} fretNumber - The fret number (0-24).
 * @param {string[]} tuning - The tuning of the guitar (e.g., ['E', 'A', 'D', 'G', 'B', 'E']).
 * @returns {string} The note name (e.g., "E4", "A3").
 */
function getNote(stringIndex, fretNumber, tuning) {
    const notes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2; // Determine octave
    return notes[noteIndex] + octave;
}

export { addMeasure, clearTab, getTabData, setTabData, getNote, initializeTabData };
