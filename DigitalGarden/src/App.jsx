import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MiddlePanel from './components/MiddlePanel';
import RightPanel from './components/RightPanel';
import { useLocalStorage } from './hooks/useLocalStorage';

// Sample initial notes data
const initialNotes = [
  {
    id: '1',
    title: 'Welcome to Your Digital Garden',
    content: 'This is your personal knowledge base for cultivating non-linear ideas. Start by creating a new note or exploring the sample notes.',
    tags: ['welcome', 'getting-started'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    connections: ['2', '3']
  },
  {
    id: '2',
    title: 'How to Use This Digital Garden',
    content: '1. Create notes with the + button\n2. Link notes using [[Note Title]] syntax\n3. Add #tags to organize your thoughts\n4. Toggle between public and private notes\n5. Use the graph view to see connections',
    tags: ['tutorial', 'getting-started'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    connections: ['1']
  },
  {
    id: '3',
    title: 'Digital Gardens vs Traditional Notes',
    content: 'Unlike traditional note-taking apps, a digital garden embraces non-linear thinking. Ideas can grow and evolve over time, connecting to each other organically.',
    tags: ['concept', 'philosophy'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    connections: ['1']
  }
];

function App() {
  // State for theme (light/dark mode)
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  
  // State for notes
  const [notes, setNotes] = useLocalStorage('digitalGardenNotes', initialNotes);
  
  // State for selected note
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  
  // State for view mode (list or graph)
  const [viewMode, setViewMode] = useState('list');
  
  // State for filter options
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedTags: [],
    showPublicOnly: false,
    showPrivateOnly: false
  });

  // Get the selected note
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) 
    : null;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create a new note
  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      connections: []
    };
    
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  };

  // Update a note
  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() } 
        : note
    ));
  };

  // Delete a note
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <LeftSidebar 
        notes={notes}
        createNote={createNote}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        filters={filters}
        setFilters={setFilters}
      />
      
      <MiddlePanel 
        notes={notes}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={filters}
      />
      
      <RightPanel 
        selectedNote={selectedNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
        notes={notes}
      />
    </div>
  );
}

export default App;
