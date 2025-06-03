'use client';
import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import type { Monster } from '@/types/monster';

interface Result {
  result?: Monster | string;
}

interface ResultContextValue {
  result: Result;
  setResult: (result: Result) => void;
}

const ResultContext = createContext<ResultContextValue | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<Result>({});

  useEffect(() => {
    // Load initial result from localStorage if available
    const savedResult = localStorage.getItem('result');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  useEffect(() => {
    // Save result to localStorage whenever it changes
    localStorage.setItem('result', JSON.stringify(result));
  }, [result]);

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