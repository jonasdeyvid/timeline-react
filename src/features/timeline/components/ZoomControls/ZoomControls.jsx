import React, { useState } from 'react';
import { useTimelineContext } from '../../context/TimelineContext';
import './ZoomControls.css';

function ZoomControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom, setCustomZoom } = useTimelineContext();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setCustomZoom(newZoom);
  };

  const formatZoomPercentage = (zoom) => {
    return Math.round(zoom * 100);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const zoomPresets = [0.25, 0.5, 1, 1.5, 2, 3, 5];

  return (
    <div className={`zoom-controls ${isMinimized ? 'minimized' : ''}`}>
      <div className="zoom-controls-header">
        <span className="zoom-controls-title">🔍 Zoom</span>
        <div className="zoom-controls-header-right">
          <span className="zoom-level-display">{formatZoomPercentage(zoomLevel)}%</span>
          <button 
            className="minimize-btn"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand zoom controls" : "Minimize zoom controls"}
          >
            {isMinimized ? '⬆' : '⬇'}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="zoom-buttons">
        <button 
          className="zoom-btn zoom-out-btn"
          onClick={zoomOut}
          title="Zoom Out (Ctrl + -)"
          disabled={zoomLevel <= 0.1}
        >
          ➖
        </button>
        
        <button 
          className="zoom-btn zoom-reset-btn"
          onClick={resetZoom}
          title="Reset Zoom (Ctrl + 0)"
        >
          🎯
        </button>
        
        <button 
          className="zoom-btn zoom-in-btn"
          onClick={zoomIn}
          title="Zoom In (Ctrl + +)"
          disabled={zoomLevel >= 5}
        >
          ➕
        </button>
      </div>

      <div className="zoom-slider-container">
        <input
          type="range"
          className="zoom-slider"
          min="0.1"
          max="5"
          step="0.1"
          value={zoomLevel}
          onChange={handleZoomChange}
        />
      </div>

      <div className="zoom-presets">
        {zoomPresets.map(preset => (
          <button
            key={preset}
            className={`zoom-preset ${zoomLevel === preset ? 'active' : ''}`}
            onClick={() => setCustomZoom(preset)}
            title={`Set zoom to ${formatZoomPercentage(preset)}%`}
          >
            {formatZoomPercentage(preset)}%
          </button>
        ))}
      </div>
      </>
      )}
    </div>
  );
}

export default ZoomControls;
