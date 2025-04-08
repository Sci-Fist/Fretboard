// audio.js
// This module handles audio playback using the Web Audio API.

import { getTabData, getNote } from './tab-data.js'; // Import getTabData and getNote
import { Midi } from '@tonejs/midi';

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
 * Exports the current tab data as a MIDI file.
 */
async function exportMIDI() {
    console.log("audio.js: exportMIDI called");
    const tabData = getTabData();
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        alert("No tab data to export.");
        return;
    }

    const midi = new Midi();
    const track = midi.addTrack();
    const bpm = tabData.bpm || 120;
    const timeSignature = tabData.timeSignature || '4/4';
    const [beats] = timeSignature.split('/').map(Number);
    const millisecondsPerBeat = 60000 / bpm;
    const ticksPerBeat = 480; // Standard MIDI ticks per beat
    const ticksPerMeasure = ticksPerBeat * beats;
    let currentTick = 0;

    tabData.measures.forEach((measure, measureIndex) => {
        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            for (let fretIndex = 0; fretIndex < beats; fretIndex++) {
                const fretValue = measure.strings[stringIndex][fretIndex];
                if (fretValue !== '-' && fretValue !== '') {
                    const note = getNote(stringIndex, parseInt(fretValue), tabData.tuning);
                    if (note) {
                        const [noteName, octave] = note.match(/([a-gA-G#b]+)(\d+)/).slice(1);
                        const noteNumber = getNoteNumber(noteName, parseInt(octave));
                        track.addNote({
                            midi: noteNumber,
                            time: currentTick / ticksPerBeat,
                            duration: (ticksPerBeat / beats) / ticksPerBeat, // Duration of one beat
                            velocity: 0.8,
                        });
                    }
                }
                currentTick += ticksPerBeat / beats; // Increment tick by the duration of one fret
            }
        }
    });

    try {
        const buffer = await midi.toArray();
        const blob = new Blob([buffer], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guitar_tab.mid';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('MIDI file exported!');
    } catch (error) {
        console.error('Error exporting MIDI:', error);
        alert('Error exporting MIDI. Check the console for more details.');
    }
}

function getNoteNumber(noteName, octave) {
    const notes = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
    const noteValue = notes[noteName];
    if (noteValue === undefined) {
        return null; // Or handle invalid note names
    }
    return noteValue + (octave + 1) * 12;
}


export { initializeAudio, playTab, stopPlayback, exportMIDI };
