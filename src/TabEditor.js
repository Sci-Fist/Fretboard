import React, { useState } from 'react';

function TabEditor() {
  const [tabContent, setTabContent] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [chordInput, setChordInput] = useState('');
  const [tabInput, setTabInput] = useState('');

  const addNote = () => {
    setTabContent([...tabContent, noteInput || 'Note']);
    setNoteInput('');
  };

  const addChord = () => {
    setTabContent([...tabContent, chordInput || 'Chord']);
    setChordInput('');
  };

  const addTab = () => {
    setTabContent([...tabContent, tabInput || 'Tab']);
    setTabInput('');
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
        <textarea
          value={tabInput}
          onChange={(e) => setTabInput(e.target.value)}
          placeholder="Enter tab numbers"
        />
        <button onClick={addTab}>Add Tab</button>
        <button onClick={clearTab}>Clear Tab</button>
      </div>
    </div>
  );
}

export default TabEditor;
