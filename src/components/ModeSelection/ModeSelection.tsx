import { useSpotify } from "../../contexts/SpotifyContext";
import FollowedArtistsIcon from "./FolllowedArtistsIcon";
import HistoryIcon from "./HistoryIcon";

const ModeSelection = () => {
  const { setSelectedMode } = useSpotify();

  return (
    <div className="flex flex-col sm:flex-row gap-12 max-h-screen sm:max-h-none">
      <button
        onClick={() => setSelectedMode("History")}
        className="flex flex-col gap-c8 bg-transparent border-neutral-500 border-8 rounded-3xl p-8 max-h-[40vh] sm:max-h-none"
      >
        <HistoryIcon lightTheme={false} />

        <h2 className="text-lg sm:text-2xl">Listening history</h2>
      </button>
      <button
        onClick={() => setSelectedMode("Followed")}
        className="flex flex-col gap-c8 bg-transparent border-neutral-500 border-8 rounded-3xl p-8 max-h-[40vh] sm:max-h-none"
      >
        <FollowedArtistsIcon lightTheme={false} />

        <h2 className="text-lg sm:text-2xl">Followed artists</h2>
      </button>
    </div>
  );
};

export default ModeSelection;
