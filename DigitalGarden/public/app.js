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

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const tagsContainer = document.getElementById('tags-container');
const addNoteButton = document.getElementById('add-note-button');
const notesList = document.getElementById('notes-list');
const notesTitle = document.getElementById('notes-title');
const listViewButton = document.getElementById('list-view-button');
const graphViewButton = document.getElementById('graph-view-button');
const graphView = document.getElementById('graph-view');
const graphCanvas = document.getElementById('graph-canvas');
const emptyEditor = document.getElementById('empty-editor');
const noteEditor = document.getElementById('note-editor');
const noteTitleInput = document.getElementById('note-title-input');
const visibilityToggle = document.getElementById('visibility-toggle');
const deleteNoteButton = document.getElementById('delete-note');
const noteTagsList = document.getElementById('note-tags-list');
const tagInput = document.getElementById('tag-input');
const markdownTextarea = document.getElementById('markdown-textarea');
const markdownPreview = document.getElementById('markdown-preview');
const previewButton = document.getElementById('preview-button');
const createdDate = document.getElementById('created-date');
const updatedDate = document.getElementById('updated-date');

// State
let notes = JSON.parse(localStorage.getItem('digitalGardenNotes')) || initialNotes;
let selectedNoteId = null;
let darkMode = localStorage.getItem('darkMode') === 'true';
let viewMode = 'list';
let filters = {
  searchQuery: '',
  selectedTags: [],
  showPublicOnly: false,
  showPrivateOnly: false
};

// Initialize the app
function init() {
  // Apply dark mode if enabled
  if (darkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
  
  // Render notes
  renderNotes();
  
  // Render tags
  renderTags();
  
  // Set up event listeners
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleDarkMode);
  
  // Search
  searchInput.addEventListener('input', handleSearch);
  clearSearch.addEventListener('click', clearSearchInput);
  
  // Navigation
  document.querySelectorAll('.main-nav button').forEach(button => {
    button.addEventListener('click', () => handleNavigation(button.dataset.filter));
  });
  
  // View toggle
  listViewButton.addEventListener('click', () => setViewMode('list'));
  graphViewButton.addEventListener('click', () => setViewMode('graph'));
  
  // Add note
  addNoteButton.addEventListener('click', createNewNote);
  
  // Note editor
  noteTitleInput.addEventListener('input', handleTitleChange);
  visibilityToggle.addEventListener('click', toggleVisibility);
  deleteNoteButton.addEventListener('click', deleteSelectedNote);
  markdownTextarea.addEventListener('input', handleContentChange);
  previewButton.addEventListener('click', togglePreview);
  
  // Tag input
  tagInput.addEventListener('keydown', handleTagInput);
  
  // Editor toolbar
  document.getElementById('h1-button').addEventListener('click', () => insertMarkdown('# '));
  document.getElementById('h2-button').addEventListener('click', () => insertMarkdown('## '));
  document.getElementById('bold-button').addEventListener('click', () => insertMarkdown('**Bold**'));
  document.getElementById('italic-button').addEventListener('click', () => insertMarkdown('*Italic*'));
  document.getElementById('list-button').addEventListener('click', () => insertMarkdown('- '));
  document.getElementById('link-button').addEventListener('click', () => insertMarkdown('[[Note Title]]'));
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = darkMode ? '☀️' : '🌙';
  localStorage.setItem('darkMode', darkMode);
}

// Handle search
function handleSearch() {
  filters.searchQuery = searchInput.value.trim().toLowerCase();
  clearSearch.style.display = filters.searchQuery ? 'block' : 'none';
  renderNotes();
}

// Clear search input
function clearSearchInput() {
  searchInput.value = '';
  filters.searchQuery = '';
  clearSearch.style.display = 'none';
  renderNotes();
}

// Handle navigation
function handleNavigation(filter) {
  // Update active button
  document.querySelectorAll('.main-nav button').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  
  // Update filters
  filters.showPublicOnly = filter === 'public';
  filters.showPrivateOnly = filter === 'private';
  
  // Update title
  updateNotesTitle();
  
  // Render notes
  renderNotes();
}

// Update notes title
function updateNotesTitle() {
  if (filters.searchQuery) {
    notesTitle.textContent = `Search: ${filters.searchQuery}`;
  } else if (filters.selectedTags.length > 0) {
    notesTitle.textContent = `Tags: ${filters.selectedTags.map(tag => `#${tag}`).join(', ')}`;
  } else if (filters.showPublicOnly) {
    notesTitle.textContent = 'Public Notes';
  } else if (filters.showPrivateOnly) {
    notesTitle.textContent = 'Private Notes';
  } else {
    notesTitle.textContent = 'All Notes';
  }
}

// Set view mode
function setViewMode(mode) {
  viewMode = mode;
  
  // Update active button
  listViewButton.classList.toggle('active', mode === 'list');
  graphViewButton.classList.toggle('active', mode === 'graph');
  
  // Show/hide views
  notesList.style.display = mode === 'list' ? 'flex' : 'none';
  graphView.style.display = mode === 'graph' ? 'flex' : 'none';
  
  // Render graph if needed
  if (mode === 'graph') {
    renderGraph();
  }
}

// Render notes
function renderNotes() {
  // Filter notes
  const filteredNotes = notes.filter(note => {
    // Filter by search query
    const matchesSearch = !filters.searchQuery || 
      note.title.toLowerCase().includes(filters.searchQuery) || 
      note.content.toLowerCase().includes(filters.searchQuery);
    
    // Filter by tags
    const matchesTags = filters.selectedTags.length === 0 || 
      filters.selectedTags.every(tag => note.tags.includes(tag));
    
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
  
  // Clear notes list
  notesList.innerHTML = '';
  
  // Render notes or empty state
  if (sortedNotes.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <p>No notes found</p>
      ${filters.searchQuery || filters.selectedTags.length > 0 || filters.showPublicOnly || filters.showPrivateOnly ? 
        '<p>Try adjusting your filters</p>' : ''}
    `;
    notesList.appendChild(emptyState);
  } else {
    sortedNotes.forEach(note => {
      const noteCard = createNoteCard(note);
      notesList.appendChild(noteCard);
    });
  }
  
  // Update graph if in graph view
  if (viewMode === 'graph') {
    renderGraph();
  }
}

// Create note card
function createNoteCard(note) {
  const noteCard = document.createElement('div');
  noteCard.className = `note-card ${note.id === selectedNoteId ? 'selected' : ''}`;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get content preview
  const contentPreview = note.content.length > 100 
    ? `${note.content.substring(0, 100)}...` 
    : note.content;
  
  // Create note card HTML
  noteCard.innerHTML = `
    <div class="note-card-header">
      <h3 class="note-title">${note.title}</h3>
      <span class="visibility-indicator">${note.isPublic ? '🌐' : '🔒'}</span>
    </div>
    <p class="note-preview">${contentPreview}</p>
    <div class="note-card-footer">
      <div class="note-tags">
        ${note.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
      </div>
      <div class="note-date">${formatDate(note.updatedAt)}</div>
    </div>
  `;
  
  // Add click event
  noteCard.addEventListener('click', () => selectNote(note.id));
  
  return noteCard;
}

// Render tags
function renderTags() {
  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags))];
  
  // Clear tags container
  tagsContainer.innerHTML = '';
  
  // Render tags or empty state
  if (allTags.length === 0) {
    tagsContainer.innerHTML = '<p class="empty-state">No tags yet</p>';
  } else {
    allTags.forEach(tag => {
      const tagButton = document.createElement('button');
      tagButton.className = `tag ${filters.selectedTags.includes(tag) ? 'selected' : ''}`;
      tagButton.textContent = `#${tag}`;
      tagButton.addEventListener('click', () => toggleTagSelection(tag));
      tagsContainer.appendChild(tagButton);
    });
  }
}
