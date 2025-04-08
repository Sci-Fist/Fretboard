const actx = new AudioContext();
let nextNoteTime = 0.0;
let noteResolution = 0;
let fretboardNode;
let tempo = 60.0;
let timerID = 0;

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;
  nextNoteTime += secondsPerBeat / 2;
}

function scheduleNote(beatNumber, time, frequency) {
  const osc = actx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = frequency;
  osc.connect(actx.destination);

  osc.start(time);
  osc.stop(time + 0.5);
}

function playNote(frequency) {
  scheduleNote(0, nextNoteTime, frequency);
  nextNote();
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
  // Placeholder function
  console.log("setupAudioWorklet called");
}

setupAudioWorklet();

export { playTab, stopPlayback, exportMIDI };
