import React from 'react';
import { useTimelineContext } from '../../context/TimelineContext';
import TimelineItem from '../TimelineItem';
import MonthsHeader from '../MonthsHeader';
import './TimelineContainer.css';

function TimelineContainer() {
  const { lanes, dateMarkers, stats, updateItemName } = useTimelineContext();

  return (
    <div className="timeline-container">
      <header className="timeline-header">
        <h2>Timeline Project {"\u2728"}</h2>
        <div className="timeline-stats">
          <span>{stats.totalItems} items</span>
          <span>{stats.totalLanes} lanes</span>
          <span>{stats.totalDays} days</span>
          <span>{stats.dateRange.startFormatted} - {stats.dateRange.endFormatted}</span>
        </div>
      </header>
      
      <div className="timeline-content">
        <MonthsHeader dateRange={stats.dateRange} />
        
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
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineContainer;
