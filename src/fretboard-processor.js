// fretboard-processor.js
registerProcessor('fretboard-processor', class extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      const { type, note, velocity, oscillatorType } = event.data;
      if (type === 'noteOn') {
        this.playNote(note, velocity, oscillatorType);
      } else if (type === 'allNotesOff') {
        this.stopNote();
      }
    };
  }

  playNote(note, velocity, oscillatorType) {
    this.note = note;
    this.velocity = velocity;
    this.oscillatorType = oscillatorType || 'sine';
  }

  stopNote() {
    this.note = null;
    this.velocity = 0;
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];
    if (!channel) return true;
    if (!this.note) {
      this.velocity = Math.max(0, this.velocity - 0.01);
    } else {
      this.velocity = Math.min(1, this.velocity + 0.01);
    }
    if (this.velocity === 0) return true;
    const A4 = 440;
    const semitoneRatio = 2 ** (1 / 12);
    const noteNumber = this.note.match(/([a-gA-G#b]+)(\d+)/);
    let noteValue = 0;
    if (noteNumber) {
      const noteName = noteNumber[1];
      const octave = parseInt(noteNumber[2]);
      const noteMap = {
        C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11
      };
      noteValue = noteMap[noteName] + (octave - 4) * 12;
    }
    const frequency = A4 * semitoneRatio ** noteValue;
    const phaseIncrement = (frequency * 2 * Math.PI) / sampleRate;
    for (let i = 0; i < channel.length; i++) {
      let sample = 0;
      if (this.oscillatorType === 'sine') {
        sample = Math.sin(this.phase);
      } else if (this.oscillatorType === 'square') {
        sample = this.phase < Math.PI ? 1 : -1;
      } else if (this.oscillatorType === 'sawtooth') {
        sample = 2 * (this.phase / (2 * Math.PI)) - 1;
      } else if (this.oscillatorType === 'triangle') {
        sample = (2 / Math.PI) * Math.asin(Math.sin(this.phase));
      }
      channel[i] = sample * this.velocity;
      this.phase += phaseIncrement;
      this.phase %= 2 * Math.PI;
    }
    return true;
  }
});
