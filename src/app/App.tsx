import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { captureAttributionFromLocation } from './lib/attribution.js';

export default function App() {
  useEffect(() => {
    captureAttributionFromLocation();
  }, []);

  return <RouterProvider router={router} />;
}
