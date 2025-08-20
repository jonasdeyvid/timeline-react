import { parseISO, differenceInDays } from 'date-fns';

export function calculateTimelinePositions(items) {
  if (!items || items.length === 0) return { items: [], totalDays: 0, startDate: null, endDate: null };

  const dates = items.flatMap(item => [parseISO(item.start), parseISO(item.end)]);
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));
  const totalDays = differenceInDays(endDate, startDate);

  const itemsWithPositions = items.map(item => {
    const itemStart = parseISO(item.start);
    const itemEnd = parseISO(item.end);
    
    const daysFromStart = differenceInDays(itemStart, startDate);
    const duration = differenceInDays(itemEnd, itemStart) + 1;
    
    const leftPercentage = totalDays > 0 ? (daysFromStart / totalDays) * 100 : 0;
    const widthPercentage = totalDays > 0 ? (duration / totalDays) * 100 : 100;

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
    totalDays: totalDays + 1,
    startDate,
    endDate
  };
}

export function generateDateMarkers(startDate, endDate, totalDays) {
  if (!startDate || !endDate || totalDays <= 0) return [];

  const markers = [];
  const maxMarkers = 12;
  
  const interval = Math.ceil(totalDays / maxMarkers);
  
  for (let i = 0; i <= totalDays; i += interval) {
    const markerDate = new Date(startDate);
    markerDate.setDate(markerDate.getDate() + i);
    
    if (markerDate <= endDate) {
      markers.push({
        date: markerDate,
        position: (i / totalDays) * 100,
        label: markerDate.toISOString().split('T')[0]
      });
    }
  }

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

function calculateRelaxationInfo(name, duration, originalWidth) {
  const nameLength = name.length;
  
  const isShortDuration = duration <= 2;
  const isLongName = nameLength > 25;
  const isVeryLongName = nameLength > 40;
  
  let minWidth = originalWidth;
  let needsMultiLine = false;
  let recommendedHeight = 60;
  
  if (originalWidth < 2) {
    minWidth = Math.max(originalWidth, 8);
    recommendedHeight = 70;
  }
  
  if (duration === 1) {
    minWidth = Math.max(originalWidth, 6);
    recommendedHeight = 65;
  }
  
  if (isShortDuration && isLongName) {
    minWidth = Math.max(originalWidth, 8);
    needsMultiLine = isVeryLongName;
    recommendedHeight = needsMultiLine ? 80 : 70;
  }
  
  if (isVeryLongName) {
    needsMultiLine = true;
    recommendedHeight = 85;
    minWidth = Math.max(originalWidth, 10);
  }
  
  else if (isLongName && !isShortDuration) {
    minWidth = Math.max(originalWidth, 7);
    recommendedHeight = 65;
  }
  
  minWidth = Math.max(minWidth, 5);
  minWidth = Math.min(minWidth, 15);
  
  return {
    minWidth,
    needsMultiLine,
    isShortDuration,
    recommendedHeight
  };
}
