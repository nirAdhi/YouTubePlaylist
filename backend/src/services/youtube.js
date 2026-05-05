async function fetchYouTubeMetadata(url) {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Use noembed for metadata
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      title: data.title || 'Unknown Title',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channel: data.author_name || 'Unknown Channel',
      duration: 'Unknown',
      videoId,
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    throw error;
  }
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

module.exports = { fetchYouTubeMetadata, extractVideoId };
