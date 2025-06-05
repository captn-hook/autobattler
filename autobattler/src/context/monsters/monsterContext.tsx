'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Monster } from '@/types/monster';

interface MonsterContextValue {
  monsters: {  [id: number]: Monster;}
  setMonsters: (monsters: Monster[]) => void;
  setMonster: (monster: Monster) => void;
  getMonster: (id: number) => Promise<Monster | undefined>;
  getMonsters: () => Monster[];
}

const MonsterContext = createContext<MonsterContextValue | undefined>(undefined);

export const MonsterProvider = ({ children }: { children: ReactNode }) => {
  const [monsters, setMonsters] = useState<{ [id: number]: Monster }>({});

  useEffect(() => {
    // Fetch initial monsters data from /api/monsters
    const fetchMonsters = async () => {
      try {
        console.log('Fetching monsters from /api/monsters');
        const response = await fetch('/api/monsters');
        if (!response.ok) {
          throw new Error('Failed to fetch monsters');
        }
        const data: Monster[] = await response.json();
        const monsterMap: { [id: number]: Monster } = {};
        data.forEach(monster => {
          monsterMap[monster.id] = monster;
        });
        setMonsters(monsterMap);
      } catch (error) {
        console.error('Error fetching monsters:', error);
      }
    };

    fetchMonsters();
  }, []);

  const setMonster = (monster: Monster) => {
    setMonsters(prev => ({ ...prev, [monster.id]: monster }));
  };

  const getMonster = async (id: number): Promise<Monster | undefined> => {
    if (monsters[id]) {
      return monsters[id];
    } else {
      // fetch the monster if not in state
      try {
        const response = await fetch(`/api/monsters/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch monster with id ${id}`);
        }
        const monster: Monster = await response.json();
        setMonster(monster);
        console.log('Fetched monster:', monster);
        return monster as Monster;
      } catch (error) {
        console.error('Error fetching monster:', error);
        return undefined;
      }
    }
  };

  const getMonsters = (): Monster[] => {
    return Object.values(monsters).sort((a, b) => b.id - a.id); // Sort by id descending
  };

  return (
    <MonsterContext.Provider value={{ monsters, setMonsters, setMonster, getMonster, getMonsters }}>
      {children}
    </MonsterContext.Provider>
  );
}

export const useMonsters = (): MonsterContextValue => {
  const context = useContext(MonsterContext);
  if (!context) {
    throw new Error('useMonsters must be used within a MonsterProvider');
  }
  return context;
};