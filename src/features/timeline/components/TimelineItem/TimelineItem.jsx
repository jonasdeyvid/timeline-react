import React from 'react';
import './TimelineItem.css';

/**
 * Individual timeline item component
 * @param {Object} item - Timeline item with position data
 */
function TimelineItem({ item }) {
  const { position, name, start, end, id } = item;

  const handleClick = () => {
    console.log('Timeline item clicked:', { id, name, start, end });
  };

  return (
    <div
      className="timeline-item"
      style={{
        left: `${position.left}%`,
        width: `${position.width}%`,
      }}
      onClick={handleClick}
      title={`${name}\n${start} - ${end}\nDuration: ${position.duration} day(s)`}
    >
      <div className="timeline-item-content">
        <span className="timeline-item-name">{name}</span>
        <div className="timeline-item-dates">
          {position.duration === 1 ? start : `${start} - ${end}`}
        </div>
      </div>
    </div>
  );
}

export default TimelineItem;
