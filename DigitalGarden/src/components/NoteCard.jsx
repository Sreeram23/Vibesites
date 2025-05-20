import React from 'react';

function NoteCard({ note, isSelected, onClick }) {
  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get a preview of the content (first 100 characters)
  const contentPreview = note.content.length > 100 
    ? `${note.content.substring(0, 100)}...` 
    : note.content;

  return (
    <div 
      className={`note-card ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <span className="visibility-indicator">
          {note.isPublic ? '🌐' : '🔒'}
        </span>
      </div>
      
      <p className="note-preview">{contentPreview}</p>
      
      <div className="note-card-footer">
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <div className="note-date">
          {formatDate(note.updatedAt)}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
