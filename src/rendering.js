// src/rendering.js
// Functions for rendering the tab to the DOM

/**
 * Renders the tab data to the tab display.
 * @param {object} tabData - The tab data object.
 */
export function renderTab(tabData) {
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
            const stringLabel = document.createElement("div");
            stringLabel.className = "string-label";
            stringLabel.textContent = ["E", "A", "D", "G", "B", "e"][stringIndex];
            stringDiv.appendChild(stringLabel);

            // Add visual string representation (horizontal line)
            const stringLine = document.createElement("div");
            stringLine.className = "string-line";
            stringDiv.appendChild(stringLine);

            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";
                fretDiv.contentEditable = true;
                fretDiv.role = "textbox"; // Accessibility: Identify as text input
                fretDiv.inputMode = "numeric"; // Accessibility: Suggest numeric keyboard on mobile
                // fretDiv.pattern = "[0-9]*"; // Pattern doesn't work directly on contentEditable
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
