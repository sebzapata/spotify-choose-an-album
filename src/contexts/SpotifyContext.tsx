import { createContext, useState, useContext, ReactNode } from "react";

type SpotifyContextType = {
  selectedMode: "History" | "Followed" | undefined;
  setSelectedMode: (id?: "History" | "Followed") => void;
};

export const defaultSpotifyContext: SpotifyContextType = {
  selectedMode: undefined,
  setSelectedMode: () => {},
};

const SpotifyContext = createContext<SpotifyContextType>(defaultSpotifyContext);

type SpotifyProviderProps = {
  children: ReactNode;
};

export const SpotifyProvider = ({ children }: SpotifyProviderProps) => {
  const [selectedMode, setSelectedMode] = useState<"History" | "Followed">();

  const contextValue: SpotifyContextType = {
    selectedMode,
    setSelectedMode,
  };

  return (
    <SpotifyContext.Provider value={contextValue}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};

export default SpotifyContext;
