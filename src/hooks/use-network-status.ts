import { useEffect } from "react";

export function useNetworkStatus() {
  useEffect(() => {
    const handleOffline = () => {
      if (window.location.pathname !== "/no-connection") {
        window.location.replace("/no-connection");
      }
    };

    const handleOnline = () => {
      if (window.location.pathname === "/no-connection") {
        window.location.replace("/");
      }
    };

    if (!navigator.onLine && window.location.pathname !== "/no-connection") {
      window.location.replace("/no-connection");
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (navigator.onLine && window.location.pathname === "/no-connection") {
      window.location.replace("/");
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
