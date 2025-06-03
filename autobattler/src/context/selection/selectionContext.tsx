'use client';
import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import type { Monster } from '@/types/monster';

interface Selection {
  monster1?: Monster;
  monster2?: Monster;
  result?: Monster | string;
}

interface SelectionContextValue {
  selection: Selection;
  setSelection: (selection: Selection) => void;
  setMonster1: (monster: Monster) => void;
  setMonster2: (monster: Monster) => void;
  setResult: (result: Monster | string) => void;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selection, setSelection] = useState<Selection>({});

  useEffect(() => {
    // Load initial selection from localStorage if available
    const savedSelection = localStorage.getItem('selection');
    if (savedSelection) {
      setSelection(JSON.parse(savedSelection));
    }
  }, []);

  useEffect(() => {
    // Save selection to localStorage whenever it changes
    localStorage.setItem('selection', JSON.stringify(selection));
  }, [selection]);
  
  const setMonster1 = (monster: Monster) => {
    setSelection((prev) => ({ ...prev, monster1: monster }));
  }

  const setMonster2 = (monster: Monster) => {
    setSelection((prev) => ({ ...prev, monster2: monster }));
  };
  
  const setResult = (result: Monster | string) => {
    setSelection((prev) => ({ ...prev, result }));
  };

  return (
    <SelectionContext.Provider value={{ selection, setSelection, setMonster1, setMonster2, setResult }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};