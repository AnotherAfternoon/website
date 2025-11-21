import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const CreditsContext = createContext();

export function CreditsProvider({ children }) {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!isSignedIn) {
      setCredits(null);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/v1/credits/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCredits(data);
      }
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  // Fetch credits when user signs in
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <CreditsContext.Provider value={{ credits, loading, refreshCredits: fetchCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}
