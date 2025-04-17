import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    try {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: location.pathname,
          page_title: document.title,
        });
      }
    } catch {
      // Silently fail if GA is not available
      console.debug("Google Analytics not available");
    }
  }, [location.pathname]);
}
