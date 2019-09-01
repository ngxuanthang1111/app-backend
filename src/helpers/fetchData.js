const fetch = require('node-fetch');
const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = require('../config');

async function fetchLatestYoutubeVideos(options) {
  const mrOpt = 'maxResults' in options ? `maxResults=${options.maxResults}` : ``;
  const paOpt = 'publishedAfter' in options ? `publishedAfter=${options.publishedAfter}` : '';
  const optUrl = [mrOpt, paOpt].join('&') || '';
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&order=date&${optUrl}`;
  try {
    const resp = await fetch(apiUrl);
    const { items, error } = await resp.json();

    if (error && error.errors[0].reason === 'keyInvalid') {
      // eslint-disable-next-line no-console
      console.log(`Invalid 'YOUTUBE_API_KEY'`);
      return [];
    }

    return items.map(({ id: { videoId: videoID }, snippet: { title, publishedAt: date, description, thumbnails: { high: { url: thumbnail } } } }) => {
      return {
        type: 'video',
        name: title,
        date,
        description,
        url: `https://www.youtube.com/watch?v=${videoID}`,
        videoID,
        thumbnail,
      };
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return [];
  }
}

module.exports = { fetchLatestYoutubeVideos };
