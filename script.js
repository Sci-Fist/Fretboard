document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
    addMeasure();
    // Initialize Tone.js
    Tone.start();
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
    // Ensure Tone.js is initialized
    if (Tone.context.state !== 'running') {
        Tone.start();
    }

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    const bpm = tabData.bpm || 120; // Use stored BPM or default to 120
    const noteLength = (60 / bpm) * 4; // Calculate note length based on BPM

    tabData.measures.forEach((measure, measureIndex) => {
        const strings = measure.querySelectorAll('.string');
        strings.forEach((string, stringIndex) => {
            const frets = string.querySelectorAll('.fret');
            frets.forEach((fret, fretIndex) => {
                const fretNumber = parseInt(fret.textContent);
                if (!isNaN(fretNumber)) {
                    const note = getNote(stringIndex, fretNumber);
                    const time = now + (measureIndex * 4 + fretIndex) * (noteLength / 4); // Corrected timing
                    synth.triggerAttackRelease(note, noteLength / 4, time); // Play for 1/4 of a measure
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
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2; // Determine octave
    return notes[noteIndex] + octave;
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
    // Remove any existing number circle before showing a new one
    let existingCircle = fret.querySelector('.number-circle');
    const openNumberCircle = document.querySelector('.number-circle');
    if (openNumberCircle) {
        existingCircle = openNumberCircle; // if another number circle is open, target that one for removal
        existingCircle.remove();
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
                // If 1x or 2x is clicked, show the second number circle
                circle.remove();
                showSecondNumberCircle(fret, num);
            } else {
                // Otherwise, just set the fret text to the chosen number
                fret.textContent = num;
                circle.remove();
            }
        };

        circle.appendChild(number);
    });

    // Append number circle to the body to avoid clipping
    document.body.appendChild(circle);
    // Position the number circle relative to the fret
    const fretRect = fret.getBoundingClientRect();
    circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`; // Adjusted vertical positioning
    circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`; // Adjusted horizontal positioning
}

// Add event listener to document to close number circle when clicking outside
document.addEventListener('click', function(event) {
    const numberCircle = document.querySelector('.number-circle');
    if (numberCircle) {
        let isClickInside = numberCircle.contains(event.target);
        let isClickOnFret = event.target.classList.contains('fret');

        if (!isClickInside && !isClickOnFret) {
            // Add a small delay before removing the number circle, but only if it's NOT the second number circle
            setTimeout(() => {
                if (!event.target.closest('.number-circle')) { // Double check if click is still outside any number-circle after delay
                    numberCircle.remove();
                }
            }, 100); // 100 milliseconds delay
        }
    }
});

function showSecondNumberCircle(fret, firstDigit) {
    // Remove any existing number circle
    let existingCircle = fret.querySelector('.number-circle');
    if (existingCircle) {
        existingCircle.remove();
    }

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    circle.classList.add('second-number-circle'); // Add the new class here
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
            // Replace 'x' with the chosen number in the first digit
            fret.textContent = firstDigit.replace(/x/, num); // Use regex to replace only the first 'x'
            circle.remove(); // Remove the second number circle after number selection
        };

        circle.appendChild(number);
    });

    // Append number circle to the body to avoid clipping, same as first circle
    document.body.appendChild(circle);
    // Position the second number circle relative to the fret
    const fretRect = fret.getBoundingClientRect(); // Comment out original fretRect code
    circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`; // Adjusted vertical positioning
    circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`; // Adjusted horizontal positioning
}

function showBPMInput() {
    // Create the input element
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'bpmInput';
    input.value = tabData.bpm; // Set the current BPM as the default value
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
            tabData.bpm = newBPM;
            // Optionally, provide feedback to the user, e.g., by updating a display element
            console.log('BPM set to:', tabData.bpm);
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
