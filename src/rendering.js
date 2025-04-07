// rendering.js
// Handles the rendering of the tab

import config from "./config.js";

const stringLabels = ["E", "A", "D", "G", "B", "e"]; // String labels

/**
 * Renders the guitar tab in the tab display area.
 * @param {object} tabData - The tab data object.
 */
function renderTab(tabData) {
  console.log("rendering.js: renderTab called");
  console.log("rendering.js: tabData in renderTab:", tabData);
  const tabDisplay = document.getElementById("tab-display");
  console.log("rendering.js: tabDisplay element:", tabDisplay);
  if (!tabDisplay) {
    console.error("rendering.js: tabDisplay element not found!");
    return;
  }
  tabDisplay.innerHTML = ""; // Clear the tab display
  console.log("rendering.js: tabDisplay innerHTML cleared");

  if (!tabData.measures || tabData.measures.length === 0) {
    console.log("rendering.js: No measures to render.");
    return; // Exit if there are no measures
  }

  tabData.measures.forEach((measure, measureIndex) => {
    console.log(
      "rendering.js: Rendering measure:",
      measureIndex,
      measure,
    );
    const measureDiv = document.createElement("div");
    measureDiv.className = "measure";
    console.log("rendering.js: Created measureDiv:", measureDiv);

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      // Create a div for each string
      const stringDiv = document.createElement("div");
      stringDiv.className = "string";
      console.log("rendering.js: Created stringDiv:", stringDiv);

      // Add string label
      const labelDiv = document.createElement("div");
      labelDiv.className = "string-label";
      labelDiv.textContent = stringLabels[stringIndex];
      stringDiv.appendChild(labelDiv);
      console.log("rendering.js: Added string label:", labelDiv);

      // Add visual string representation (horizontal line)
      const stringLine = document.createElement("div");
      stringLine.className = "string-line";
      stringDiv.appendChild(stringLine);
      console.log("rendering.js: Added stringLine:", stringLine);

      // Create frets for the current string
      for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
        const fretDiv = document.createElement("div");
        fretDiv.className = "fret";
        fretDiv.contentEditable = true;
        fretDiv.dataset.measure = measureIndex;
        fretDiv.dataset.string = stringIndex;
        fretDiv.dataset.fret = fretIndex;
        const fretValue = measure.strings[stringIndex][fretIndex] || "";
        fretDiv.textContent = fretValue; // Set the fret text content
        console.log(
          "rendering.js: Created fretDiv:",
          fretDiv,
          "with content:",
          fretDiv.textContent,
        );
        stringDiv.appendChild(fretDiv);
        console.log("rendering.js: Added fretDiv to stringDiv");
      }
      measureDiv.appendChild(stringDiv);
      console.log("rendering.js: Added stringDiv to measureDiv");
    }
    tabDisplay.appendChild(measureDiv);
    console.log("rendering.js: Added measureDiv to tabDisplay");
  });
  console.log("rendering.js: renderTab finished");
}

export { renderTab };
