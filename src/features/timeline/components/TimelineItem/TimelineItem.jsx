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

  // Determine classes based on item properties
  const itemClasses = [
    'timeline-item',
    position.needsMultiLine ? 'multi-line' : '',
    position.isShortDuration ? 'short-duration' : '',
    position.width > position.originalWidth ? 'relaxed' : ''
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
        {/* Item Name Section */}
        <div className="timeline-item-section timeline-item-name-section">
          <span className="timeline-item-name">{name}</span>
        </div>
        
        {/* Duration Section */}
        <div className="timeline-item-section timeline-item-duration-section">
          <span className="timeline-item-duration">
            {position.duration} day{position.duration > 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Dates Section */}
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
