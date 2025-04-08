// tab-data.js
const defaultTabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0,
};

let tabData = { ...defaultTabData };

export function initializeTabData() {
    tabData = { ...defaultTabData, measures: [] };
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' });
}

export function addMeasure(options = {}) {
    const timeSignature = options.timeSignature || '4/4';
    const name = options.name || `Measure ${tabData.measures.length + 1}`;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);
    const measure = {
        name,
        timeSignature,
        strings: Array(6).fill(Array(beatsPerMeasure).fill('-'))
    };
    tabData.measures.push(measure);
    setTabData(tabData);
}

export function clearTab() {
    tabData.measures = [];
    addMeasure({ timeSignature: '4/4', name: 'Measure 1' });
    setTabData(tabData);
}

export function getTabData() {
    return tabData;
}

export function setTabData(data) {
    tabData = data;
}

export function getNote(stringIndex, fretNumber, tuning) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2;
    return `${notes[noteIndex]}${octave}`;
}
