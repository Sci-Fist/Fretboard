import * as Tone from 'tone'; // Standard import for Tone.js with Parcel
import { getTabData, getNote } from './tab-data.js';
// audio.js
// Handles audio playback and processing using Tone.js

let audioWorkletNode; // Declare audioWorkletNode outside of functions
let isPlaying = false; // Flag to track playback state
let currentMeasureIndex = 0; // Track the current measure being played
let currentFretIndex = 0; // Track the current fret within the measure
let tabDataForPlayback; // Store tab data for playback to avoid repeated access
let playIntervalId; // Interval ID for playback scheduling
let tempo = 120; // Default tempo in BPM
let oscillatorType = 'sine'; // Default oscillator type


/**
 * Initializes audio worklet and Tone.js context.
 * @async
 */
async function initializeAudio() {
    try {
        await Tone.start(); // Ensure Tone.js audio context is started
        await Tone.ToneAudioWorklet.addModule('src/fretboard-processor.js'); // Path to your audio worklet processor
        audioWorkletNode = new Tone.ToneAudioWorkletNode('fretboard-processor');
        audioWorkletNode.connect(Tone.Destination); // Connect the worklet node to the audio output
        console.log('Audio worklet initialized and connected.');
    } catch (error) {
        console.error('Error initializing audio worklet:', error);
    }
}

/**
 * Sets the oscillator type for the audio worklet processor.
 * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle').
 */
export function setOscillatorType(type) {
    oscillatorType = type;
    console.log(`Oscillator type set to: ${oscillatorType}`);
}


/**
 * Starts playing the tablature from the beginning.
 * @param {object} tabData - The parsed tablature data.
 * @param {number} bpm - Beats per minute tempo.
 */
export async function playTab(tabData, bpm) {
    if (!audioWorkletNode) {
        await initializeAudio();
    }

    if (isPlaying) {
        console.log("Already playing, stop playback first.");
        return;
    }

    tabDataForPlayback = tabData; // Store tab data for playback
    tempo = bpm || 120; // Use provided bpm or default to 120
    isPlaying = true;
    currentMeasureIndex = 0;
    currentFretIndex = 0;
    schedulePlay(); // Start scheduling notes
    console.log("Playback started.");
}

/**
 * Stops the playback and clears any scheduled events.
 */
export function stopPlayback() {
    if (playIntervalId) {
        clearInterval(playIntervalId); // Clear the interval
        playIntervalId = null; // Reset interval ID
    }
    if (audioWorkletNode) {
        // Send 'allNotesOff' message to the audio worklet
        audioWorkletNode.port.postMessage({ type: 'allNotesOff' });
    }
    isPlaying = false;
    currentMeasureIndex = 0;
    currentFretIndex = 0;
    console.log("Playback stopped.");
}

/**
 * Pauses the playback, retaining the current position.
 */
export function pauseTab() {
    if (playIntervalId) {
        clearInterval(playIntervalId); // Clear the interval to pause scheduling
        playIntervalId = null; // Reset interval ID
    }
    isPlaying = false;
    console.log("Playback paused.");
}

/**
 * Resumes playback from the paused position.
 */
export function resumeTab() {
    if (!isPlaying && tabDataForPlayback) {
        isPlaying = true;
        schedulePlay(); // Resume scheduling notes from where it was paused
        console.log("Playback resumed.");
    } else {
        console.log("Cannot resume playback as it was not paused or no tab data available.");
    }
}


/**
 * Schedules the playback of notes at intervals.
 */
function schedulePlay() {
    if (!isPlaying || !tabDataForPlayback || !audioWorkletNode) {
        return; // Exit if not playing, no tab data, or audio worklet not initialized
    }

    const notesPerMeasure = 4; // Assuming 4 notes per measure, adjust if needed
    const intervalDuration = (60 / tempo) / notesPerMeasure * 1000; // Interval in milliseconds

    playIntervalId = setInterval(() => {
        if (!isPlaying) {
            clearInterval(playIntervalId); // Stop interval if playback is stopped
            return;
        }

        if (currentMeasureIndex >= tabDataForPlayback.measures.length) {
            stopPlayback(); // Stop if all measures are played
            return;
        }

        const currentMeasure = tabDataForPlayback.measures[currentMeasureIndex];
        let notePlayedInThisInterval = false; // Flag to track if a note was played in this interval

        // Iterate through each string in the measure
        for (let stringIndex = 0; stringIndex < currentMeasure.strings.length; stringIndex++) {
            const fret = currentMeasure.strings[stringIndex][currentFretIndex];
            if (fret && fret !== '-' && fret !== 'x') {
                const note = getNote(stringIndex, parseInt(fret)); // Get note based on string and fret
                if (note) {
                    // Send noteOn message to audio worklet for each string that has a note
                    audioWorkletNode.port.postMessage({
                        type: 'noteOn',
                        note: note,
                        velocity: 0.8, // Example velocity
                        oscillatorType: oscillatorType // Use the current oscillator type
                    });
                    notePlayedInThisInterval = true; // Mark that a note was played
                    console.log(`Playing note: ${note} at measure ${currentMeasureIndex + 1}, fret index ${currentFretIndex}`);
                }
            }
        }

        if (!notePlayedInThisInterval) {
            // If no note was played in this interval, send allNotesOff to stop any hanging notes
            audioWorkletNode.port.postMessage({ type: 'allNotesOff' });
        }


        currentFretIndex++; // Move to the next fret in the measure

        // Move to the next measure or stop if end is reached
        if (currentFretIndex >= notesPerMeasure) {
            currentFretIndex = 0; // Reset fret index for the next measure
            currentMeasureIndex++; // Move to the next measure
        }

        if (currentMeasureIndex >= tabDataForPlayback.measures.length) {
            stopPlayback(); // Stop playback when all measures are done
        }
    }, intervalDuration);
}

/**
 * Placeholder for MIDI export functionality.
 */
function exportMIDI() {
    console.warn("app.js: exportMIDI called (placeholder)");
    // Implement MIDI export logic here
    alert("MIDI export is not yet implemented.");
}

export { initializeAudio, playTab, stopPlayback, setOscillatorType, resumeTab, pauseTab, exportMIDI };
