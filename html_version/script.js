document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
    addMeasure();
});

function addMeasure() {
    const tabDisplay = document.getElementById('tab-display');
    const measure = document.createElement('div');
    measure.className = 'measure';

    for (let i = 0; i < 6; i++) {
        const string = document.createElement('div');
        string.className = 'string';
        for (let j = 0; j < 4; j++) {
            const fret = document.createElement('div');
            fret.className = 'fret';
            fret.contentEditable = true;
            fret.oninput = (e) => {
                e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '');
            };
            string.appendChild(fret);
        }
        measure.appendChild(string);
    }

    tabDisplay.appendChild(measure);
}

function clearTab() {
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = '';
}

function exportTab() {
    const tabDisplay = document.getElementById('tab-display');
    const measures = tabDisplay.querySelectorAll('.measure');
    let tabText = '';

    measures.forEach(measure => {
        const strings = measure.querySelectorAll('.string');
        strings.forEach(string => {
            const frets = string.querySelectorAll('.fret');
            frets.forEach(fret => {
                tabText += fret.textContent || '-';
                tabText += ' ';
            });
            tabText += '\n';
        });
        tabText += '\n';
    });

    const blob = new Blob([tabText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tab.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
