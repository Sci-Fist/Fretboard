console.log("Fretboard\\src\\audio.js loaded");
export const actx = new AudioContext();
let nextNoteTime = 0.0;
let noteResolution = 0;
let fretboardNode;
let tempo = 60.0;
let timerID = 0;

// Add a function to resume the AudioContext on user interaction
function resumeAudioContextOnInteraction() {
  if (actx.state === "suspended") {
    actx.resume().then(() => {
      console.log("AudioContext resumed successfully");
    });
  }
}

// Attach the event listeners for user interaction
document.addEventListener("touchstart", resumeAudioContextOnInteraction, false);
document.addEventListener("click", resumeAudioContextOnInteraction, false);
document.addEventListener("keydown", resumeAudioContextOnInteraction, false);

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;
  nextNoteTime += secondsPerBeat / 2;
}

function playNote(note, duration) {
  console.log("audio.js: playNote called with", note, duration);

  if (!fretboardNode) {
    console.warn("audio.js: AudioWorkletNode not initialized.");
    return;
  }
  if (actx.state === "suspended") {
    actx.resume();
  }
  fretboardNode.port.postMessage({
    type: "noteOn",
    note: note,
    velocity: 0.75, // Example: Set velocity
  });
}

function scheduleNote(beatNumber, time, frequency) {
  //This function is no longer used
}

function playTab(tabData) {
  noteResolution = 0;
  nextNoteTime = actx.currentTime;
  timerID = setInterval(() => {
    for (let i = 0; i < tabData.length; i++) {
      if (tabData[i].time == noteResolution) {
        playNote(tabData[i].frequency);
      }
    }
    noteResolution++;
  }, 10);
}

function stopPlayback() {
  clearInterval(timerID);
  if (fretboardNode) {
    fretboardNode.port.postMessage({ type: "noteOff" });
  }
}

function exportMIDI(tabData) {
  // Placeholder function
  console.log("MIDI export functionality will be added here.");
}

function handleExport(tabData) {
  // Placeholder function
  exportMIDI(tabData);
}

async function setupAudioWorklet() {
  try {
    await actx.audioWorklet.addModule("fretboard-processor.js"); // Path to the processor file
    fretboardNode = new AudioWorkletNode(actx, "fretboard-processor", {
      parameterData: { detune: 0 }, // Initialize detune parameter
    }); // Use the processor's registered name
    // Connect the AudioWorkletNode to the destination
    fretboardNode.connect(actx.destination);
  } catch (error) {
    console.error("Failed to initialize AudioWorklet:", error);
    alert(
      "Failed to initialize audio playback. Please check your browser settings and the console.",
    );
  }
}

setupAudioWorklet();

export { playTab, stopPlayback, exportMIDI, actx }; // Export actx
