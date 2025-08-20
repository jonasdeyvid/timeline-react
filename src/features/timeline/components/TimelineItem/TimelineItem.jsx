import React, { useState } from 'react';
import './TimelineItem.css';

function TimelineItem({ item, onNameChange }) {
  const { position, name, start, end, id } = item;
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);

  const handleClick = (e) => {
    e.stopPropagation();
    console.log('Timeline item clicked:', { id, name, start, end });
  };

  const handleNameDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingName(name);
  };

  const handleNameSubmit = () => {
    if (editingName.trim() && editingName !== name) {
      onNameChange(id, editingName.trim());
    }
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setEditingName(name);
    setIsEditing(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const handleNameBlur = () => {
    handleNameSubmit();
  };

  const itemClasses = [
    'timeline-item',
    position.needsMultiLine ? 'multi-line' : '',
    position.isShortDuration ? 'short-duration' : '',
    position.width > position.originalWidth ? 'relaxed' : '',
    isEditing ? 'editing' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={itemClasses}
      style={{
        left: `${position.left}%`,
        width: `${position.width}%`,
        //height: `${position.recommendedHeight}px`,
      }}
      onClick={handleClick}
      title={`${name}\n${start} - ${end}\nDuration: ${position.duration} day(s)${position.width > position.originalWidth ? '\n(Relaxed width)' : ''}`}
    >
      <div className="timeline-item-content">
        <div className="timeline-item-section timeline-item-name-section">
          {isEditing ? (
            <input
              type="text"
              className="timeline-item-name-input"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              onBlur={handleNameBlur}
              autoFocus
              maxLength={50}
            />
          ) : (
            <span 
              className="timeline-item-name" 
              onDoubleClick={handleNameDoubleClick}
              title="Double-click to edit"
            >
              {name}
            </span>
          )}
        </div>
        
        <div className="timeline-item-section timeline-item-duration-section">
          <span className="timeline-item-duration">
            {position.duration} day{position.duration > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="timeline-item-section timeline-item-dates-section">
          <div className="timeline-item-dates">
            {position.duration === 1 ? start : `${start} - ${end}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineItem;
