import { isMobile, isAndroid } from 'react-device-detect';

export const ORIENTATION = {
  Portrait: 'portrait',
  Landscape: 'landscape',
};

export const checkOrientation = () => {
  if (!isMobile) return ORIENTATION.Landscape;
  if (isAndroid) {
    if (window.screen.orientation.type.includes('portrait')) {
      return ORIENTATION.Portrait;
    }
    return ORIENTATION.Landscape;
  }
  if (window.orientation === 0) return ORIENTATION.Portrait;
  return ORIENTATION.Landscape;
};
