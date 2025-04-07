// fretboard-processor.js
class FretboardProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "detune", // Optional: Example parameter
        defaultValue: 0,
        minValue: -1200, // Cents
        maxValue: 1200,
      },
    ];
  }

  constructor() {
    super();
    this.note = null; // Current note being played
    this.velocity = 1.0; // Default velocity
    this.oscillator = {
      frequency: 440, // Default frequency
      type: "sine", // Default oscillator type
    };
    this.detune = 0; // In cents.

    this.port.onmessage = (event) => {
      if (event.data.type === "noteOn") {
        this.note = event.data.note;
        this.velocity = event.data.velocity || 1.0;
      } else if (event.data.type === "noteOff") {
        this.note = null; // Stop playing the note
      } else if (event.data.type === "setOscillatorType") {
        this.oscillator.type = event.data.oscillatorType;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if (!output) {
      return false; // No output, bail
    }

    const channel = output[0]; // Assuming mono output

    if (!channel) {
      return false;
    }

    if (this.note === null) {
      // Write silence if no note is playing
      for (let i = 0; i < channel.length; i++) {
        channel[i] = 0;
      }
      return true;
    }

    //--- Get the note and frequency ---
    const A4 = 440;
    const semitoneRatio = 2 ** (1 / 12);
    const noteNumber = this.note.match(/([a-gA-G#b]+)(\d+)/); // parse note like "E4", "A#3"
    if (!noteNumber) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = 0;
      }
      return true; // Continue processing
    }
    let noteName = noteNumber[1];
    let octave = parseInt(noteNumber[2]);
    let noteValue = 0;

    const noteMap = {
      C: 0,
      "C#": 1,
      D: 2,
      "D#": 3,
      E: 4,
      F: 5,
      "F#": 6,
      G: 7,
      "G#": 8,
      A: 9,
      "A#": 10,
      B: 11,
    };

    if (noteName && octave) {
      noteValue = noteMap[noteName] + (octave - 4) * 12;
    }

    const frequency = A4 * semitoneRatio ** noteValue;
    //--- Get the frequency---

    const phaseIncrement = (frequency * 2 * Math.PI) / sampleRate;
    let phase = 0;

    for (let i = 0; i < channel.length; i++) {
      let sample = 0;

      // Oscillator selection
      if (this.oscillator.type === "sine") {
        sample = Math.sin(phase) * this.velocity;
      } else if (this.oscillator.type === "square") {
        sample = phase < Math.PI ? this.velocity : -this.velocity;
      } else if (this.oscillator.type === "sawtooth") {
        sample = 2 * (phase / (2 * Math.PI)) - 1;
      } else if (this.oscillator.type === "triangle") {
        sample = (2 / Math.PI) * Math.asin(Math.sin(phase));
      }

      channel[i] = sample;
      phase += phaseIncrement;
      if (phase > 2 * Math.PI) {
        phase -= 2 * Math.PI;
      }
    }

    return true;
  }
}

registerProcessor("fretboard-processor", FretboardProcessor);
