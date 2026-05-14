import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard input handling
 * Returns current state of specified keys
 */
export const useKeyboard = (targetKeys = []) => {
  const [keys, setKeys] = useState({});

  const handleKeyDown = useCallback((e) => {
    if (targetKeys.length === 0 || targetKeys.includes(e.key)) {
      setKeys(prev => ({ ...prev, [e.key]: true }));
      
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    }
  }, [targetKeys]);

  const handleKeyUp = useCallback((e) => {
    if (targetKeys.length === 0 || targetKeys.includes(e.key)) {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    }
  }, [targetKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
};

