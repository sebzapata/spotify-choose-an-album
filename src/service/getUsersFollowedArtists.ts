import axios from "axios";

type Artist = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
};

type GetUsersFollowedArtistsResponse = {
  artists: {
    href: string;
    limit: number;
    next: string | null;
    cursors: {
      after: string;
      before?: string;
    };
    total: number;
    items: Artist[];
  };
};

export type GetAllUsersFollowedArtistsPaginatedResponse = {
  artists: {
    total: number;
    items: Artist[];
  };
};

export const getAllUsersFollowedArtists = async (
  token: string,
  after?: string
) => {
  let searchParams = `type=artist&limit=50`;
  if (after) {
    searchParams += `&after=${after}`;
  }

  const url = `https://api.spotify.com/v1/me/following?${searchParams}`;

  const response = await axios.get<GetUsersFollowedArtistsResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllUsersFollowedArtistsPaginated = async (
  token: string
): Promise<GetAllUsersFollowedArtistsPaginatedResponse> => {
  const allArtists: Artist[] = [];

  let after: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await getAllUsersFollowedArtists(token, after);

    allArtists.push(...response.artists.items);

    if (response.artists.cursors?.after) {
      after = response.artists.cursors.after;
    } else {
      hasMore = false;
    }
  }

  return {
    artists: {
      total: allArtists.length,
      items: allArtists,
    },
  };
};
