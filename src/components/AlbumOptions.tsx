import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../App.css";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { getArtistsAlbums } from "../service/getArtistAlbums";
import { getAllUsersFollowedArtistsPaginated } from "../service/getUsersFollowedArtists";
import LoadingSpinner from "./LoadingSpinner";
import { getUsersTopItems } from "../service/getUsersTopItems";
import { useSpotify } from "../contexts/SpotifyContext";

const AlbumOptions = () => {
  const [chosenArtists, setChosenArtists] = useState<string[]>([]);
  const [isLoadingAllTopArtistsPages, setIsLoadingAllPages] = useState(false);

  const { accessToken } = useSpotifyAuth();
  const { selectedMode } = useSpotify();

  const {
    data: topArtistsData,
    isLoading: isTopArtistsLoading,
    fetchNextPage: fetchNextTopArtistsPage,
    isFetching: isFetchingTopArtists,
    hasNextPage: hasNextTopArtistsPage,
  } = useInfiniteQuery({
    queryKey: ["getUsersTopArtists", accessToken],
    queryFn: ({ pageParam = 1 }) => {
      if (accessToken) {
        setIsLoadingAllPages(true);

        return getUsersTopItems(
          "artists",
          "long_term",
          accessToken,
          (pageParam - 1) * 50
        );
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // Only return next page if current page has 50 items (full page)
      if (lastPage?.items?.length === 50) {
        return allPages.length + 1;
      }

      return undefined; // No more pages
    },
    initialPageParam: 1,
    enabled: !!accessToken && selectedMode === "History",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isFetchingTopArtists || !hasNextTopArtistsPage) {
      return;
    }

    fetchNextTopArtistsPage();
  }, [
    topArtistsData,
    isFetchingTopArtists,
    hasNextTopArtistsPage,
    fetchNextTopArtistsPage,
  ]);

  useEffect(() => {
    if (!hasNextTopArtistsPage && !isFetchingTopArtists) {
      setIsLoadingAllPages(false);
    }
  }, [
    topArtistsData,
    hasNextTopArtistsPage,
    isFetchingTopArtists,
    isTopArtistsLoading,
  ]);

  const {
    data: allFollowedArtistsData,
    isLoading: isLoadingAllFollowedArtists,
  } = useQuery({
    queryKey: ["getAllFollowedArtistsData", accessToken],
    queryFn: () => {
      if (accessToken) {
        return getAllUsersFollowedArtistsPaginated(accessToken);
      }
    },
    enabled: !!accessToken && selectedMode === "Followed",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (selectedMode === "Followed") {
      if (
        !isLoadingAllFollowedArtists &&
        allFollowedArtistsData &&
        chosenArtists.length !== 6
      ) {
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
    } else {
      if (
        !isLoadingAllTopArtistsPages &&
        !isTopArtistsLoading &&
        topArtistsData &&
        chosenArtists.length !== 6
      ) {
        const flattenedArtistsHistory = topArtistsData.pages.flatMap(
          (page) => page?.items
        );

        const randomNumber = Math.floor(
          Math.random() * flattenedArtistsHistory.length
        );
        const randomArtistId = flattenedArtistsHistory[randomNumber]?.id;

        setChosenArtists((prev) => {
          if (randomArtistId) {
            if (prev.includes(randomArtistId)) {
              return [...prev];
            }
            return [...prev, randomArtistId];
          }

          return [...prev];
        });
      }
    }
  }, [
    chosenArtists,
    allFollowedArtistsData,
    topArtistsData,
    isLoadingAllTopArtistsPages,
  ]);

  const { data: artistsAlbums, isLoading: isArtistsAlbumsLoading } = useQuery({
    queryKey: ["getArtistsAlbums", accessToken, chosenArtists],
    queryFn: async () => {
      if (accessToken) {
        const allArtistsAllAlbumsPromises = chosenArtists.map((artistId) =>
          getArtistsAlbums(artistId, accessToken, 0)
        );

        const allArtistsAllAlbums = (
          await Promise.all(allArtistsAllAlbumsPromises)
        ).map((artistsAlbums) => artistsAlbums.items);

        return allArtistsAllAlbums.map((artistAlbums) => {
          const randomNumber = Math.floor(Math.random() * artistAlbums.length);

          const randomAlbum = artistAlbums[randomNumber];

          return {
            url: randomAlbum.uri,
            image: randomAlbum.images[0].url,
          };
        });
      }
    },
    enabled: !!accessToken && chosenArtists.length === 6,
    refetchOnWindowFocus: false,
  });

  if (
    isLoadingAllFollowedArtists ||
    isLoadingAllTopArtistsPages ||
    isArtistsAlbumsLoading
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6 items-center">
      {artistsAlbums?.map((album) => (
        <div key={album.url}>
          <a href={album.url}>
            <img
              className="w-full h-auto aspect-square object-cover xl:max-h-[40vh]"
              src={album.image}
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default AlbumOptions;
