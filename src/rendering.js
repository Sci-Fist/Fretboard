// rendering.js
// Handles the rendering of the tab

import config from '../config.js'; // Import config

const stringLabels = ["E", "A", "D", "G", "B", "e"]; // String labels

/**
 * Renders the guitar tab in the tab display area.
 * @param {object} tabData - The tab data object.
 */
function renderTab(tabData) {
    const tabDisplay = document.getElementById("tab-display");
    if (!tabDisplay) {
        console.error("rendering.js: tabDisplay element not found!");
        return;
    }
    tabDisplay.innerHTML = ""; // Clear the tab display

    if (!tabData.measures || tabData.measures.length === 0) {
        return; // Exit if there are no measures
    }

    tabData.measures.forEach((measure, measureIndex) => {
        const measureDiv = document.createElement("div");
        measureDiv.className = "measure";

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";

            // Add string label
            const labelDiv = document.createElement("div");
            labelDiv.className = "string-label";
            labelDiv.textContent = stringLabels[stringIndex];
            stringDiv.appendChild(labelDiv);

            // Add visual string representation (horizontal line)
            const stringLine = document.createElement("div");
            stringLine.className = "string-line";
            stringDiv.appendChild(stringLine);

            // Create frets for the current string
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";
                fretDiv.contentEditable = true;
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || ""; // Set the fret text content
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
}

export { renderTab };
