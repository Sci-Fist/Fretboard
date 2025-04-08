// src/audio.js
// audio.js - Handles audio playback and processing

import * as Tone from '/node_modules/tone/Tone.js'; // Explicit path to tone.js in node_modules
import { getTabData, getNote } from './tab-data.js';

let isPlaying = false;
let currentMeasureIndex = 0;
let currentStringIndex = 0;
let currentFretIndex = 0;
let tabData = null; // Store tab data for playback
let fretboardProcessorNode = null; // Global reference to the audio processor node

/**
 * Initializes audio context and processor.
 */
export async function initializeAudio() {
    console.log("audio.js: initializeAudio called");
    try {
        // Create audio context if not already running
        if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Audio context started');
        }

        // Check if the processor is already registered
        let processorRegistered = false;
        try {
            await audioWorklet.addModule('./fretboard-audio-processor.js');
            processorRegistered = true;
            console.log('Audio processor module added.');
        } catch (error) {
            console.warn('Error adding audio processor module or module already added:', error);
            processorRegistered = true; // Assume already registered or intentionally not registering again
        }


        if (processorRegistered) {
            // Create a new processor node only if registration was successful or assumed
            fretboardProcessorNode = new AudioWorkletNode(Tone.context, 'fretboard-audio-processor');

            // Connect the processor node to the audio output
            fretboardProcessorNode.connect(Tone.getDestination()); // Or Tone.Destination

            console.log('Audio processor node created and connected.');
        } else {
            console.error('Audio processor not registered, audio playback will be silent.');
        }


    } catch (error) {
        console.error("Error initializing audio system:", error);
        alert("Failed to initialize audio. Check console for details.");
    }
}

/**
 * Starts playback of the tab.
 */
export function playTab() {
    if (isPlaying) {
        console.warn("Playback already in progress.");
        return;
    }

    tabData = getTabData();
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        console.warn("No tab data to play or tab is empty.");
        return;
    }

    isPlaying = true;
    currentMeasureIndex = 0;
    currentStringIndex = 0;
    currentFretIndex = 0;
    console.log("audio.js: Playback started.");
    playMeasure(0); // Start playback from the first measure
}

/**
 * Stops the playback.
 */
export function stopPlayback() {
    if (isPlaying) {
        isPlaying = false;
        currentMeasureIndex = 0;
        currentStringIndex = 0;
        currentFretIndex = 0;
        console.log("audio.js: Playback stopped.");
        if (fretboardProcessorNode) {
            fretboardProcessorNode.port.postMessage({ type: 'allNotesOff' }); // Send message to stop all notes
        }
    } else {
        console.warn("Playback is not currently active.");
    }
}
// --- Playback Logic ---
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
