// Toggle tag selection
function toggleTagSelection(tag) {
  if (filters.selectedTags.includes(tag)) {
    filters.selectedTags = filters.selectedTags.filter(t => t !== tag);
  } else {
    filters.selectedTags.push(tag);
  }
  
  // Update tags
  renderTags();
  
  // Update title
  updateNotesTitle();
  
  // Render notes
  renderNotes();
}

// Create new note
function createNewNote() {
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
  
  // Add note to notes array
  notes.unshift(newNote);
  
  // Save notes
  saveNotes();
  
  // Select the new note
  selectNote(newNote.id);
  
  // Render notes
  renderNotes();
  
  // Render tags
  renderTags();
}

// Select note
function selectNote(noteId) {
  selectedNoteId = noteId;
  
  // Get selected note
  const selectedNote = notes.find(note => note.id === noteId);
  
  // Show/hide editor
  if (selectedNote) {
    emptyEditor.style.display = 'none';
    noteEditor.style.display = 'block';
    
    // Update editor fields
    noteTitleInput.value = selectedNote.title;
    markdownTextarea.value = selectedNote.content;
    visibilityToggle.textContent = selectedNote.isPublic ? '🌐' : '🔒';
    
    // Update dates
    createdDate.textContent = `Created: ${new Date(selectedNote.createdAt).toLocaleString()}`;
    updatedDate.textContent = `Updated: ${new Date(selectedNote.updatedAt).toLocaleString()}`;
    
    // Render note tags
    renderNoteTags();
    
    // Update preview if visible
    if (markdownPreview.style.display !== 'none') {
      updatePreview();
    }
  } else {
    emptyEditor.style.display = 'flex';
    noteEditor.style.display = 'none';
  }
  
  // Update note cards
  document.querySelectorAll('.note-card').forEach(card => {
    card.classList.toggle('selected', card.querySelector('.note-title').textContent === selectedNote?.title);
  });
}

// Render note tags
function renderNoteTags() {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (!selectedNote) return;
  
  // Clear tags list
  noteTagsList.innerHTML = '';
  
  // Render tags
  selectedNote.tags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.innerHTML = `
      #${tag}
      <button class="remove-tag" aria-label="Remove tag ${tag}">✕</button>
    `;
    
    // Add remove tag event
    tagSpan.querySelector('.remove-tag').addEventListener('click', () => removeNoteTag(tag));
    
    noteTagsList.appendChild(tagSpan);
  });
}

// Handle tag input
function handleTagInput(e) {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const newTag = e.target.value.trim().toLowerCase();
    
    // Get selected note
    const selectedNote = notes.find(note => note.id === selectedNoteId);
    
    if (selectedNote && !selectedNote.tags.includes(newTag)) {
      // Add tag to note
      selectedNote.tags.push(newTag);
      
      // Update note
      selectedNote.updatedAt = new Date().toISOString();
      
      // Save notes
      saveNotes();
      
      // Render note tags
      renderNoteTags();
      
      // Render all tags
      renderTags();
      
      // Render notes
      renderNotes();
    }
    
    // Clear input
    e.target.value = '';
  }
}

// Remove note tag
function removeNoteTag(tag) {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (selectedNote) {
    // Remove tag from note
    selectedNote.tags = selectedNote.tags.filter(t => t !== tag);
    
    // Update note
    selectedNote.updatedAt = new Date().toISOString();
    
    // Save notes
    saveNotes();
    
    // Render note tags
    renderNoteTags();
    
    // Render all tags
    renderTags();
    
    // Render notes
    renderNotes();
  }
}

// Handle title change
function handleTitleChange() {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (selectedNote) {
    // Update note title
    selectedNote.title = noteTitleInput.value;
    
    // Update note
    selectedNote.updatedAt = new Date().toISOString();
    
    // Save notes
    saveNotes();
    
    // Render notes
    renderNotes();
  }
}

// Toggle visibility
function toggleVisibility() {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (selectedNote) {
    // Toggle visibility
    selectedNote.isPublic = !selectedNote.isPublic;
    
    // Update button
    visibilityToggle.textContent = selectedNote.isPublic ? '🌐' : '🔒';
    
    // Update note
    selectedNote.updatedAt = new Date().toISOString();
    
    // Save notes
    saveNotes();
    
    // Render notes
    renderNotes();
  }
}

// Delete selected note
function deleteSelectedNote() {
  if (selectedNoteId && confirm('Are you sure you want to delete this note?')) {
    // Remove note from notes array
    notes = notes.filter(note => note.id !== selectedNoteId);
    
    // Clear selected note
    selectedNoteId = null;
    
    // Save notes
    saveNotes();
    
    // Show empty editor
    emptyEditor.style.display = 'flex';
    noteEditor.style.display = 'none';
    
    // Render notes
    renderNotes();
    
    // Render tags
    renderTags();
  }
}

// Handle content change
function handleContentChange() {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (selectedNote) {
    // Update note content
    selectedNote.content = markdownTextarea.value;
    
    // Update note
    selectedNote.updatedAt = new Date().toISOString();
    
    // Process connections
    processConnections(selectedNote);
    
    // Save notes
    saveNotes();
    
    // Update preview if visible
    if (markdownPreview.style.display !== 'none') {
      updatePreview();
    }
  }
}

// Process connections
function processConnections(note) {
  const connections = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  
  while ((match = regex.exec(note.content)) !== null) {
    const linkedTitle = match[1].trim();
    const linkedNote = notes.find(n => 
      n.title.toLowerCase() === linkedTitle.toLowerCase()
    );
    
    if (linkedNote && linkedNote.id !== note.id) {
      connections.push(linkedNote.id);
    }
  }
  
  // Update note connections
  note.connections = [...new Set(connections)];
}

// Toggle preview
function togglePreview() {
  const isPreviewVisible = markdownPreview.style.display !== 'none';
  
  if (isPreviewVisible) {
    markdownPreview.style.display = 'none';
    markdownTextarea.style.display = 'block';
    previewButton.classList.remove('active');
  } else {
    updatePreview();
    markdownPreview.style.display = 'block';
    markdownTextarea.style.display = 'none';
    previewButton.classList.add('active');
  }
}

// Update preview
function updatePreview() {
  // Get selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  if (selectedNote) {
    markdownPreview.innerHTML = markdownToHtml(selectedNote.content);
  }
}

// Insert markdown
function insertMarkdown(text) {
  const textarea = markdownTextarea;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const content = textarea.value;
  
  // Insert text at cursor position
  textarea.value = content.substring(0, start) + text + content.substring(end);
  
  // Move cursor after inserted text
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  
  // Focus textarea
  textarea.focus();
  
  // Trigger content change
  handleContentChange();
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  // Replace headings
  let html = markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Replace bold and italic
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace lists
  html = html
    .replace(/^\s*\n\*/gm, '<ul>\n*')
    .replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2')
    .replace(/^\*(.+)/gm, '<li>$1</li>');
  
  // Replace ordered lists
  html = html
    .replace(/^\s*\n\d\./gm, '<ol>\n1.')
    .replace(/^(\d\..+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2')
    .replace(/^\d\.(.+)/gm, '<li>$1</li>');
  
  // Replace links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Replace wiki-style links
  html = html.replace(/\[\[(.*?)\]\]/g, (match, title) => {
    const linkedNote = notes.find(note => 
      note.title.toLowerCase() === title.toLowerCase()
    );
    
    if (linkedNote) {
      return `<a href="#" class="wiki-link" data-note-id="${linkedNote.id}">${title}</a>`;
    } else {
      return `<a href="#" class="wiki-link new-note">${title}</a>`;
    }
  });
  
  // Replace paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
  });
  
  // Replace line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

// Render graph
function renderGraph() {
  const ctx = graphCanvas.getContext('2d');
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get filtered notes
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
  
  // Set up node positions
  const nodePositions = {};
  const radius = Math.min(width, height) * 0.4;
  const centerX = width / 2;
  const centerY = height / 2;
  
  filteredNotes.forEach((note, index) => {
    const angle = (index / filteredNotes.length) * Math.PI * 2;
    nodePositions[note.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      radius: note.id === selectedNoteId ? 15 : 10
    };
  });
  
  // Draw connections
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  
  filteredNotes.forEach(note => {
    if (!nodePositions[note.id]) return;
    
    const sourcePos = nodePositions[note.id];
    
    note.connections.forEach(targetId => {
      if (nodePositions[targetId]) {
        const targetPos = nodePositions[targetId];
        
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
      }
    });
  });
  
  // Draw nodes
  filteredNotes.forEach(note => {
    if (!nodePositions[note.id]) return;
    
    const pos = nodePositions[note.id];
    
    // Node circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
    
    if (note.id === selectedNoteId) {
      ctx.fillStyle = '#4a9eff';
    } else {
      ctx.fillStyle = note.isPublic ? '#6fcf97' : '#f2994a';
    }
    
    ctx.fill();
    
    // Node label
    ctx.fillStyle = '#333';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(note.title.substring(0, 15), pos.x, pos.y + pos.radius + 15);
  });
  
  // Handle click events
  graphCanvas.onclick = function(e) {
    const rect = graphCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if a node was clicked
    for (const noteId in nodePositions) {
      const pos = nodePositions[noteId];
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      
      if (distance <= pos.radius) {
        selectNote(noteId);
        break;
      }
    }
  };
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('digitalGardenNotes', JSON.stringify(notes));
}

// Initialize the app
init();
