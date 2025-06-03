'use client';
import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import type { Monster } from '@/types/monster';

interface ResultContextValue {
  result: Monster | null;
  setResult: (result: Monster) => Promise<Monster>;
}

const ResultContext = createContext<ResultContextValue | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {

  const [result, setRes] = useState<Monster | null>(null);

  async function setResult(monster: Monster) {
    // When setResult is called, return the result of the battle between two monsters
    setRes(monster);
    return monster;
  }

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResult must be used within a ResultProvider');
  }
  return context;
};