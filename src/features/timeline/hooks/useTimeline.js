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
  
  // Assign items to lanes with their calculated positions
  const lanes = useMemo(() => {
    if (!timelineData.items.length) return [];
    return assignLanes(timelineData.items);
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
    totalLanes: lanes.length,
    totalDays: timelineData.totalDays,
    dateRange: {
      start: timelineData.startDate,
      end: timelineData.endDate,
      startFormatted: timelineData.startDate ? format(timelineData.startDate, 'yyyy-MM-dd') : '',
      endFormatted: timelineData.endDate ? format(timelineData.endDate, 'yyyy-MM-dd') : ''
    }
  }), [lanes, timelineData]);

  return {
    items: timelineData.items,
    lanes,
    dateMarkers,
    stats,
    timelineData
  };
}
