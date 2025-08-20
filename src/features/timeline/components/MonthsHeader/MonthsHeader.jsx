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

    // Keep font sizes constant regardless of zoom level
    const baseFontSize = 14;
    const yearFontSize = 12;

    console.log('Generated months:', months, 'baseFontSize:', baseFontSize);

    const showYears = months.length > 1 && months.some(month => 
      format(month, 'yyyy') !== format(months[0], 'yyyy')
    );

    return (
      <div style={{
        width: `${100 * zoomLevel}%`,
        transition: 'width 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #dee2e6',
          padding: '10px 0',
          fontSize: `${baseFontSize}px`,
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
