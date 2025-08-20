import React, { createContext, useContext, useState, useMemo } from 'react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth } from 'date-fns';
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
    
    // Check if we need to expand timeline
    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);
    
    setTimelineItems(prevItems => {
      // Find current timeline bounds
      const allDates = prevItems.flatMap(item => [new Date(item.start), new Date(item.end)]);
      allDates.push(newStart, newEnd);
      
      const currentMinDate = new Date(Math.min(...allDates));
      const currentMaxDate = new Date(Math.max(...allDates));
      
      // Expand timeline if necessary (add some buffer months)
      const expandedMinDate = startOfMonth(subMonths(currentMinDate, 1));
      const expandedMaxDate = endOfMonth(addMonths(currentMaxDate, 1));
      
      console.log('Timeline expansion check:', {
        original: { min: currentMinDate, max: currentMaxDate },
        expanded: { min: expandedMinDate, max: expandedMaxDate }
      });
      
      return prevItems.map(item => 
        item.id === itemId ? { 
          ...item, 
          start: newStartDate, 
          end: newEndDate 
        } : item
      );
    });
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
