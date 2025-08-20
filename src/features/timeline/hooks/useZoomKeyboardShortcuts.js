import { useEffect } from 'react';
import { useTimelineContext } from '../context/TimelineContext';

export const useZoomKeyboardShortcuts = () => {
  const { zoomIn, zoomOut, resetZoom } = useTimelineContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
          default:
            break;
        }
      }
    };

    const handleWheel = (e) => {
      // Zoom with mouse wheel when Ctrl is held
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn(); // Scroll up = zoom in
        } else {
          zoomOut(); // Scroll down = zoom out
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [zoomIn, zoomOut, resetZoom]);
};

export default useZoomKeyboardShortcuts;
