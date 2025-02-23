import { useCallback, useState } from "react";

export function useForceRefresh() {
  const [refresh, setRefresh] = useState(false);

  const forceRefresh = useCallback(() => {
    setRefresh(!refresh);
  }, [refresh]);

  return forceRefresh;
}
