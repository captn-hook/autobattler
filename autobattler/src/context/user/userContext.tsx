'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from '@/app/firebaseConfig'; 
import { doc, setDoc, getDoc } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
}

interface UserContextValue {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addFavorite: (monsterId: number) => void;
  getFavorites: () => Promise<number[]>; 
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Unknown",
          email: firebaseUser.email || "No email",
          photoURL: firebaseUser.photoURL || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }
  
  async function addFavorite(monsterId: number) {
    if (!user) {
      console.warn("User must be logged in to add favorites");
      return;
    }

    const userDoc = doc(firestore, "users", user.id);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const favorites = userData.favorites || [];
      if (!favorites.includes(monsterId)) {
        favorites.push(monsterId);
        await setDoc(userDoc, { favorites }, { merge: true });
      }
    } else {
      // If the user document doesn't exist, create it with the favorite
      await setDoc(userDoc, { favorites: [monsterId] });
    }
  }

  async function getFavorites(): Promise<number[]> {
    if (!user) {
      console.error("User must be logged in to get favorites");
      return [];
    }

    const userDoc = doc(firestore, "users", user.id);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData.favorites || [];
    } else {
      return [];
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, addFavorite, getFavorites }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};