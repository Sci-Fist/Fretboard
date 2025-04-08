// tab-data.js
// This module is responsible for managing the tab data structure.
// It defines the default tab data, provides functions to add, clear, and get tab data,
// and includes a function to calculate the note based on string and fret.

const defaultTabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0,
    // timeSignature: '4/4' // Removed global default time signature
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
      // timeSignature: defaultTabData.timeSignature // No longer needed here
    };
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' }); // Add the initial measure with default time signature and name
}


/**
 * Adds a new measure to the tab data.
 * @param {object} options - Options for the new measure.
 * @param {string} [options.timeSignature='4/4'] - The time signature for the measure (e.g., '4/4'). Defaults to '4/4' if not provided.
 * @param {string} [options.name] - The name of the measure. Defaults to 'Measure X'.
 */
function addMeasure(options = {}) {
    console.log('tab-data.js: addMeasure called with options:', options);
    // const measureTimeSignature = options.timeSignature || tabData.timeSignature; // NO: Removed fallback to global time signature
    const measureTimeSignature = options.timeSignature || '4/4'; // YES: Default to '4/4' for new measure if not specified
    const measureName = options.name || `Measure ${tabData.measures.length + 1}`; // Default measure name

    const beatsPerMeasure = parseInt(measureTimeSignature.split('/')[0], 10); // Get numerator
    const measure = {
        name: measureName, // Add measure name
        timeSignature: measureTimeSignature, // Add measure time signature
        strings: Array(6).fill(Array(beatsPerMeasure).fill('-')) // Use beatsPerMeasure for fret count, default '-'
    };
    tabData.measures.push(measure);
    setTabData(tabData); // Re-render the tab after adding a measure.
    console.log('tab-data.js: tabData after addMeasure:', tabData);
}

/**
 * Clears all measures from the tab data.
 */
function clearTab() {
    console.log('tab-data.js: clearTab called');
    tabData.measures = []; // Correctly clears measures
    // tabData.timeSignature = defaultTabData.timeSignature; // No longer needed to reset global time signature
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' }); // Add an initial measure with default time signature and name after clearing
    // Optionally reset other properties if needed, e.g., bpm
    // tabData.bpm = defaultTabData.bpm;
    setTabData(tabData); // Re-render the tab after clearing.
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
    // Assuming there's a function to re-render the tab in the UI
    // For example:
    // renderTab(tabData); // Call a function to re-render the tab
    // This is just a placeholder, replace with your actual rendering logic
    console.log('tab-data.js: setTabData called, new tabData:', tabData);
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
