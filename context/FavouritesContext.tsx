import React, { createContext, useState, useEffect, useCallback, useRef, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Hymn } from "../types";

interface FavouritesContextType {
  favourites: Hymn[];
  addFavourite: (hymn: Hymn) => Promise<void>;
  removeFavourite: (hymn: Hymn) => Promise<void>;
  clearFavourites: () => Promise<void>;
  isFavourite: (hymnNumber: string) => boolean;
  isLoading: boolean;
}

interface FavouritesProviderProps {
  children: ReactNode;
}

export const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

// Custom hook to use the FavouritesContext
export const useFavourites = (): FavouritesContextType => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};

export const FavouritesProvider: React.FC<FavouritesProviderProps> = ({ children }) => {
  const [favourites, setFavourites] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use useRef for operation lock to persist across re-renders
  const operationLockRef = useRef<boolean>(false);

  useEffect(() => {
    const loadFavourites = async (): Promise<void> => {
      try {
        const storedFavourites = await AsyncStorage.getItem("favourites");
        if (storedFavourites) {
          const parsedData = JSON.parse(storedFavourites);
          setFavourites(Array.isArray(parsedData) ? parsedData : []);
        }
      } catch (error) {
        console.error("Failed to load favourites from AsyncStorage", error);
      }
    };

    loadFavourites();
  }, []);

  const addFavourite = useCallback(
    async (hymn: Hymn): Promise<void> => {
      if (operationLockRef.current) return; 
      operationLockRef.current = true;
      setIsLoading(true);

      try {
        // Check if hymn already exists
        if (favourites.some((item) => item.number === hymn.number)) {
          console.warn("Hymn already exists in favourites");
          return;
        }

        const updatedFavourites = [...favourites, hymn];
        
        // Update state first (optimistic update)
        setFavourites(updatedFavourites); 
        
        // Persist to storage
        await AsyncStorage.setItem(
          "favourites",
          JSON.stringify(updatedFavourites)
        );
      } catch (error) {
        console.error("Failed to add favourite:", error);
        // Revert optimistic update on error
        setFavourites((prev) => prev.filter(item => item.number !== hymn.number));
        // You might want to show a user-friendly error message here
      } finally {
        operationLockRef.current = false;
        setIsLoading(false);
      }
    },
    [favourites]
  );

  const removeFavourite = useCallback(
    async (hymn: Hymn): Promise<void> => {
      if (operationLockRef.current) return; 
      operationLockRef.current = true;
      setIsLoading(true);

      try {
        const updatedFavourites = favourites.filter(
          (item) => item.number !== hymn.number
        );
        
        // Update state first (optimistic update)
        setFavourites(updatedFavourites); 
        
        // Persist to storage
        await AsyncStorage.setItem(
          "favourites",
          JSON.stringify(updatedFavourites)
        );
      } catch (error) {
        console.error("Failed to remove favourite:", error);
        // Revert optimistic update on error
        setFavourites((prev) => [...prev, hymn]);
        // You might want to show a user-friendly error message here
      } finally {
        operationLockRef.current = false;
        setIsLoading(false);
      }
    },
    [favourites]
  );

  const clearFavourites = useCallback(async (): Promise<void> => {
    if (operationLockRef.current) return; 
    operationLockRef.current = true;
    setIsLoading(true);

    const previousFavourites = [...favourites]; // Store for potential rollback

    try {
      // Update state first (optimistic update)
      setFavourites([]); 
      
      // Clear from storage
      await AsyncStorage.removeItem("favourites");
    } catch (error) {
      console.error("Failed to clear favourites:", error);
      // Revert optimistic update on error
      setFavourites(previousFavourites);
      // You might want to show a user-friendly error message here
    } finally {
      operationLockRef.current = false;
      setIsLoading(false);
    }
  }, [favourites]);

  // Helper function to check if a hymn is in favourites
  const isFavourite = useCallback((hymnNumber: string): boolean => {
    return favourites.some((item) => item.number === hymnNumber);
  }, [favourites]);

  const contextValue: FavouritesContextType = {
    favourites,
    addFavourite,
    removeFavourite,
    clearFavourites,
    isFavourite,
    isLoading,
  };

  return (
    <FavouritesContext.Provider value={contextValue}>
      {children}
    </FavouritesContext.Provider>
  );
};
