class FretboardProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.port.onmessage = (event) => {
      console.log(event.data);
    }
  }

  process(inputs, outputs, parameters) {
    try {
      // By default, the node has single input and output.
      let input = inputs[0];
      let output = outputs[0];

      for (let channel = 0; channel < output.length; ++channel) {
        for (let i = 0; i < output[channel].length; ++i) {
          output[channel][i] = input[channel][i];
        }
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
registerProcessor('fretboard-processor', FretboardProcessor);
}
