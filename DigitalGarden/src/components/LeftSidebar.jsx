import React from 'react';
import SearchBar from './SearchBar';
import TagCloud from './TagCloud';

function LeftSidebar({ 
  notes, 
  createNote, 
  darkMode, 
  toggleDarkMode, 
  filters, 
  setFilters 
}) {
  // Extract all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags))];
  
  // Handle navigation item click
  const handleNavItemClick = (filter) => {
    setFilters({ ...filters, ...filter });
  };
  
  // Handle search query change
  const handleSearchChange = (query) => {
    setFilters({ ...filters, searchQuery: query });
  };
  
  // Handle tag selection
  const handleTagSelect = (tag) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    setFilters({ ...filters, selectedTags });
  };

  return (
    <div className="left-sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Digital Garden</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <SearchBar 
        value={filters.searchQuery} 
        onChange={handleSearchChange} 
      />
      
      <nav className="main-nav">
        <ul>
          <li>
            <button 
              className={!filters.showPublicOnly && !filters.showPrivateOnly ? 'active' : ''} 
              onClick={() => handleNavItemClick({ showPublicOnly: false, showPrivateOnly: false })}
            >
              🌱 All Notes
            </button>
          </li>
          <li>
            <button 
              className={filters.selectedTags.length > 0 ? 'active' : ''} 
              onClick={() => setFilters({ ...filters, selectedTags: [] })}
            >
              🏷️ Tags
            </button>
          </li>
          <li>
            <button>📅 Daily Notes</button>
          </li>
          <li>
            <button 
              className={filters.showPublicOnly ? 'active' : ''} 
              onClick={() => handleNavItemClick({ showPublicOnly: true, showPrivateOnly: false })}
            >
              🌐 Public Notes
            </button>
          </li>
          <li>
            <button 
              className={filters.showPrivateOnly ? 'active' : ''} 
              onClick={() => handleNavItemClick({ showPublicOnly: false, showPrivateOnly: true })}
            >
              🔒 Private Notes
            </button>
          </li>
        </ul>
      </nav>
      
      <TagCloud 
        tags={allTags} 
        selectedTags={filters.selectedTags} 
        onTagSelect={handleTagSelect} 
      />
      
      <button className="add-note-button" onClick={createNote}>
        + Add New Note
      </button>
    </div>
  );
}

export default LeftSidebar;
