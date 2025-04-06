document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
});

function addNote() {
    const tabDisplay = document.getElementById('tab-display');
    const noteInput = document.getElementById('note-input');
    const note = document.createElement('div');
    note.textContent = noteInput.value || 'Note';
    tabDisplay.appendChild(note);
    noteInput.value = '';
}

function addChord() {
    const tabDisplay = document.getElementById('tab-display');
    const chordInput = document.getElementById('chord-input');
    const chord = document.createElement('div');
    chord.textContent = chordInput.value || 'Chord';
    tabDisplay.appendChild(chord);
    chordInput.value = '';
}

function addTab() {
    const tabDisplay = document.getElementById('tab-display');
    const tabInput = document.getElementById('tab-input');
    const tab = document.createElement('div');
    tab.className = 'tab';
    const lines = tabInput.value.split('\n');
    lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'tab-line';
        lineDiv.textContent = line;
        tab.appendChild(lineDiv);
    });
    tabDisplay.appendChild(tab);
    tabInput.value = '';
}

function clearTab() {
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = '';
}
