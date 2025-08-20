/**
 * Takes an array of items and assigns them to lanes based on start/end dates.
 * Now considers expanded widths to prevent visual overlapping.
 * @param {Array} items - Array of timeline items with start and end dates and position data
 * @returns {Array} an array of arrays containing items organized by lanes.
 */
function assignLanes(items) {
  const sortedItems = items.sort((a, b) =>
      new Date(a.start) - new Date(b.start)
  );
  const lanes = [];

  function assignItemToLane(item) {
      for (const lane of lanes) {
          const lastItem = lane[lane.length - 1];
          
          const dateBasedNoOverlap = new Date(lastItem.end) < new Date(item.start);
          
          let visualNoOverlap = true;
          if (lastItem.position && item.position) {
              const lastItemVisualEnd = lastItem.position.left + lastItem.position.width;
              const currentItemVisualStart = item.position.left;
              const buffer = 1;
              visualNoOverlap = (lastItemVisualEnd + buffer) <= currentItemVisualStart;
          }
          
          if (dateBasedNoOverlap && visualNoOverlap) {
              lane.push(item);
              return;
          }
      }
      lanes.push([item]);
  }

  for (const item of sortedItems) {
      assignItemToLane(item);
  }
  return lanes;
}

export default assignLanes;
