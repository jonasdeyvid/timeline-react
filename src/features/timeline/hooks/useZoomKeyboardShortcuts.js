import { useEffect } from 'react';
import { useTimelineContext } from '../context/TimelineContext';

export const useZoomKeyboardShortcuts = () => {
  const { zoomIn, zoomOut, resetZoom } = useTimelineContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
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
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
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
