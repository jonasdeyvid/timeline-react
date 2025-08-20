import { useMemo } from 'react';
import { format } from 'date-fns';
import timelineItems from '../data/timelineItems';
import assignLanes from '../utils/assignLanes';
import { calculateTimelinePositions, generateDateMarkers } from '../utils/timelineCalculations';

export function useTimeline() {
  const timelineData = useMemo(() => calculateTimelinePositions(timelineItems), []);
  
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
  }), [lanesWithHeights, timelineData]);

  return {
    items: timelineData.items,
    lanes: lanesWithHeights,
    dateMarkers,
    stats,
    timelineData
  };
}
