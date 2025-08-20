import React, { useState, useRef, useCallback } from 'react';
import { addDays, format, differenceInDays } from 'date-fns';
import './TimelineItem.css';

function TimelineItem({ item, onNameChange, onDateChange, timelineData, zoomLevel = 1 }) {
  const { position, name, start, end, id } = item;
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const dragStartX = useRef(0);
  const itemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragTypeRef = useRef(null);
  const finalDatesRef = useRef(null);

  console.log('TimelineItem rendered:', { id, name, timelineData: !!timelineData, onDateChange: !!onDateChange });

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

  const calculateDateFromPosition = useCallback((clientX) => {
    console.log('calculateDateFromPosition called with:', clientX);
    
    if (!itemRef.current) {
      console.log('No itemRef.current');
      return null;
    }
    
    if (!timelineData) {
      console.log('No timelineData');
      return null;
    }
    
    const timelineContainer = itemRef.current.closest('.timeline-lanes');
    if (!timelineContainer) {
      console.log('No timeline container found');
      return null;
    }
    
    const rect = timelineContainer.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = (relativeX / rect.width) * 100;
    
    console.log('Calculating date:', { 
      clientX, 
      rectLeft: rect.left, 
      rectWidth: rect.width,
      relativeX, 
      percentage,
      totalDays: timelineData.totalDays,
      startDate: timelineData.startDate
    });
    
    const totalDays = timelineData.totalDays;
    const dayOffset = Math.round((percentage / 100) * totalDays);
    
    const newDate = addDays(timelineData.startDate, dayOffset);
    console.log('New date calculated:', newDate, 'dayOffset:', dayOffset);
    
    const isExpandingLeft = percentage < -5;
    const isExpandingRight = percentage > 105;
    
    if (isExpandingLeft || isExpandingRight) {
      console.log('Timeline expansion needed:', { isExpandingLeft, isExpandingRight, percentage });
    }
    
    return newDate;
  }, [timelineData]);

  const calculatePositionFromDates = useCallback((startDate, endDate) => {
    if (!timelineData) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timelineStart = timelineData.startDate;
    const totalDays = timelineData.totalDays;
    
    const startOffset = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start) + 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    console.log('Calculate position:', { 
      startDate, 
      endDate, 
      startOffset, 
      duration, 
      left, 
      width,
      isOutsideBounds: left < 0 || left + width > 100
    });
    
    return {
      left: left,
      width: Math.max(0.5, width)
    };
  }, [timelineData]);

  const handleMouseDown = (e, type) => {
    if (isEditing) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Mouse down triggered:', type);
    setIsDragging(true);
    setDragType(type);
    setDragPreview(null);
    setDragPosition(null);
    isDraggingRef.current = true;
    dragTypeRef.current = type;
    finalDatesRef.current = null;
    dragStartX.current = e.clientX;
    
    const handleMouseUpWrapper = (e) => {
      console.log('Mouse up triggered');
      setIsDragging(false);
      setDragType(null);
      setDragPreview(null);
      setDragPosition(null);
      isDraggingRef.current = false;
      dragTypeRef.current = null;
      
      if (finalDatesRef.current && onDateChange) {
        console.log('Final update with:', finalDatesRef.current);
        onDateChange(id, finalDatesRef.current.newStartDate, finalDatesRef.current.newEndDate);
      }
      finalDatesRef.current = null;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpWrapper);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpWrapper);
  };

  const handleMouseMove = useCallback((e) => {
    console.log('handleMouseMove called:', { 
      isDragging: isDraggingRef.current, 
      dragType: dragTypeRef.current 
    });
    
    if (!isDraggingRef.current || !dragTypeRef.current) {
      console.log('Not dragging or no drag type');
      return;
    }
    
    console.log('Mouse move:', dragTypeRef.current, e.clientX);
    
    const newDate = calculateDateFromPosition(e.clientX);
    if (!newDate) {
      console.log('Could not calculate new date');
      return;
    }
    
    console.log('Calculated new date:', newDate);
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = differenceInDays(endDate, startDate);
    
    let newStartDate, newEndDate;
    
    if (dragTypeRef.current === 'move') {
      newStartDate = format(newDate, 'yyyy-MM-dd');
      newEndDate = format(addDays(newDate, duration), 'yyyy-MM-dd');
      console.log('Move mode:', { newStartDate, newEndDate, duration });
    } else if (dragTypeRef.current === 'resize-start') {
      const currentEndDate = new Date(end);
      newStartDate = format(newDate, 'yyyy-MM-dd');
      newEndDate = end;
      
      if (newDate >= currentEndDate) {
        newStartDate = format(addDays(currentEndDate, -1), 'yyyy-MM-dd');
      }
      console.log('Resize start mode:', { newStartDate, newEndDate });
    } else if (dragTypeRef.current === 'resize-end') {
      const currentStartDate = new Date(start);
      newStartDate = start;
      newEndDate = format(newDate, 'yyyy-MM-dd');
      
      if (newDate <= currentStartDate) {
        newEndDate = format(addDays(currentStartDate, 1), 'yyyy-MM-dd');
      }
      console.log('Resize end mode:', { newStartDate, newEndDate });
    }
    
    if (newStartDate && newEndDate) {
      finalDatesRef.current = { newStartDate, newEndDate };
      setDragPreview({ start: newStartDate, end: newEndDate });
      
      const newPosition = calculatePositionFromDates(newStartDate, newEndDate);
      if (newPosition) {
        setDragPosition(newPosition);
      }
      
      console.log('Stored preview dates and position:', { newStartDate, newEndDate, newPosition });
    }
  }, [id, start, end, calculateDateFromPosition, calculatePositionFromDates]);

  const displayStart = isDragging && dragPreview ? dragPreview.start : start;
  const displayEnd = isDragging && dragPreview ? dragPreview.end : end;
  const displayPosition = isDragging && dragPosition ? dragPosition : position;
  
  const isOutsideBounds = isDragging && dragPosition && (
    dragPosition.left < 0 || dragPosition.left + dragPosition.width > 100
  );

  const itemClasses = [
    'timeline-item',
    position.needsMultiLine ? 'multi-line' : '',
    position.isShortDuration ? 'short-duration' : '',
    position.width > position.originalWidth ? 'relaxed' : '',
    isEditing ? 'editing' : '',
    isDragging ? 'dragging' : '',
    isOutsideBounds ? 'outside-bounds' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={itemRef}
      className={itemClasses}
      style={{
        left: `${displayPosition.left}%`,
        width: `${displayPosition.width}%`,
      }}
      title={`${name}\n${displayStart} - ${displayEnd}\nDuration: ${position.duration} day(s)${position.width > position.originalWidth ? '\n(Relaxed width)' : ''}\nDrag to move, drag edges to resize${isDragging ? '\n(Preview - release to apply)' : ''}${isOutsideBounds ? '\n🔥 Timeline will expand to accommodate new dates!' : ''}`}
    >
      <div 
        className="timeline-item-resize-handle resize-start"
        onMouseDown={(e) => handleMouseDown(e, 'resize-start')}
        title="Drag to change start date"
        style={{
          transform: `scaleX(${1/zoomLevel})`,
          transformOrigin: 'left center'
        }}
      >
        ◀
      </div>
      
      <div 
        className="timeline-item-content"
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
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
              style={{
                transform: `scaleX(${1/zoomLevel})`,
                transformOrigin: 'center center'
              }}
            />
          ) : (
            <span 
              className="timeline-item-name" 
              onDoubleClick={handleNameDoubleClick}
              title="Double-click to edit"
              style={{
                transform: `scaleX(${1/zoomLevel})`,
                transformOrigin: 'center center'
              }}
            >
              {name}
            </span>
          )}
        </div>
        
        <div className="timeline-item-section timeline-item-duration-section">
          <span 
            className="timeline-item-duration"
            style={{
              transform: `scaleX(${1/zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            {position.duration} day{position.duration > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="timeline-item-section timeline-item-dates-section">
          <div 
            className="timeline-item-dates"
            style={{
              transform: `scaleX(${1/zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            {isDragging && dragPreview ? (
              position.duration === 1 ? dragPreview.start : `${dragPreview.start} - ${dragPreview.end}`
            ) : (
              position.duration === 1 ? start : `${start} - ${end}`
            )}
          </div>
        </div>
      </div>
      
      <div 
        className="timeline-item-resize-handle resize-end"
        onMouseDown={(e) => handleMouseDown(e, 'resize-end')}
        title="Drag to change end date"
        style={{
          transform: `scaleX(${1/zoomLevel})`,
          transformOrigin: 'right center'
        }}
      >
        ▶
      </div>
    </div>
  );
}

export default TimelineItem;
