import { useEffect } from 'react';
import reportWebVitals from './webVitals';

// Component that reports Web Vitals once on mount.
// It logs in dev, and stays silent in production.
const WebVitalsReport = () => {
  useEffect(() => {
    reportWebVitals((metric) => {
      // `import.meta.env.MODE` is 'development'|'production' etc.
      if (import.meta.env.MODE !== 'production') {
        // Keep output structured.
        console.info('[WebVitals]', metric);
      }
    });
  }, []);

  return null;
};

export default WebVitalsReport;

