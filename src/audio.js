// audio.js
// This module handles audio playback using the Web Audio API.

import { getTabData, getNote } from './tab-data.js'; // Import getTabData and getNote

let audioContext;
let fretboardProcessorNode;
let resumeListenersAttached = false; // Flag to track if listeners are attached
let tabData; // To hold tab data for playback

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
    tabData = getTabData(); // Get tab data directly from module
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        console.warn("audio.js: No tab data to play or tabData is invalid.");
        alert("No tab data available to play. Please add measures and notes.");
        return;
    }

    console.log("audio.js: playTab - Tab data received:", tabData); // Log tabData

    // --- Simple Playback Logic (for debugging - plays only first note) ---
    if (tabData.measures[0] && tabData.measures[0].strings[0][0] !== '-' && tabData.measures[0].strings[0][0] !== '') {
        const fretValue = tabData.measures[0].strings[0][0];
        const note = getNote(0, parseInt(fretValue), tabData.tuning); // Play first note of first string, first fret
        if (note) {
            console.log("audio.js: playTab - Playing note:", note); // Log note to be played
            if (fretboardProcessorNode) {
                fretboardProcessorNode.port.postMessage({
                    type: 'noteOn',
                    note: note,
                    velocity: 0.8,
                    // oscillatorType: 'sine' // Oscillator type removed for now to use default
                });
                 // Stop note after a short duration (for debugging)
                 setTimeout(() => {
                    stopPlayback();
                }, 1000); // Stop after 1 second
            } else {
                console.error("audio.js: AudioWorkletNode is not initialized.");
                alert("Audio system not ready. Please refresh the page.");
            }
        }
    } else {
        console.log("audio.js: playTab - No note to play in the first fret.");
        alert("No note to play in the first fret of the first measure."); // More specific alert
    }
}

/**
 * Stops the audio playback.
 */
function stopPlayback() {
    console.log("audio.js: stopPlayback called");
    if (fretboardProcessorNode) {
        fretboardProcessorNode.port.postMessage({ type: 'allNotesOff' });
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
