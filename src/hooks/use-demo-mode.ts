import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nexa.demo-mode";

/** Persisted preference to force the offline demo agent instead of the live model. */
export function useDemoMode(): {
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
  hydrated: boolean;
} {
  const [demoMode, setValue] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(window.localStorage.getItem(STORAGE_KEY) === "true");
    setHydrated(true);
  }, []);

  const setDemoMode = useCallback((value: boolean) => {
    setValue(value);
    window.localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return { demoMode, setDemoMode, hydrated };
}
