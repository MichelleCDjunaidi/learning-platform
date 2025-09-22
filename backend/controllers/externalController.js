const axios = require("axios");

const searchYoutube = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 5,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      channel: item.snippet.channelTitle,
    }));

    res.json({ results: videos });
  } catch (err) {
    console.error("YouTube API error:", err.response?.data || err.message);
    res.status(502).json({ error: "Failed to fetch YouTube data" });
  }
};

module.exports = { searchYoutube };
