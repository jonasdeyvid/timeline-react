import React, { createContext, useContext, useState, useMemo } from 'react';
import { format } from 'date-fns';
import timelineItemsData from '../data/timelineItems';
import assignLanes from '../utils/assignLanes';
import { calculateTimelinePositions, generateDateMarkers } from '../utils/timelineCalculations';

const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [timelineItems, setTimelineItems] = useState(timelineItemsData);

  const updateItemName = (itemId, newName) => {
    setTimelineItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, name: newName } : item
      )
    );
  };

  const updateItemDates = (itemId, newStartDate, newEndDate) => {
    console.log('Updating item dates:', itemId, newStartDate, newEndDate);
    setTimelineItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { 
          ...item, 
          start: newStartDate, 
          end: newEndDate 
        } : item
      )
    );
  };

  const timelineData = useMemo(() => calculateTimelinePositions(timelineItems), [timelineItems]);
  
  const lanesWithHeights = useMemo(() => {
    if (!timelineData.items.length) return [];
    const assignedLanes = assignLanes(timelineData.items);
    
    return assignedLanes.map(lane => {
      const maxHeight = Math.max(
        ...lane.map(item => item.position?.recommendedHeight || 60),
        80
      );
      
      return {
        items: lane,
        height: maxHeight + 70
      };
    });
  }, [timelineData.items]);

  const dateMarkers = useMemo(() => {
    if (!timelineData.startDate || !timelineData.endDate) return [];
    return generateDateMarkers(
      timelineData.startDate, 
      timelineData.endDate, 
      timelineData.totalDays
    );
  }, [timelineData.startDate, timelineData.endDate, timelineData.totalDays]);

  const stats = useMemo(() => ({
    totalItems: timelineItems.length,
    totalLanes: lanesWithHeights.length,
    totalDays: timelineData.totalDays,
    dateRange: {
      start: timelineData.startDate,
      end: timelineData.endDate,
      startFormatted: timelineData.startDate ? format(timelineData.startDate, 'yyyy-MM-dd') : '',
      endFormatted: timelineData.endDate ? format(timelineData.endDate, 'yyyy-MM-dd') : ''
    }
  }), [lanesWithHeights, timelineData, timelineItems.length]);

  const value = {
    items: timelineData.items,
    lanes: lanesWithHeights,
    dateMarkers,
    stats,
    timelineData,
    updateItemName,
    updateItemDates
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext must be used within TimelineProvider');
  }
  return context;
};
