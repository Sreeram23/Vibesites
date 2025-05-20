import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';

function RightPanel({ selectedNote, updateNote, deleteNote, notes }) {
  const [editedNote, setEditedNote] = useState(null);
  
  // Update local state when selected note changes
  useEffect(() => {
    setEditedNote(selectedNote);
  }, [selectedNote]);
  
  // Handle when no note is selected
  if (!editedNote) {
    return (
      <div className="right-panel empty-state">
        <div className="empty-editor">
          <h2>No Note Selected</h2>
          <p>Select a note from the list or create a new one</p>
        </div>
      </div>
    );
  }
  
  // Handle title change
  const handleTitleChange = (e) => {
    setEditedNote({
      ...editedNote,
      title: e.target.value
    });
  };
  
  // Handle content change
  const handleContentChange = (newContent) => {
    setEditedNote({
      ...editedNote,
      content: newContent
    });
  };
  
  // Handle visibility toggle
  const handleVisibilityToggle = () => {
    setEditedNote({
      ...editedNote,
      isPublic: !editedNote.isPublic
    });
  };
  
  // Handle tag change
  const handleTagChange = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();
      
      if (!editedNote.tags.includes(newTag)) {
        setEditedNote({
          ...editedNote,
          tags: [...editedNote.tags, newTag]
        });
      }
      
      e.target.value = '';
    }
  };
  
  // Handle tag removal
  const handleTagRemove = (tagToRemove) => {
    setEditedNote({
      ...editedNote,
      tags: editedNote.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Save changes
  const saveChanges = () => {
    // Process content to extract connections
    const connections = [];
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    
    while ((match = regex.exec(editedNote.content)) !== null) {
      const linkedTitle = match[1].trim();
      const linkedNote = notes.find(note => 
        note.title.toLowerCase() === linkedTitle.toLowerCase()
      );
      
      if (linkedNote && linkedNote.id !== editedNote.id) {
        connections.push(linkedNote.id);
      }
    }
    
    // Update note with new connections
    updateNote({
      ...editedNote,
      connections: [...new Set(connections)]
    });
  };
  
  // Auto-save when note changes
  useEffect(() => {
    if (editedNote && selectedNote && editedNote.id === selectedNote.id) {
      const timeoutId = setTimeout(() => {
        saveChanges();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [editedNote]);

  return (
    <div className="right-panel">
      <div className="editor-header">
        <input
          type="text"
          className="note-title-input"
          value={editedNote.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
        />
        
        <div className="editor-controls">
          <button 
            className={`visibility-toggle ${editedNote.isPublic ? 'public' : 'private'}`}
            onClick={handleVisibilityToggle}
            aria-label={editedNote.isPublic ? "Make private" : "Make public"}
          >
            {editedNote.isPublic ? '🌐' : '🔒'}
          </button>
          
          <button 
            className="delete-note" 
            onClick={() => deleteNote(editedNote.id)}
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="tags-editor">
        <div className="tags-list">
          {editedNote.tags.map(tag => (
            <span key={tag} className="tag">
              #{tag}
              <button 
                className="remove-tag" 
                onClick={() => handleTagRemove(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        
        <input
          type="text"
          className="tag-input"
          placeholder="Add tag..."
          onKeyDown={handleTagChange}
        />
      </div>
      
      <MarkdownEditor 
        content={editedNote.content} 
        onChange={handleContentChange}
        notes={notes}
      />
      
      <div className="note-metadata">
        <span>Created: {new Date(editedNote.createdAt).toLocaleString()}</span>
        <span>Updated: {new Date(editedNote.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default RightPanel;
