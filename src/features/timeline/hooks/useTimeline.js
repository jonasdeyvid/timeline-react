import { useMemo } from 'react';
import { format } from 'date-fns';
import timelineItems from '../data/timelineItems';
import assignLanes from '../utils/assignLanes';
import { calculateTimelinePositions, generateDateMarkers } from '../utils/timelineCalculations';

/**
 * Custom hook to manage timeline data and lane assignment
 * @returns {Object} Timeline data and utilities
 */
export function useTimeline() {
  // Calculate timeline positions based on actual dates
  const timelineData = useMemo(() => calculateTimelinePositions(timelineItems), []);
  
  // Assign items to lanes with their calculated positions and calculate lane heights
  const lanesWithHeights = useMemo(() => {
    if (!timelineData.items.length) return [];
    const assignedLanes = assignLanes(timelineData.items);
    
    // Calculate optimal height for each lane based on its tallest item
    return assignedLanes.map(lane => {
      const maxHeight = Math.max(
        ...lane.map(item => item.position?.recommendedHeight || 40),
        60 // Minimum lane height
      );
      
      return {
        items: lane,
        height: maxHeight + 20 // Add padding for lane spacing
      };
    });
  }, [timelineData.items]);

  // Generate date markers for the timeline
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
  }), [lanesWithHeights, timelineData]);

  return {
    items: timelineData.items,
    lanes: lanesWithHeights,
    dateMarkers,
    stats,
    timelineData
  };
}
