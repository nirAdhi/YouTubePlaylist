async function fetchMetadata(url) {
  const platform = detectPlatform(url);
  const normalizedUrl = normalizeUrl(url, platform);

  try {
    // Try noembed first for supported platforms
    if (['youtube', 'vimeo', 'twitter', 'reddit', 'dailymotion', 'twitch'].includes(platform)) {
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(normalizedUrl)}`);
      const data = await response.json();

      if (data.title) {
        return {
          title: data.title,
          thumbnail: data.thumbnail_url || getFallbackThumbnail(platform, url),
          channel: data.author_name || platform,
          duration: 'Unknown',
          videoId: extractVideoId(url, platform),
          platform,
          normalizedUrl,
        };
      }
    }
  } catch (e) {
    console.log('noembed failed, using fallback for', platform);
  }

  // Fallback: basic info from URL
  return {
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
    thumbnail: getFallbackThumbnail(platform, url),
    channel: platform,
    duration: 'Unknown',
    videoId: extractVideoId(url, platform),
    platform,
    normalizedUrl,
  };
}

function detectPlatform(url) {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('vimeo.com')) return 'vimeo';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
  if (lower.includes('tiktok.com') || lower.includes('vm.tiktok.com')) return 'tiktok';
  if (lower.includes('reddit.com')) return 'reddit';
  if (lower.includes('dailymotion.com')) return 'dailymotion';
  if (lower.includes('twitch.tv')) return 'twitch';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('threads.net')) return 'threads';
  return 'other';
}

function extractVideoId(url, platform) {
  const patterns = {
    youtube: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s?]+)/,
    ],
    vimeo: [/(?:vimeo\.com\/)(\d+)/],
    twitter: [/(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/],
    facebook: [/(?:facebook\.com\/[^\/]+\/videos\/|fb\.watch\/)([^\/?\s]+)/],
    instagram: [/(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([^\/?\s]+)/],
    tiktok: [/(?:tiktok\.com\/(?:@[^\/]+\/video\/|v\/)|vm\.tiktok\.com\/)([^\/?\s]+)/],
    reddit: [/(?:reddit\.com)\/r\/[^\/]+\/comments\/(\w+)/],
    dailymotion: [/(?:dailymotion\.com\/video\/)([^\/?\s]+)/],
    twitch: [/(?:twitch\.tv\/videos\/(\d+))/],
  };

  const platformPatterns = patterns[platform] || [];
  for (const pattern of platformPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  // Fallback: hash the normalized URL
  return hashUrl(url);
}

function normalizeUrl(url, platform) {
  try {
    const u = new URL(url);

    // Remove common tracking params
    const trackingParams = [
      'si', 'feature', 'ref', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_term', 'utm_content', 'fbclid', 'gclid', 'ttclid', 'igshid',
      'source', 'context', 's', 't', 'st', 'sp', 'e', 'ab_channel',
    ];

    // Keep essential platform params
    const keepParams = {
      youtube: ['v', 'list', 'start', 't'],
      vimeo: [],
      facebook: [],
      instagram: [],
      tiktok: [],
      twitter: [],
    };

    const keep = keepParams[platform] || [];

    for (const param of [...u.searchParams.keys()]) {
      if (trackingParams.includes(param) && !keep.includes(param)) {
        u.searchParams.delete(param);
      }
    }

    // Clean YouTube URL
    if (platform === 'youtube') {
      const videoId = u.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      if (u.hostname === 'youtu.be') {
        return `https://www.youtube.com/watch?v=${u.pathname.slice(1)}`;
      }
      if (u.pathname.includes('/shorts/')) {
        const shortsId = u.pathname.split('/shorts/')[1];
        return `https://www.youtube.com/watch?v=${shortsId}`;
      }
    }

    return u.toString();
  } catch {
    return url;
  }
}

function hashUrl(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function getFallbackThumbnail(platform, url) {
  const id = extractVideoId(url, platform);
  const thumbs = {
    youtube: id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '',
    vimeo: '',
    twitter: '',
    facebook: '',
    instagram: '',
    tiktok: '',
  };
  return thumbs[platform] || '';
}

module.exports = { fetchMetadata, extractVideoId, detectPlatform, normalizeUrl };
