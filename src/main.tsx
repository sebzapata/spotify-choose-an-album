import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SpotifyContext, {
  defaultSpotifyContext,
  SpotifyProvider,
} from "./contexts/SpotifyContext.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <SpotifyProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
    </QueryClientProvider>
  </SpotifyProvider>
);
