// Backend API URL resolver
export const LIVE_BACKEND_URL = 'https://ais-pre-km2auybtp3quq4pfglwjua-520225205404.asia-northeast1.run.app';

export const getApiUrl = (endpoint: string): string => {
  // If running inside AI Studio preview or local dev, use relative paths directly
  if (typeof window === 'undefined') return endpoint;
  
  const host = window.location.hostname;
  const isLocalOrDirect = host === 'localhost' || host === '127.0.0.1' || host.includes('run.app');
  
  if (isLocalOrDirect) {
    return endpoint;
  }
  
  // If hosted on an external domain like vercel.app or netlify.app
  return `${LIVE_BACKEND_URL}${endpoint}`;
};
