import React, { useEffect, useRef } from 'react';

function GraphView({ notes, selectedNoteId, setSelectedNoteId, filteredNotes }) {
  const canvasRef = useRef(null);
  
  // This is a simplified graph visualization
  // In a real implementation, you would use a library like D3.js or Sigma.js
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up node positions (simplified)
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
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if a node was clicked
      for (const noteId in nodePositions) {
        const pos = nodePositions[noteId];
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        
        if (distance <= pos.radius) {
          setSelectedNoteId(noteId);
          break;
        }
      }
    };
    
    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [notes, selectedNoteId, setSelectedNoteId, filteredNotes]);

  return (
    <div className="graph-view">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600}
        className="graph-canvas"
      />
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-color public"></span>
          <span>Public Notes</span>
        </div>
        <div className="legend-item">
          <span className="legend-color private"></span>
          <span>Private Notes</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected Note</span>
        </div>
      </div>
    </div>
  );
}

export default GraphView;
