// src/rendering.js
// Functions for rendering the tab to the DOM

/**
 * Renders the tab data to the tab display.
 * @param {object} tabData - The tab data object.
 */
export function renderTab(tabData) {
    console.log("rendering.js: renderTab called with data:", JSON.stringify(tabData)); // Log entry and data
    console.log("rendering.js: tabData.isMeasureRotated:", tabData.isMeasureRotated); // ADDED LOG
    const tabDisplay = document.getElementById("tab-display");
    if (!tabDisplay) {
        console.error("rendering.js: tabDisplay element not found!");
        return;
    }
    tabDisplay.innerHTML = ""; // Clear the tab display

    if (!tabData.measures || tabData.measures.length === 0) {
        return; // Exit if there are no measures
    }

    const isRotated = tabData.isMeasureRotated || false; // Get rotation state from tabData
    const timeSignature = tabData.timeSignature || '4/4'; // Default to 4/4 if not set
    const [beats, noteValue] = timeSignature.split('/').map(Number);
    const fretsPerMeasure = beats; // Use beats for the number of frets

    tabData.measures.forEach((measure, measureIndex) => {
        const measureDiv = document.createElement("div");
        measureDiv.className = "measure";
        if (isRotated) {
            measureDiv.classList.add('rotated-measure'); // Add class for rotation
        }

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";
            if (isRotated) {
                stringDiv.classList.add('rotated-string'); // Add class for rotated string layout
            }

            // Add string label
            const stringLabel = document.createElement("div");
            stringLabel.className = "string-label";
            stringLabel.textContent = ["E", "A", "D", "G", "B", "e"][stringIndex];
            stringDiv.appendChild(stringLabel);

            // Add visual string representation (horizontal line)
            const stringLine = document.createElement("div");
            stringLine.className = "string-line";
            stringDiv.appendChild(stringLine);

            for (let fretIndex = 0; fretIndex < fretsPerMeasure; fretIndex++) { // Use beatsPerMeasure here
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";
                if (isRotated) {
                    fretDiv.classList.add('rotated-fret'); // Add class for rotated fret layout
                }
                fretDiv.contentEditable = true;
                fretDiv.role = "textbox"; // Accessibility: Identify as text input
                fretDiv.inputMode = "numeric"; // Accessibility: Suggest numeric keyboard on mobile
                // fretDiv.pattern = "[0-9]*"; // Pattern doesn't work directly on contentEditable
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.id = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.name = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || "-"; // Set the fret text content, default to '-'
                fretDiv.setAttribute('tabindex', '0'); // Make the frets focusable
                fretDiv.setAttribute('aria-label', `Fret ${fretDiv.textContent || 'empty'}`); // Provide accessible label
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });

    // After rendering, re-apply active-fret class if needed (e.g., after re-render on input)
    const activeFretId = localStorage.getItem('activeFretId');
    if (activeFretId) {
        const activeFret = document.getElementById(activeFretId);
        if (activeFret) {
            activeFret.classList.add('active-fret');
        }
    }
}
