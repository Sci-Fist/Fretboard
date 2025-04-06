document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
    addMeasure();
});

let tabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0
};

function addMeasure() {
    const tabDisplay = document.getElementById('tab-display');
    const measure = document.createElement('div');
    measure.className = 'measure';

    for (let i = 0; i < 6; i++) {
        const string = document.createElement('div');
        string.className = 'string';
        for (let j = 0; j < 4; j++) {
            const fret = document.createElement('div');
            fret.className = 'fret';
            fret.contentEditable = true;
            fret.oninput = (e) => {
                e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '');
            };
            string.appendChild(fret);
        }
        measure.appendChild(string);
    }

    tabDisplay.appendChild(measure);
    tabData.measures.push(measure);
}

function clearTab() {
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = '';
    tabData.measures = [];
}

function exportTab() {
    const tabDisplay = document.getElementById('tab-display');
    const measures = tabDisplay.querySelectorAll('.measure');
    let tabText = '';

    measures.forEach(measure => {
        const strings = measure.querySelectorAll('.string');
        strings.forEach(string => {
            const frets = string.querySelectorAll('.fret');
            frets.forEach(fret => {
                tabText += fret.textContent || '-';
                tabText += ' ';
            });
            tabText += '\n';
        });
        tabText += '\n';
    });

    const blob = new Blob([tabText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tab.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function playTab() {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();

    tabData.measures.forEach((measure, measureIndex) => {
        const strings = measure.querySelectorAll('.string');
        strings.forEach((string, stringIndex) => {
            const frets = string.querySelectorAll('.fret');
            frets.forEach((fret, fretIndex) => {
                const fretNumber = parseInt(fret.textContent);
                if (!isNaN(fretNumber)) {
                    const note = getNote(stringIndex, fretNumber);
                    synth.triggerAttackRelease(note, '8n', now + measureIndex * 4 + fretIndex * 0.5);
                }
            });
        });
    });
}

function getNote(stringIndex, fretNumber) {
    const notes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
    const baseNote = tabData.tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    return notes[noteIndex];
}

function saveTab() {
    localStorage.setItem('tabData', JSON.stringify(tabData));
}

function loadTab() {
    const savedTabData = localStorage.getItem('tabData');
    if (savedTabData) {
        tabData = JSON.parse(savedTabData);
        renderTab();
    }
}

function renderTab() {
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = '';

    tabData.measures.forEach(measureData => {
        const measure = document.createElement('div');
        measure.className = 'measure';

        for (let i = 0; i < 6; i++) {
            const string = document.createElement('div');
            string.className = 'string';
            for (let j = 0; j < 4; j++) {
                const fret = document.createElement('div');
                fret.className = 'fret';
                fret.contentEditable = true;
                fret.oninput = (e) => {
                    e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '');
                };
                string.appendChild(fret);
            }
            measure.appendChild(string);
        }

        tabDisplay.appendChild(measure);
    });
}

function exportMIDI() {
    const midiData = [];
    tabData.measures.forEach((measure, measureIndex) => {
        const strings = measure.querySelectorAll('.string');
        strings.forEach((string, stringIndex) => {
            const frets = string.querySelectorAll('.fret');
            frets.forEach((fret, fretIndex) => {
                const fretNumber = parseInt(fret.textContent);
                if (!isNaN(fretNumber)) {
                    const note = getNote(stringIndex, fretNumber);
                    midiData.push({
                        note: note,
                        time: measureIndex * 4 + fretIndex * 0.5
                    });
                }
            });
        });
    });

    const midiBlob = new Blob([JSON.stringify(midiData)], { type: 'application/json' });
    const url = URL.createObjectURL(midiBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tab.midi';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
