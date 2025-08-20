import React from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

function MonthsHeader({ dateRange, zoomLevel = 1 }) {
  console.log('MonthsHeader rendering with:', dateRange, 'zoom:', zoomLevel);
  
  if (!dateRange) {
    return (
      <div style={{
        backgroundColor: '#ffc107',
        color: '#212529',
        padding: '15px',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        Loading timeline data...
      </div>
    );
  }
  
  if (!dateRange.start || !dateRange.end) {
    console.log('DateRange structure:', Object.keys(dateRange));
    return (
      <div style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        Invalid date range - Missing start or end dates
      </div>
    );
  }

  try {
    const months = eachMonthOfInterval({
      start: startOfMonth(dateRange.start),
      end: endOfMonth(dateRange.end)
    });

    // Adjust font size based on zoom level for better readability
    const baseFontSize = 14;
    const adjustedFontSize = Math.max(10, Math.min(20, baseFontSize / Math.sqrt(zoomLevel)));
    const yearFontSize = Math.max(8, Math.min(14, 12 / Math.sqrt(zoomLevel)));

    console.log('Generated months:', months, 'adjustedFontSize:', adjustedFontSize);

    const showYears = months.length > 1 && months.some(month => 
      format(month, 'yyyy') !== format(months[0], 'yyyy')
    );

    return (
      <div style={{
        transform: `scaleX(${zoomLevel})`,
        transformOrigin: 'left center',
        width: `${100 / zoomLevel}%`,
        transition: 'transform 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #dee2e6',
          padding: '10px 0',
          fontSize: `${adjustedFontSize}px`,
          minHeight: '50px'
        }}>
          {months.map((month) => (
            <div
              key={format(month, 'yyyy-MM')}
              style={{
                flex: '1',
                textAlign: 'center',
                padding: '8px',
                borderRight: '1px solid #dee2e6',
                fontWeight: '600',
                color: '#495057',
                minWidth: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div>{format(month, 'MMMM')}</div>
              {showYears && (
                <div style={{ fontSize: `${yearFontSize}px`, color: '#6c757d', marginTop: '2px' }}>
                  {format(month, 'yyyy')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in MonthsHeader:', error);
    return (
      <div style={{
        backgroundColor: '#ffc107',
        color: '#212529',
        padding: '20px',
        textAlign: 'center',
        fontSize: '16px'
      }}>
        Error processing dates: {error.message}
      </div>
    );
  }
}

export default MonthsHeader;
