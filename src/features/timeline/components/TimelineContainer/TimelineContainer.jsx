import React from 'react';
import { useTimelineContext } from '../../context/TimelineContext';
import TimelineItem from '../TimelineItem';
import MonthsHeader from '../MonthsHeader';
import ZoomControls from '../ZoomControls';
import useZoomKeyboardShortcuts from '../../hooks/useZoomKeyboardShortcuts';
import './TimelineContainer.css';

function TimelineContainer() {
  const { lanes, dateMarkers, stats, updateItemName, updateItemDates, timelineData, zoomLevel } = useTimelineContext();
  
  useZoomKeyboardShortcuts();

  return (
    <div className="timeline-container">
      <ZoomControls />
      
      <header className="timeline-header">
        <h2>Timeline Project</h2>
        <div className="timeline-stats">
          <span>{stats.totalItems} items</span>
          <span>{stats.totalLanes} lanes</span>
          <span>{stats.totalDays} days</span>
          <span>{stats.dateRange.startFormatted} - {stats.dateRange.endFormatted}</span>
          <span className="zoom-indicator">🔍 {Math.round(zoomLevel * 100)}%</span>
        </div>
      </header>
      
      <div className="timeline-content">
        <MonthsHeader dateRange={stats.dateRange} zoomLevel={zoomLevel} />
        
        <div 
          className="timeline-zoom-container"
          style={{
            transform: `scaleX(${zoomLevel})`,
            transformOrigin: 'left center',
            width: `${100 / zoomLevel}%`,
            '--font-scale': `${1/zoomLevel}`
          }}
        >
          <div className="timeline-dates">
          {dateMarkers.map((marker, index) => (
            <div
              key={index}
              className="date-marker"
              style={{ left: `${marker.position}%` }}
            >
              <div className="date-line"></div>
              <div className="date-label">{marker.label}</div>
            </div>
          ))}
        </div>
        
        <div className="timeline-lanes">
          {lanes.map((laneData, laneIndex) => (
            <div 
              key={laneIndex} 
              className="timeline-lane"
              style={{ height: `${laneData.height}px` }}
            >
              <div className="lane-header">Lane {laneIndex + 1}</div>
              <div className="lane-track">
                {laneData.items.map(item => (
                  <TimelineItem 
                    key={item.id} 
                    item={item} 
                    onNameChange={updateItemName}
                    onDateChange={updateItemDates}
                    timelineData={timelineData}
                    zoomLevel={zoomLevel}
                  />
                ))}
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineContainer;
