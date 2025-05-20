import React from 'react';
import NoteCard from './NoteCard';
import GraphView from './GraphView';

function MiddlePanel({ 
  notes, 
  selectedNoteId, 
  setSelectedNoteId, 
  viewMode, 
  setViewMode, 
  filters 
}) {
  // Filter notes based on filters
  const filteredNotes = notes.filter(note => {
    // Filter by search query
    const matchesSearch = filters.searchQuery 
      ? note.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(filters.searchQuery.toLowerCase())
      : true;
    
    // Filter by tags
    const matchesTags = filters.selectedTags.length > 0 
      ? filters.selectedTags.every(tag => note.tags.includes(tag))
      : true;
    
    // Filter by visibility
    const matchesVisibility = 
      (filters.showPublicOnly && note.isPublic) ||
      (filters.showPrivateOnly && !note.isPublic) ||
      (!filters.showPublicOnly && !filters.showPrivateOnly);
    
    return matchesSearch && matchesTags && matchesVisibility;
  });

  // Sort notes by last updated
  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="middle-panel">
      <div className="panel-header">
        <h2>
          {filters.searchQuery 
            ? `Search: ${filters.searchQuery}` 
            : filters.selectedTags.length > 0 
              ? `Tags: ${filters.selectedTags.map(tag => `#${tag}`).join(', ')}` 
              : filters.showPublicOnly 
                ? 'Public Notes' 
                : filters.showPrivateOnly 
                  ? 'Private Notes' 
                  : 'All Notes'}
        </h2>
        <div className="view-toggle">
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            📝
          </button>
          <button 
            className={viewMode === 'graph' ? 'active' : ''} 
            onClick={() => setViewMode('graph')}
            aria-label="Graph view"
          >
            🕸️
          </button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="notes-list">
          {sortedNotes.length > 0 ? (
            sortedNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                isSelected={note.id === selectedNoteId}
                onClick={() => setSelectedNoteId(note.id)}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No notes found</p>
              {filters.searchQuery || filters.selectedTags.length > 0 || filters.showPublicOnly || filters.showPrivateOnly ? (
                <p>Try adjusting your filters</p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <GraphView 
          notes={notes} 
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
          filteredNotes={filteredNotes}
        />
      )}
    </div>
  );
}

export default MiddlePanel;
