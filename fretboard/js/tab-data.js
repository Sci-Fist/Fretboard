// tab-data.js
// Handles the tab data structure and manipulation

let tabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0
};

function addMeasure() {
    console.log('addMeasure called'); // Log when addMeasure is called
    const measure = {
        strings: [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ]
    };
    tabData.measures.push(measure);
    console.log('tabData after addMeasure:', tabData); // Log tabData after adding a measure
    //renderTab(); // Removed renderTab call from here, as it's called in the DOMContentLoaded and clearTab
    //renderTab(); // Re-render after adding a measure
}

function clearTab() {
    console.log('clearTab called');
    tabData.measures = [];
    //renderTab();
}

function getTabData() {
    return tabData;
}

function setTabData(data) {
    tabData = data;
}

function getNote(stringIndex, fretNumber, tuning) {
    const notes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2; // Determine octave
    return notes[noteIndex] + octave;
}

export { addMeasure, clearTab, getTabData, setTabData, getNote };
