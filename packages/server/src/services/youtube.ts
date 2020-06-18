import fetch from 'node-fetch';

interface APIVideoID {
  kind: string;
  videoId: string;
}

interface APIThumbnail {
  url: string;
  width: string;
  height: string;
}

interface APISnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: { [key: string]: APIThumbnail };
  channelTitle: string;
  liveBroadcastContent: string;
}

interface APIItem {
  kind: string;
  etag: string;
  id: APIVideoID;
  snippet: APISnippet;
}

interface YoutubeVideoItem {
  videoId: string;
  title: string;
}

const searchForTrack = (title: string, artist: string): Promise<string> => {
  const request = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    `${title} ${artist}`
  )}&type=video&videoEmbeddable=true&maxResults=5&videoCategoryId=10&key=${
    process.env.YOUTUBE_API_KEY
  }`;
  return fetch(request)
    .then((res) => res.json())
    .then((data) => {
      const apiItems: APIItem[] = data.items;
      const items: YoutubeVideoItem[] = apiItems.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title
      }));

      return items[0].videoId;
    });
};

export { searchForTrack };
