import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.umami) {
      window.umami.track("pageview", {
        url: location.pathname,
        title: document.title,
      });
    }
  }, [location.pathname]);
}
