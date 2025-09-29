import axios from "axios";

type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  album_group: string;
};

type Image = {
  url: string;
  height: number;
  width: number;
};

type Artist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type GetArtistAlbumsResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Album[];
};

export const getArtistsAlbums = async (
  artistId: string,
  token: string,
  offset: number
) => {
  const searchParams = `include_groups=album&offset=${offset}&limit=50`;

  const url = `https://api.spotify.com/v1/artists/${artistId}/albums?${searchParams}`;

  const response = await axios.get<GetArtistAlbumsResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
