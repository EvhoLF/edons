import { useMemo, useCallback, useRef } from 'react';

export const usePickColor = (callback = () => {}) => {
  const timeoutRef = useRef(null);

  const debouncedSetColor = useMemo(() => {
    return (value) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, 300);
    };
  }, [callback]);

  const handleColorChange = useCallback((e) => {
    debouncedSetColor(e.target.value);
  }, [debouncedSetColor]);

  return handleColorChange;
};
