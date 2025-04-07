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
                e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
            };
            fret.onclick = (e) => {
                showNumberCircle(e.target);
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
                    e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
                };
                fret.onclick = (e) => {
                    showNumberCircle(e.target);
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

function showNumberCircle(fret) {
    // Remove any existing circle
    let existingCircle = fret.querySelector('.number-circle');
    if (existingCircle) {
        existingCircle.remove();
        document.removeEventListener('click', closeNumberCircle);
    }

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;

    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1x', '2x'];
    numbers.forEach((num, i) => {
        const angle = (i / numbers.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;
        number.onclick = () => {
            if (num === '1x' || num === '2x') {
                circle.remove();
                fret.textContent = num[0];
                //document.removeEventListener('click', closeNumberCircle);
                showSecondNumberCircle(fret, num);
            } else {
                fret.textContent = num;
                circle.remove();
                document.removeEventListener('click', closeNumberCircle);
            }
        };
        circle.appendChild(number);
    });

    fret.appendChild(circle);

    function closeNumberCircle(event) {
        if (!circle.contains(event.target) && event.target !== fret) {
            circle.remove();
            document.removeEventListener('click', closeNumberCircle);
        }
    }

    document.addEventListener('click', closeNumberCircle);
}

function showSecondNumberCircle(fret, firstDigit) {
    // Remove any existing circle
    let existingCircle = fret.querySelector('.number-circle');
    if (existingCircle) {
        existingCircle.remove();
        document.removeEventListener('click', closeNumberCircle);
    }
    let secondCircleCloseListener;
 

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;

    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    numbers.forEach((num, i) => {
        const angle = (i / numbers.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;
        number.onclick = () => {
            fret.textContent = firstDigit.replace('x', num);
            circle.remove();
            document.removeEventListener('click', secondCircleCloseListener);
        };
        circle.appendChild(number);
    });

    fret.appendChild(circle);

    function closeNumberCircle(event) {
        if (!circle.contains(event.target) && event.target !== fret) {
            circle.remove();
            document.removeEventListener('click', secondCircleCloseListener);
        }
    }
    secondCircleCloseListener = closeNumberCircle;
    document.addEventListener('click', closeNumberCircle);
}
