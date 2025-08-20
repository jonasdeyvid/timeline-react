import { parseISO, differenceInDays } from 'date-fns';

/**
 * Calculates the position and width of timeline items based on dates
 * @param {Array} items - Array of timeline items with start and end dates
 * @returns {Object} Object with positioning information
 */
export function calculateTimelinePositions(items) {
  if (!items || items.length === 0) return { items: [], totalDays: 0, startDate: null, endDate: null };

  // Find the earliest start date and latest end date
  const dates = items.flatMap(item => [parseISO(item.start), parseISO(item.end)]);
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));
  const totalDays = differenceInDays(endDate, startDate);

  // Calculate position and width for each item
  const itemsWithPositions = items.map(item => {
    const itemStart = parseISO(item.start);
    const itemEnd = parseISO(item.end);
    
    const daysFromStart = differenceInDays(itemStart, startDate);
    const duration = differenceInDays(itemEnd, itemStart) + 1; // +1 to include the end date
    
    const leftPercentage = totalDays > 0 ? (daysFromStart / totalDays) * 100 : 0;
    const widthPercentage = totalDays > 0 ? (duration / totalDays) * 100 : 100;

    return {
      ...item,
      position: {
        left: leftPercentage,
        width: Math.max(widthPercentage, 2), // Minimum 2% width for visibility
        daysFromStart,
        duration
      }
    };
  });

  return {
    items: itemsWithPositions,
    totalDays: totalDays + 1, // +1 to include the last day
    startDate,
    endDate
  };
}

/**
 * Generates date markers for the timeline
 * @param {Date} startDate - Timeline start date
 * @param {Date} endDate - Timeline end date
 * @param {number} totalDays - Total days in timeline
 * @returns {Array} Array of date markers with positions
 */
export function generateDateMarkers(startDate, endDate, totalDays) {
  if (!startDate || !endDate || totalDays <= 0) return [];

  const markers = [];
  const maxMarkers = 12; // Maximum number of markers to avoid overcrowding
  
  // Calculate interval between markers
  const interval = Math.ceil(totalDays / maxMarkers);
  
  for (let i = 0; i <= totalDays; i += interval) {
    const markerDate = new Date(startDate);
    markerDate.setDate(markerDate.getDate() + i);
    
    if (markerDate <= endDate) {
      markers.push({
        date: markerDate,
        position: (i / totalDays) * 100,
        label: markerDate.toISOString().split('T')[0] // YYYY-MM-DD format
      });
    }
  }

  // Always include the end date if it's not already included
  const lastMarker = markers[markers.length - 1];
  if (lastMarker && lastMarker.date.getTime() !== endDate.getTime()) {
    markers.push({
      date: endDate,
      position: 100,
      label: endDate.toISOString().split('T')[0]
    });
  }

  return markers;
}
