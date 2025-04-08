// audio.js
// This module handles audio playback using the Web Audio API.

import { getTabData, getNote } from './tab-data.js'; // Import getTabData and getNote

let audioContext;
let fretboardProcessorNode;
let resumeListenersAttached = false; // Flag to track if listeners are attached
let tabData; // To hold tab data for playback
let isPlaying = false; // Track playback state
let currentMeasureIndex = 0;
let currentStringIndex = 0;
let currentFretIndex = 0;
let playbackIntervalId = null;

/**
 * Initializes the audio context and processor.
 */
async function initializeAudio() {
    console.log("audio.js: initializeAudio called.");
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("audio.js: AudioContext created:", audioContext);
        if (audioContext.state === 'suspended') {
            console.log("audio.js: AudioContext is suspended, attaching resume listeners.");
            if (!resumeListenersAttached) {
                resumeAudioContextOnInteraction();
                resumeListenersAttached = true;
            }
        }
    }

    if (!fretboardProcessorNode) {
        await setupAudioWorklet();
    }
    console.log("audio.js: initializeAudio finished.");
}

/**
 * Resumes the audio context on user interaction.
 */
function resumeAudioContextOnInteraction() {
    console.log("audio.js: resumeAudioContextOnInteraction called. actx is:", audioContext);
    const resume = async () => {
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log("audio.js: AudioContext resumed successfully.");
        }
        document.removeEventListener('mousedown', resume);
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('keydown', resume);
    };
    document.addEventListener('mousedown', resume);
    document.addEventListener('touchstart', resume);
    document.addEventListener('keydown', resume);
    console.log("audio.js: Audio resume listeners attached.");
}


/**
 * Sets up the AudioWorklet processor for sound generation.
 */
async function setupAudioWorklet() {
    try {
        await audioContext.audioWorklet.addModule('src/fretboard-processor.js');
        fretboardProcessorNode = new AudioWorkletNode(audioContext, 'fretboard-processor');
        fretboardProcessorNode.connect(audioContext.destination);
        console.log("audio.js: AudioWorkletNode created and connected.");
    } catch (error) {
        console.error("audio.js: Error setting up AudioWorklet:", error);
        alert('Failed to initialize audio. Please check console for details.');
    }
}

/**
 * Plays the guitar tab data.
 * @param {object} currentTabData - The guitar tab data.
 */
function playTab() {
    console.log("audio.js: playTab called");
    if (isPlaying) {
        console.log("audio.js: Already playing, ignoring playTab call.");
        return; // Prevent multiple playbacks
    }
    isPlaying = true;
    tabData = getTabData(); // Get tab data directly from module
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        console.warn("audio.js: No tab data to play or tabData is invalid.");
        alert("No tab data available to play. Please add measures and notes.");
        isPlaying = false; // Reset the flag
        return;
    }

    console.log("audio.js: playTab - Tab data received:", tabData); // Log tabData

    // --- Playback Logic ---
    currentMeasureIndex = 0;
    currentStringIndex = 0;
    currentFretIndex = 0;
    playMeasure(currentMeasureIndex);
}

function playMeasure(measureIndex) {
    if (!isPlaying) {
        return; // Stop if playback has been stopped
    }

    if (measureIndex >= tabData.measures.length) {
        stopPlayback();
        return;
    }

    const measure = tabData.measures[measureIndex];
    const timeSignature = tabData.timeSignature || '4/4';
    const [beats] = timeSignature.split('/').map(Number);
    const bpm = tabData.bpm || 120;
    const millisecondsPerBeat = 60000 / bpm;
    const millisecondsPerMeasure = millisecondsPerBeat * beats;

    let fretValue = measure.strings[currentStringIndex][currentFretIndex];
    if (fretValue !== '-' && fretValue !== '') {
        const note = getNote(currentStringIndex, parseInt(fretValue), tabData.tuning);
        if (note) {
            console.log(`audio.js: Playing note ${note} at measure ${measureIndex}, string ${currentStringIndex}, fret ${currentFretIndex}`);
            if (fretboardProcessorNode) {
                fretboardProcessorNode.port.postMessage({
                    type: 'noteOn',
                    note: note,
                    velocity: 0.8,
                });
            }
        }
    }

    // Move to the next fret
    currentFretIndex++;
    if (currentFretIndex >= beats) {
        currentFretIndex = 0;
        currentStringIndex++;
        if (currentStringIndex >= 6) {
            currentStringIndex = 0;
            // Move to the next measure
            currentMeasureIndex++;
            if (currentMeasureIndex < tabData.measures.length) {
                setTimeout(() => {
                    playMeasure(currentMeasureIndex);
                }, millisecondsPerMeasure);
                return; // Exit to prevent immediate next fret playback
            } else {
                stopPlayback();
                return;
            }
        }
    }

    // Play the next fret immediately
    setTimeout(() => {
        if (isPlaying) {
            playMeasure(measureIndex);
        }
    }, millisecondsPerBeat);
}

/**
 * Stops the audio playback.
 */
function stopPlayback() {
    console.log("audio.js: stopPlayback called");
    if (fretboardProcessorNode) {
        fretboardProcessorNode.port.postMessage({ type: 'allNotesOff' });
    }
    isPlaying = false; // Reset the flag
    currentMeasureIndex = 0;
    currentStringIndex = 0;
    currentFretIndex = 0;
    if (playbackIntervalId) {
        clearInterval(playbackIntervalId);
        playbackIntervalId = null;
    }
    // Additional stop logic if needed (e.g., clearing intervals, UI reset)
}

/**
 * Exports the current tab data as a MIDI file (placeholder).
 */
function exportMIDI() {
    console.log("audio.js: exportMIDI called (placeholder)");
    alert("MIDI export functionality is not yet implemented."); // Placeholder alert
    // TODO: Implement MIDI export logic
}


export { initializeAudio, playTab, stopPlayback, exportMIDI };
