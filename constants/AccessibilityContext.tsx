import React, { createContext, useContext, useState } from 'react';

interface AccessibilitySettings {
  captions: boolean;
  highContrast: boolean;
  volume: number; // 0.0 to 1.0
  setCaptions: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
  setVolume: (val: number) => void;
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [captions, setCaptions] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [volume, setVolume] = useState(1.0);

  return (
    <AccessibilityContext.Provider value={{ captions, highContrast, volume, setCaptions, setHighContrast, setVolume }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}; 