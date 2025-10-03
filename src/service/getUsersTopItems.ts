import axios from "axios";

interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_playable: boolean;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: "album";
  uri: string;
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
}

interface SpotifyArtistFull {
  external_urls: SpotifyExternalUrls;
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

type SpotifyTracksResponse = SpotifyPaginatedResponse<SpotifyTrack>;
type SpotifyArtistsResponse = SpotifyPaginatedResponse<SpotifyArtistFull>;

export const getUsersTopItems = async <T extends "artists" | "tracks">(
  type: T,
  timeRange: "short_term" | "medium_term" | "long_term",
  token: string,
  offset: number
): Promise<
  T extends "artists" ? SpotifyArtistsResponse : SpotifyTracksResponse
> => {
  const searchParams = `time_range=${timeRange}&offset=${offset}&limit=50`;

  const url = `https://api.spotify.com/v1/me/top/${type}?${searchParams}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
