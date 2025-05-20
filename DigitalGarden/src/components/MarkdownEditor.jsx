import React, { useState, useEffect, useRef } from 'react';

function MarkdownEditor({ content, onChange, notes }) {
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef(null);
  
  // Simple markdown to HTML conversion
  const markdownToHtml = (markdown) => {
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
  };
  
  // Handle editor input
  const handleEditorInput = (e) => {
    onChange(e.target.value);
  };
  
  // Handle tab key in editor
  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === 'Tab' && document.activeElement === editorRef.current) {
        e.preventDefault();
        
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        
        // Insert tab at cursor position
        const newText = content.substring(0, start) + '  ' + content.substring(end);
        onChange(newText);
        
        // Move cursor after the inserted tab
        setTimeout(() => {
          editorRef.current.selectionStart = start + 2;
          editorRef.current.selectionEnd = start + 2;
        }, 0);
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [content, onChange]);

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        <button 
          onClick={() => {
            const newText = content + '# ';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add heading"
        >
          H1
        </button>
        <button 
          onClick={() => {
            const newText = content + '## ';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add subheading"
        >
          H2
        </button>
        <button 
          onClick={() => {
            const newText = content + '**Bold**';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add bold text"
        >
          B
        </button>
        <button 
          onClick={() => {
            const newText = content + '*Italic*';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add italic text"
        >
          I
        </button>
        <button 
          onClick={() => {
            const newText = content + '- ';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add list"
        >
          •
        </button>
        <button 
          onClick={() => {
            const newText = content + '[[Note Title]]';
            onChange(newText);
            editorRef.current.focus();
          }}
          aria-label="Add link to note"
        >
          [[]]
        </button>
        <button 
          className={showPreview ? 'active' : ''}
          onClick={() => setShowPreview(!showPreview)}
          aria-label={showPreview ? "Show editor" : "Show preview"}
        >
          👁️
        </button>
      </div>
      
      {showPreview ? (
        <div 
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
        />
      ) : (
        <textarea
          ref={editorRef}
          className="markdown-textarea"
          value={content}
          onChange={handleEditorInput}
          placeholder="Start writing your note here..."
        />
      )}
    </div>
  );
}

export default MarkdownEditor;
