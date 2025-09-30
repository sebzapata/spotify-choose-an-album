import "./App.css";
import AlbumOptions from "./components/AlbumOptions";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginScreen from "./components/LoginScreen";
import LogoutButton from "./components/LogoutButton";
import { useSpotifyAuth } from "./hooks/useSpotifyAuth";

function App() {
  const { isLoggedIn, loading, login, logout } = useSpotifyAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen loading={loading} login={login} />;
  }

  return (
    <div className="max-w-[1440px] p-8">
      <div className="absolute top-4 right-4">
        <LogoutButton onLogout={logout} />
      </div>
      <AlbumOptions />
    </div>
  );
}

export default App;
