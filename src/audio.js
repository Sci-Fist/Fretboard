// audio.js
// This module handles audio playback using the Web Audio API.

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

    // --- Simple Playback Logic ---
    const bpm = tabData.bpm || 120;
    const secondsPerBeat = 60 / bpm;
    const notesPerMeasure = 4; // Assuming 4 notes per measure for simplicity
    const secondsPerNote = secondsPerBeat / notesPerMeasure;

    let currentTime = audioContext.currentTime; // Start at current audio context time

    for (const measure of tabData.measures) {
        for (let stringIndex = 0; stringIndex < measure.strings.length; stringIndex++) {
            for (let fretIndex = 0; fretIndex < measure.strings[stringIndex].length; fretIndex++) {
                const fretValue = measure.strings[stringIndex][fretIndex];
                if (fretValue !== '-' && fretValue !== '') { // Check for hyphen and empty string
                    const note = getNote(stringIndex, parseInt(fretValue), tabData.tuning); // Assuming getNote is available
                    if (note) {
                        // Schedule note on message
                        fretboardProcessorNode.port.postMessage({
                            type: 'noteOn',
                            note: note,
                            velocity: 0.8, // Example velocity
                            // oscillatorType: 'sine' // Example oscillator type - removed for now to use default
                        });

                        // Schedule note off message (after note duration) -  For now, just a fixed duration
                        const noteOffTime = currentTime + secondsPerNote * 0.9; // Shorten note slightly
                        const noteDuration = secondsPerNote * 0.9; // Example duration

                        // Basic note off implementation - sending 'allNotesOff' might be too abrupt for individual notes
                         setTimeout(() => {
                            fretboardProcessorNode.port.postMessage({ type: 'allNotesOff' }); // Send note off message
                         }, noteDuration * 1000); // setTimeout in milliseconds


                        currentTime += secondsPerNote; // Advance time for next note
                    }
                } else {
                    currentTime += secondsPerNote; // Still advance time even if no note
                }
            }
        }
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
