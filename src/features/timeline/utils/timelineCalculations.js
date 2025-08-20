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

  // Calculate position and width for each item with relaxation rules
  const itemsWithPositions = items.map(item => {
    const itemStart = parseISO(item.start);
    const itemEnd = parseISO(item.end);
    
    const daysFromStart = differenceInDays(itemStart, startDate);
    const duration = differenceInDays(itemEnd, itemStart) + 1; // +1 to include the end date
    
    const leftPercentage = totalDays > 0 ? (daysFromStart / totalDays) * 100 : 0;
    const widthPercentage = totalDays > 0 ? (duration / totalDays) * 100 : 100;

    // Apply relaxation rules for better usability
    const relaxationInfo = calculateRelaxationInfo(item.name, duration, widthPercentage);

    return {
      ...item,
      position: {
        left: leftPercentage,
        width: Math.max(widthPercentage, relaxationInfo.minWidth),
        originalWidth: widthPercentage,
        daysFromStart,
        duration,
        needsMultiLine: relaxationInfo.needsMultiLine,
        isShortDuration: relaxationInfo.isShortDuration,
        recommendedHeight: relaxationInfo.recommendedHeight
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

/**
 * Calculates relaxation information for timeline items
 * @param {string} name - Item name
 * @param {number} duration - Item duration in days
 * @param {number} originalWidth - Original calculated width percentage
 * @returns {Object} Relaxation information
 */
function calculateRelaxationInfo(name, duration, originalWidth) {
  const nameLength = name.length;
  
  // Determine if item needs special treatment
  const isShortDuration = duration <= 2;
  const isLongName = nameLength > 25;
  const isVeryLongName = nameLength > 40;
  
  // Calculate minimum width based on content
  let minWidth = originalWidth;
  let needsMultiLine = false;
  let recommendedHeight = 40; // Base height
  
  // Rule 0: Very small original width always gets expanded
  if (originalWidth < 2) {
    minWidth = Math.max(originalWidth, 8); // Small items get at least 8%
    recommendedHeight = 50;
  }
  
  // Rule 1: Single day events need minimum readable space
  if (duration === 1) {
    minWidth = Math.max(originalWidth, 6); // At least 6% of timeline (increased from 4%)
    recommendedHeight = 45;
  }
  
  // Rule 2: Short duration with long names
  if (isShortDuration && isLongName) {
    minWidth = Math.max(originalWidth, 8); // At least 8% of timeline (increased from 6%)
    needsMultiLine = isVeryLongName;
    recommendedHeight = needsMultiLine ? 60 : 50;
  }
  
  // Rule 3: Very long names regardless of duration
  if (isVeryLongName) {
    needsMultiLine = true;
    recommendedHeight = 65;
    minWidth = Math.max(originalWidth, 10); // At least 10% for very long names (increased from 8%)
  }
  
  // Rule 4: Regular long names
  else if (isLongName && !isShortDuration) {
    minWidth = Math.max(originalWidth, 7); // At least 7% of timeline (increased from 5%)
    recommendedHeight = 45;
  }
  
  // Ensure minimum visibility but cap maximum to prevent excessive expansion
  minWidth = Math.max(minWidth, 5); // Absolute minimum 5% (increased from 3%)
  minWidth = Math.min(minWidth, 15); // Maximum 15% to prevent timeline breaking (increased from 12%)
  
  return {
    minWidth,
    needsMultiLine,
    isShortDuration,
    recommendedHeight
  };
}
