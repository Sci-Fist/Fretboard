document.addEventListener('DOMContentLoaded', () => {
    console.log('Guitar Tab Editor loaded');
});

function addNote() {
    const tabDisplay = document.getElementById('tab-display');
    const note = document.createElement('div');
    note.textContent = 'Note';
    tabDisplay.appendChild(note);
}

function addChord() {
    const tabDisplay = document.getElementById('tab-display');
    const chord = document.createElement('div');
    chord.textContent = 'Chord';
    tabDisplay.appendChild(chord);
}
