import React, { useState } from 'react';

function TabEditor() {
  const [tabContent, setTabContent] = useState([]);

  const addNote = () => {
    setTabContent([...tabContent, 'Note']);
  };

  const addChord = () => {
    setTabContent([...tabContent, 'Chord']);
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
        <button onClick={addNote}>Add Note</button>
        <button onClick={addChord}>Add Chord</button>
      </div>
    </div>
  );
}

export default TabEditor;
