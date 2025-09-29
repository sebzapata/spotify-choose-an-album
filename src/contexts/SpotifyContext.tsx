import { createContext, useState, useContext, ReactNode } from "react";

type SpotifyContextType = {
  selectedPlaylistId: string;
  setSelectedPlaylistId: (id: string) => void;
};

export const defaultSpotifyContext: SpotifyContextType = {
  selectedPlaylistId: "",
  setSelectedPlaylistId: () => {},
};

const SpotifyContext = createContext<SpotifyContextType>(defaultSpotifyContext);

type SpotifyProviderProps = {
  children: ReactNode;
};

export const SpotifyProvider = ({ children }: SpotifyProviderProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const contextValue: SpotifyContextType = {
    selectedPlaylistId,
    setSelectedPlaylistId,
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
