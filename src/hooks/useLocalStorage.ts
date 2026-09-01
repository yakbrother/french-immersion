import { useState, useCallback, useEffect, useRef } from 'react';
import { getStorageItem, setStorageItem } from '../lib/storage';

const LOCAL_STORAGE_EVENT = 'local-storage-change';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getStorageItem(key, initialValue));

  // The fallback is conceptually constant; keep a stable reference so the sync
  // effect below doesn't re-subscribe when callers pass a fresh literal.
  const initialValueRef = useRef(initialValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;

        setStorageItem(key, nextValue);
        window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, { detail: key }));

        return nextValue;
      });
    },
    [key]
  );

  // Keep every hook instance bound to the same key in sync: an in-tab custom
  // event covers same-document writes, the native storage event covers writes
  // from other tabs. Bail out when the value is unchanged so re-reads (including
  // the writer hearing its own event) don't trigger needless re-renders.
  useEffect(() => {
    const sync = () => {
      setStoredValue((prev) => {
        const next = getStorageItem(key, initialValueRef.current);

        return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
      });
    };

    const onCustom = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) {
        sync();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        sync();
      }
    };

    window.addEventListener(LOCAL_STORAGE_EVENT, onCustom);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(LOCAL_STORAGE_EVENT, onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, [key]);

  return [storedValue, setValue];
}
