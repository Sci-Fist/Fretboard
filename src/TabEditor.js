import React, { useState } from 'react';

function TabEditor() {
  const [tabContent, setTabContent] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [chordInput, setChordInput] = useState('');

  const addNote = () => {
    setTabContent([...tabContent, noteInput || 'Note']);
    setNoteInput('');
  };

  const addChord = () => {
    setTabContent([...tabContent, chordInput || 'Chord']);
    setChordInput('');
  };

  const clearTab = () => {
    setTabContent([]);
  };

  return (
    <div className="tab-editor">
      {/* Tab Display Area */}
      <div className="tab-display">
        {tabContent.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>

      {/* Tool Bar Area */}
      <div className="tool-bar">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Enter note"
        />
        <button onClick={addNote}>Add Note</button>
        <input
          type="text"
          value={chordInput}
          onChange={(e) => setChordInput(e.target.value)}
          placeholder="Enter chord"
        />
        <button onClick={addChord}>Add Chord</button>
        <button onClick={clearTab}>Clear Tab</button>
      </div>
    </div>
  );
}

export default TabEditor;
