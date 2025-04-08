// src/app.js
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab } from './tab-data.js';
import { handleFretInput, removeActiveFretClass, showNumberCircle } from './ui-elements.js';
import { initializeAudio, playNote, stopNote } from './audio.js';
import config from '../config.js';
import { renderTab, initializeRendering, resizeCanvas } from './rendering.js';

console.log('app.js: Starting Fretboard app.');

let isPlaying = false;
let currentMeasureIndex = 0;
let playbackIntervalId;

function exportTab() {
    const tabData = getTabData();
    const tabText = generateTablature(tabData);
    const blob = new Blob([tabText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guitar_tab.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Tab exported as text!');
}

function saveTab() {
    try {
        localStorage.setItem('guitarTab', JSON.stringify(getTabData()));
        alert('Tab saved to local storage!');
    } catch (error) {
        console.error('Error saving tab:', error);
        alert('Error saving tab. Check the console for details.');
    }
}

function loadTab() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const tabData = JSON.parse(e.target.result);
                    setTabData(tabData);
                    renderTab(tabData);
                    alert('Tab loaded from file!');
                } catch (error) {
                    console.error('Error loading tab:', error);
                    alert('Error loading tab. Check the console for details.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click();
}

function handleAddMeasureWithInput(timeSignature, measureName) {
    const tabData = getTabData();
    if (!/^\d+\/\d+$/.test(timeSignature)) {
        alert('Invalid time signature format. Use X/Y.');
        return;
    }
    const [beats, noteValue] = timeSignature.split('/').map(Number);
    if (isNaN(beats) || isNaN(noteValue) || beats <= 0 || noteValue <= 0) {
        alert('Invalid time signature. Enter positive numbers.');
        return;
    }
    addMeasure({ timeSignature, name: measureName });
    renderTab(getTabData());
}

function generateTablature(tabData) {
    if (!tabData.measures.length) return 'No tab data.';
    let tabString = '';
    const tuning = tabData.tuning || ['E', 'A', 'D', 'G', 'B', 'e'];
    const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];
    tabData.measures.forEach((measure, measureIndex) => {
        tabString += `Measure ${measureIndex + 1} (${measure.name}, ${measure.timeSignature}):\n`;
        measure.strings.forEach((string, stringIndex) => {
            tabString += `${stringLabels[stringIndex]}|${string.join(' |').padEnd(16)}|\n`;
        });
        tabString += '\n';
    });
    tabString += `BPM: ${tabData.bpm}\n`;
    return tabString;
}

async function setupApp() {
    console.log('app.js: Setting up app.');
    initializeTabData();
    renderTab(getTabData());
    setupUI();
    await initializeAudio();
    console.log('app.js: App setup complete.');
    window.addEventListener('resize', resizeCanvas); // Add resize listener
}

function handlePlay() {
    if (!isPlaying) {
        console.log('app.js: Starting playback.');
        isPlaying = true;
        updatePlayPauseStopButtons();
        startPlaybackHighlight();
    } else {
        handlePause();
    }
}

function handlePause() {
    if (isPlaying) {
        console.log('app.js: Pausing playback.');
        isPlaying = false;
        updatePlayPauseStopButtons();
        stopPlaybackHighlight();
    }
}

function handleStop() {
    console.log('app.js: Stopping playback.');
    isPlaying = false;
    currentMeasureIndex = 0;
    updatePlayPauseStopButtons();
    stopPlaybackHighlight();
    resetMeasureHighlight();
}

function updatePlayPauseStopButtons() {
    const playButton = document.getElementById('playTabBtn');
    const pauseButton = document.getElementById('pauseTabBtn');
    const stopButton = document.getElementById('stopTabBtn');
    if (playButton && pauseButton && stopButton) {
        playButton.style.display = isPlaying ? 'none' : 'inline-block';
        pauseButton.style.display = isPlaying ? 'inline-block' : 'none';
        stopButton.style.display = isPlaying ? 'inline-block' : 'none';
        playButton.textContent = isPlaying ? 'Resume' : 'Play';
    }
}

function handleTimeSignatureChange(event) {
    const newTimeSignature = event.target.value;
    console.log(`app.js: Time signature changed to ${newTimeSignature}`);
    const tabData = getTabData();
    tabData.measures.forEach(measure => {
        const [beats] = newTimeSignature.split('/').map(Number);
        measure.strings.forEach((string, index) => {
            measure.strings[index] = Array(beats).fill('-');
        });
    });
    setTabData(tabData);
    renderTab(tabData);
}

function startPlaybackHighlight() {
    isPlaying = true;
    currentMeasureIndex = 0;
    const tabData = getTabData();
    const bpm = tabData.bpm || 120;
    const measures = tabData.measures;
    if (!measures.length) {
        console.warn('No measures to play.');
        isPlaying = false;
        return;
    }
    const millisecondsPerBeat = 60000 / bpm;
    const millisecondsPerMeasure = millisecondsPerBeat * 4;
    playbackIntervalId = setInterval(() => {
        if (currentMeasureIndex < measures.length) {
            highlightMeasure(currentMeasureIndex);
            currentMeasureIndex++;
        } else {
            stopPlaybackHighlight();
            handleStop();
        }
    }, millisecondsPerMeasure);
}

function stopPlaybackHighlight() {
    isPlaying = false;
    clearInterval(playbackIntervalId);
    resetMeasureHighlight();
}

function highlightMeasure(measureIndex) {
    resetMeasureHighlight();
    const measureDiv = document.querySelector(`.measure:nth-child(${measureIndex + 1})`);
    if (measureDiv) measureDiv.classList.add('playing-measure');
}

function resetMeasureHighlight() {
    document.querySelectorAll('.measure.playing-measure').forEach(measure => measure.classList.remove('playing-measure'));
}

async function setupUI() {
    console.log('app.js: Setting up UI.');
    document.body.style.fontSize = config.bodyFontSize;
    const timeSignatureSelect = document.getElementById('timeSignatureSelect');
    if (timeSignatureSelect) {
        timeSignatureSelect.addEventListener('change', handleTimeSignatureChange);
    }
    const bpmInputElement = document.getElementById('bpmInput');
    if (bpmInputElement) {
        bpmInputElement.addEventListener('change', (event) => {
            const newBPM = parseInt(event.target.value, 10);
            if (!isNaN(newBPM) && newBPM > 0) {
                setTabData({ ...getTabData(), bpm: newBPM });
            }
        });
    }
    const addMeasureButton = document.getElementById('addMeasureBtn');
    if (addMeasureButton) {
        addMeasureButton.addEventListener('click', openAddMeasureModal);
    }
    const clearTabButton = document.getElementById('clearTabBtn');
    if (clearTabButton) {
        clearTabButton.addEventListener('click', clearTab);
    }
    const exportTabButton = document.getElementById('exportTabBtn');
    if (exportTabButton) {
        exportTabButton.addEventListener('click', exportTab);
    }
    const saveTabButton = document.getElementById('saveTabBtn');
    if (saveTabButton) {
        saveTabButton.addEventListener('click', saveTab);
    }
    const loadTabButton = document.getElementById('loadTabBtn');
    if (loadTabButton) {
        loadTabButton.addEventListener('click', loadTab);
    }
    const playButton = document.getElementById('playTabBtn');
    if (playButton) {
        playButton.addEventListener('click', handlePlay);
    }
    const pauseButton = document.getElementById('pauseTabBtn');
    if (pauseButton) {
        pauseButton.addEventListener('click', handlePause);
    }
    const stopButton = document.getElementById('stopTabBtn');
    if (stopButton) {
        stopButton.addEventListener('click', handleStop);
    }
    const addMeasureModal = document.createElement('div');
    addMeasureModal.id = 'addMeasureModal';
    addMeasureModal.style.display = 'none';
    addMeasureModal.style.position = 'fixed';
    addMeasureModal.style.zIndex = '1000';
    addMeasureModal.style.left = '50%';
    addMeasureModal.style.top = '50%';
    addMeasureModal.style.transform = 'translate(-50%, -50%)';
    addMeasureModal.style.backgroundColor = '#fff';
    addMeasureModal.style.padding = '20px';
    addMeasureModal.style.border = '1px solid #ccc';
    addMeasureModal.style.borderRadius = '5px';
    addMeasureModal.innerHTML = `
        <h2>Add Measure</h2>
        <label for="measureName">Measure Name:</label>
        <input type="text" id="measureName" value="" placeholder="Measure Name">
        <br><br>
        <label for="timeSignature">Time Signature:</label>
        <select id="timeSignature">
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
            <option value="2/4">2/4</option>
        </select>
        <br><br>
        <button id="addMeasureModalSubmit">Add Measure</button>
        <button id="addMeasureModalCancel">Cancel</button>
    `;
    document.body.appendChild(addMeasureModal);
    const addMeasureModalSubmit = document.getElementById('addMeasureModalSubmit');
    const addMeasureModalCancel = document.getElementById('addMeasureModalCancel');
    const timeSignatureSelectModal = document.getElementById('timeSignature');
    const measureNameInputModal = document.getElementById('measureName');
    if (addMeasureModalSubmit) {
        addMeasureModalSubmit.addEventListener('click', () => {
            handleAddMeasureWithInput(timeSignatureSelectModal.value, measureNameInputModal.value);
            closeAddMeasureModal();
        });
    }
    if (addMeasureModalCancel) {
        addMeasureModalCancel.addEventListener('click', closeAddMeasureModal);
    }
    function openAddMeasureModal() {
        addMeasureModal.style.display = 'block';
        measureNameInputModal.value = '';
        measureNameInputModal.focus();
    }
    function closeAddMeasureModal() {
        addMeasureModal.style.display = 'none';
    }
    console.log('app.js: UI setup complete.');
}

setupApp();
