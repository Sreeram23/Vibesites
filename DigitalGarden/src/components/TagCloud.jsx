import React from 'react';

function TagCloud({ tags, selectedTags, onTagSelect }) {
  if (tags.length === 0) {
    return (
      <div className="tag-cloud">
        <h3>Tags</h3>
        <p className="empty-state">No tags yet</p>
      </div>
    );
  }

  return (
    <div className="tag-cloud">
      <h3>Tags</h3>
      <div className="tags-container">
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => onTagSelect(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TagCloud;
