import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
    Tone.start().then(() => {
        console.log('Tone.js is ready');
        loadTab(); // Load tab data after Tone.js is ready
    });
    setupUI();
});

let tabData = {
    measures: [],
    bpm: 120,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    capo: 0
};

const standardTuning = [64, 59, 55, 50, 45, 40]; // [E4, B3, G3, D3, A2, E2]

function setupUI() {
    const addMeasureButton = document.querySelector('.tool-bar button:nth-child(1)');
    const clearTabButton = document.querySelector('.tool-bar button:nth-child(2)');
    const playTabButton = document.querySelector('.tool-bar button:nth-child(5)');
    const stopTabButton = document.createElement('button');
    stopTabButton.textContent = 'Stop';
    stopTabButton.onclick = stopPlayback;
    stopTabButton.style.display = 'none'; // Initially hidden
    const toolBar = document.querySelector('.tool-bar');
    toolBar.insertBefore(stopTabButton, playTabButton.nextSibling);

    addMeasureButton.addEventListener('click', addMeasure);
    clearTabButton.addEventListener('click', clearTab);
    playTabButton.addEventListener('click', startPlayback);
}

function addMeasure() {
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
    renderTab();
}

function clearTab() {
    tabData.measures = [];
    renderTab();
}

function renderTab() {
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = '';

    tabData.measures.forEach((measure, measureIndex) => {
        const measureDiv = document.createElement('div');
        measureDiv.className = 'measure';

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement('div');
            stringDiv.className = 'string';

            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                const fretDiv = document.createElement('div');
                fretDiv.className = 'fret';
                fretDiv.contentEditable = true;
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || '';
                fretDiv.addEventListener('input', handleFretInput);
                fretDiv.addEventListener('click', (e) => {
                    showNumberCircle(e.target);
                });
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
}

function handleFretInput(e) {
    const measureIndex = parseInt(e.target.dataset.measure);
    const stringIndex = parseInt(e.target.dataset.string);
    const fretIndex = parseInt(e.target.dataset.fret);
    const value = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2); // Allow only numbers, max 2 digits

    if (tabData.measures[measureIndex]) {
        tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
    }
    e.target.textContent = value; // Update the displayed text
}

let synth;
let playbackInterval;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let isPlaying = false;
const playTabButton = document.querySelector('.tool-bar button:nth-child(5)');
const stopTabButton = document.querySelector('.tool-bar button:nth-child(6)');

function startPlayback() {
    if (isPlaying) return; // Prevent multiple playbacks
    isPlaying = true;
    playTabButton.style.display = 'none';
    stopTabButton.style.display = '';
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const bpm = tabData.bpm || 120;
    const noteLength = (60 / bpm) * 4;
    currentMeasureIndex = 0;
    currentFretIndex = 0;
    playbackInterval = setInterval(() => {
        playBeat();
        currentFretIndex++;
        if (currentFretIndex >= 4) {
            currentFretIndex = 0;
            currentMeasureIndex++;
            if (currentMeasureIndex >= tabData.measures.length) {
                stopPlayback();
            }
        }
    }, noteLength / 4 * 1000); // Convert to milliseconds
}

function playBeat() {
    if (!tabData.measures[currentMeasureIndex]) return;
    const measure = tabData.measures[currentMeasureIndex];
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        const fretValue = measure.strings[stringIndex][currentFretIndex];
        const fretNumber = parseInt(fretValue);
        if (!isNaN(fretNumber)) {
            const note = getNote(stringIndex, fretNumber);
            synth.triggerAttackRelease(note, '16n'); // Play for a 16th note
        }
    }
}

function stopPlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(playbackInterval);
    playTabButton.style.display = '';
    stopTabButton.style.display = 'none';
    if (synth) {
        synth.releaseAll(); // Stop any lingering notes
    }
    currentMeasureIndex = 0;
    currentFretIndex = 0;
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
    }
    renderTab();
}

function exportMIDI() {
    // Placeholder for MIDI export
    alert('MIDI export not yet implemented.');
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
