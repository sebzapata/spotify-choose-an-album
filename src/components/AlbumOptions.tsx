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
  const [chosenAlbums, setChosenAlbums] = useState<
    { url: string; image: string }[]
  >([]);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(true);

  const { accessToken } = useSpotifyAuth();
  const { selectedMode } = useSpotify();

  const {
    data: usersTopArtists,
    isLoading: isTopArtistsLoading,
    fetchNextPage: fetchNextArtistsPage,
    isFetching: isFetchingArtists,
    hasNextPage: hasNextArtistsPage,
  } = useInfiniteQuery({
    queryKey: ["getUsersTopArtists", accessToken],
    queryFn: ({ pageParam = 1 }) => {
      if (accessToken) {
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
    enabled: !!accessToken && selectedMode === "History", // Only run when we have access token
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  useEffect(() => {
    if (!usersTopArtists || isFetchingArtists || !hasNextArtistsPage) return;

    fetchNextArtistsPage();
  }, [
    usersTopArtists,
    isFetchingArtists,
    hasNextArtistsPage,
    fetchNextArtistsPage,
  ]);

  useEffect(() => {
    if (!hasNextArtistsPage && !isFetchingArtists) {
      setIsLoadingAllPages(false);
    } else if (isTopArtistsLoading || isFetchingArtists || hasNextArtistsPage) {
      setIsLoadingAllPages(true);
    }
  }, [
    usersTopArtists,
    hasNextArtistsPage,
    isFetchingArtists,
    isTopArtistsLoading,
  ]);

  // const {
  //   data: usersTopTracks,
  //   isLoading: isTopTracksLoading,
  //   fetchNextPage: fetchNextTracksPage,
  //   isFetching: isFetchingTracks,
  //   hasNextPage: hasNextTracksPage,
  // } = useInfiniteQuery({
  //   queryKey: ["getUsersTopTracks", accessToken],
  //   queryFn: ({ pageParam = 1 }) => {
  //     if (accessToken) {
  //       return getUsersTopItems(
  //         "tracks",
  //         "long_term",
  //         accessToken,
  //         (pageParam - 1) * 50
  //       );
  //     }
  //   },
  //   getNextPageParam: (lastPage, allPages) => {
  //     // Only return next page if current page has 100 items (full page)
  //     if (lastPage?.items?.length === 50) {
  //       return allPages.length + 1;
  //     }
  //     return undefined; // No more pages
  //   },
  //   initialPageParam: 1,
  //   enabled: !!accessToken, // Only run when we have access token
  //   refetchOnWindowFocus: false, // Don't refetch when window regains focus
  // });

  // useEffect(() => {
  //   if (!usersTopTracks || isFetchingTracks || !hasNextTracksPage) return;

  //   // Auto-fetch next page if we have more data available
  //   fetchNextTracksPage();
  // }, [
  //   usersTopTracks,
  //   isFetchingTracks,
  //   hasNextTracksPage,
  //   fetchNextTracksPage,
  // ]);

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
      console.log("in here");
      console.log("isloadingALlpages", isLoadingAllPages);
      // if (
      //   !isLoadingAllPages &&
      //   !isTopArtistsLoading &&
      //   usersTopArtists &&
      //   chosenArtists.length !== 6
      // ) {
      //   const flattenedArtistsHistory = usersTopArtists.pages.flatMap(
      //     (page) => page?.items
      //   );

      //   console.log("flattened", flattenedArtistsHistory);
      //   const randomNumber = Math.floor(
      //     Math.random() * flattenedArtistsHistory.length
      //   );

      //   const randomArtistId = flattenedArtistsHistory.map(
      //     (artist) => artist?.id
      //   );

      //   setChosenArtists((prev) => {
      //     if (prev.includes(randomArtistId)) {
      //       return [...prev];
      //     }

      //     return [...prev, randomArtistId];
      //   });
      // }
    }
  }, [chosenArtists, allFollowedArtistsData]);

  console.log("chosen albums", chosenAlbums);

  if (isLoadingAllFollowedArtists || isLoadingAllPages) {
    return <LoadingSpinner />;
  }

  if (
    (selectedMode === "Followed" && !allFollowedArtistsData) ||
    (selectedMode === "History" && !usersTopArtists)
  ) {
    return null;
  }

  // const topTrackArtists = usersTopTracks.pages.flatMap((page) =>
  //   page?.items.flatMap((item) => item.artists[0].name)
  // );

  // const uniqueTopTrackArtists = [...new Set(topTrackArtists)];

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
