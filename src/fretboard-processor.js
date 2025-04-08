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
    this.note = null;
    this.velocity = 0.0; // Initialize to 0 for smooth start
    this.oscillatorType = "sine";
    this.frequency = 440;
    this.phase = 0;
    this.detune = 0;
    this.allNotesOff = false; // Add a flag to indicate all notes off
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0];

    if (!channel) {
      return true;
    }
    // Check for "allNotesOff" message
    while (this.port.hasMessage()) {
      const message = this.port.getMessage();
      if (message.type === "allNotesOff") {
        this.note = null;
        this.velocity = 0;
        this.allNotesOff = true;
        break; // Exit loop after processing the message
      }
      if (message.type === "noteOn") {
        this.note = message.note;
        this.velocity = message.velocity;
        this.allNotesOff = false;
      }
    }

    if (this.allNotesOff) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = 0;
      }
      return true;
    }

    const detune = parameters.detune[0]; // Get detune value

    if (this.note === null) {
      this.velocity = Math.max(0, this.velocity - 0.01); // Fade out
    } else {
      this.velocity = Math.min(1.0, this.velocity + 0.01); // Fade in
    }

    if (this.velocity === 0) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = 0;
      }
      return true;
    }

    //--- Get the note and frequency ---
    const A4 = 440;
    const semitoneRatio = 2 ** (1 / 12);
    const noteNumber = this.note ? this.note.match(/([a-gA-G#b]+)(\d+)/) : null;
    let noteValue = 0;

    if (noteNumber) {
      const noteName = noteNumber[1];
      const octave = parseInt(noteNumber[2]);

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

      noteValue = noteMap[noteName] + (octave - 4) * 12;
    }

    this.frequency = A4 * semitoneRatio ** noteValue;
    //--- Get the frequency---

    const phaseIncrement = (this.frequency * 2 * Math.PI) / sampleRate;

    try {
      for (let i = 0; i < channel.length; i++) {
        let sample = 0;

        // Oscillator selection
        if (this.oscillatorType === "sine") {
          sample = Math.sin(this.phase);
        } else if (this.oscillatorType === "square") {
          sample = this.phase < Math.PI ? 1 : -1;
        } else if (this.oscillatorType === "sawtooth") {
          sample = 2 * (this.phase / (2 * Math.PI)) - 1;
        } else if (this.oscillatorType === "triangle") {
          sample = (2 / Math.PI) * Math.asin(Math.sin(this.phase));
        }

        channel[i] = sample * this.velocity;
        this.phase += phaseIncrement;
        if (this.phase > 2 * Math.PI) {
          this.phase -= 2 * Math.PI;
        }
      }
    } catch (error) {
      console.error("Error in process method:", error);
    }

    return true;
  }
}

registerProcessor("fretboard-processor", FretboardProcessor);
