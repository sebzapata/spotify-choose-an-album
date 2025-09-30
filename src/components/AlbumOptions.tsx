import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../App.css";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { getArtistsAlbums } from "../service/getArtistAlbums";
import { getAllUsersFollowedArtistsPaginated } from "../service/getUsersFollowedArtists";
import LoadingSpinner from "./LoadingSpinner";

const AlbumOptions = () => {
  const [chosenArtists, setChosenArtists] = useState<string[]>([]);
  const [chosenAlbums, setChosenAlbums] = useState<
    { url: string; image: string }[]
  >([]);

  const { accessToken } = useSpotifyAuth();

  const { data: allFollowedArtistsData, isLoading } = useQuery({
    queryKey: ["getAllFollowedArtistsData", accessToken],
    queryFn: () => {
      if (accessToken) {
        return getAllUsersFollowedArtistsPaginated(accessToken);
      }
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });

  const { data: artistsAlbums } = useQuery({
    queryKey: ["getArtistsAlbums", accessToken, chosenArtists],
    queryFn: async () => {
      if (accessToken) {
        const allArtistsAllAlbumsPromises = chosenArtists.map((artistId) =>
          getArtistsAlbums(artistId, accessToken, 0)
        );

        const allArtistsAllAlbums = await Promise.all(
          allArtistsAllAlbumsPromises
        );

        const allAlbums = allArtistsAllAlbums.map(
          (artistsAlbums) => artistsAlbums.items
        );

        return allAlbums;
      }
    },
    enabled: !!accessToken && chosenArtists.length === 6,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (artistsAlbums && chosenAlbums.length !== 6) {
      artistsAlbums.forEach((artistAlbums) => {
        const randomNumber = Math.floor(Math.random() * artistAlbums.length);

        const randomAlbum = artistAlbums[randomNumber];

        setChosenAlbums((prev) => [
          ...prev,
          {
            name: randomAlbum.name,
            artist: randomAlbum.artists[0].name,
            url: randomAlbum.uri,
            image: randomAlbum.images[0].url,
          },
        ]);
      });
    }
  }, [artistsAlbums, chosenAlbums]);

  useEffect(() => {
    if (!isLoading && allFollowedArtistsData && chosenArtists.length !== 6) {
      const randomNumber = Math.floor(
        Math.random() * allFollowedArtistsData.artists.items.length
      );

      const randomArtistId =
        allFollowedArtistsData.artists.items[randomNumber].id;

      setChosenArtists((prev) => {
        if (prev.includes(randomArtistId)) {
          return [...prev];
        }

        return [...prev, randomArtistId];
      });
    }
  }, [chosenArtists, allFollowedArtistsData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!allFollowedArtistsData) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6">
      {chosenAlbums.map((album) => (
        <div key={album.url}>
          <a href={album.url}>
            <img className="w-full" src={album.image} />
          </a>
        </div>
      ))}
    </div>
  );
};

export default AlbumOptions;
