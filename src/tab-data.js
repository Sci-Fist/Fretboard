// tab-data.js
const defaultTabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0,
};

let tabData = { ...defaultTabData };

function initializeTabData() {
    tabData = { ...defaultTabData, measures: [] };
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' });
}

function addMeasure(options = {}) {
    console.log('tab-data.js: addMeasure called with options:', options);
    const measureTimeSignature = options.timeSignature || '4/4';
    const measureName = options.name || `Measure ${tabData.measures.length + 1}`;
    const beatsPerMeasure = parseInt(measureTimeSignature.split('/')[0], 10);
    const measure = {
        name: measureName,
        timeSignature: measureTimeSignature,
        strings: Array(6).fill(Array(beatsPerMeasure).fill('-'))
    };
    tabData.measures.push(measure);
    setTabData(tabData);
    console.log('tab-data.js: tabData after addMeasure:', tabData);
}

function clearTab() {
    console.log('tab-data.js: clearTab called');
    tabData.measures = [];
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' });
    setTabData(tabData);
}

function getTabData() {
    return tabData;
}

function setTabData(data) {
    tabData = data;
    console.log('tab-data.js: setTabData called, new tabData:', tabData);
}

function getNote(stringIndex, fretNumber, tuning) {
    const notes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2;
    return notes[noteIndex] + octave;
}

export { addMeasure, clearTab, getTabData, setTabData, getNote, initializeTabData };
