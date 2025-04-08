// src/rendering.js
// Functions for rendering the tab to the DOM

/**
 * Renders the tab data to the tab display.
 * @param {object} tabData - The tab data object.
 */
export function renderTab(tabData) {
    console.log("rendering.js: renderTab called with data:", JSON.stringify(tabData));
    console.log("rendering.js: tabData.isMeasureRotated:", tabData.isMeasureRotated);

    const tabDisplay = document.getElementById("tab-display");
    if (!tabDisplay) {
        console.error("rendering.js: tabDisplay element not found!");
        return;
    }
    tabDisplay.innerHTML = ""; // Clear the tab display

    if (!tabData.measures || tabData.measures.length === 0) return;

    tabData.measures.forEach((measure, measureIndex) => {
        const measureDiv = document.createElement('div');
        measureDiv.className = 'measure';
        measureDiv.dataset.measureIndex = measureIndex;

        const measureHeader = document.createElement('div');
        measureHeader.className = 'measure-header';
        measureHeader.innerHTML = `<span>${measure.name}</span> - <span>${measure.timeSignature}</span>`;
        measureDiv.appendChild(measureHeader);

        const beatsPerMeasure = parseInt(measure.timeSignature.split('/')[0], 10);

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const stringDiv = document.createElement('div');
            stringDiv.className = 'tab-string';
            stringDiv.dataset.stringIndex = stringIndex;

            // String label (E, A, D, G, B, e)
            const stringLabel = document.createElement('span');
            stringLabel.className = 'string-label';
            stringLabel.textContent = ['E', 'A', 'D', 'G', 'B', 'e'][stringIndex];
            stringDiv.appendChild(stringLabel);

            // Frets - now dynamically generated based on beatsPerMeasure
            for (let fretIndex = 0; fretIndex < beatsPerMeasure; fretIndex++) {
                const fret = document.createElement('span');
                fret.className = 'fret';
                fret.textContent = measure.strings[stringIndex][fretIndex] || '-';
                fret.contentEditable = 'true';
                fret.dataset.measure = measureIndex;
                fret.dataset.string = stringIndex;
                fret.dataset.fret = fretIndex;
                fret.id = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fret.tabIndex = 0;
                stringDiv.appendChild(fret);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
    console.log("rendering.js: Tab rendering complete.");
}
