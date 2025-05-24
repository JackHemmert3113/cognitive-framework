import { useState, useCallback } from 'react';

/**
 * Custom Counter Hook
 * Example of testable React hook
 */
export const useCounter = (initialValue = 0, options = {}) => {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(c => {
      const newValue = c + step;
      return newValue <= max ? newValue : c;
    });
  }, [max, step]);

  const decrement = useCallback(() => {
    setCount(c => {
      const newValue = c - step;
      return newValue >= min ? newValue : c;
    });
  }, [min, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value) => {
    if (value >= min && value <= max) {
      setCount(value);
    }
  }, [min, max]);

  return { count, increment, decrement, reset, set };
};