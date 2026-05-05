const CATEGORIES = ['Study', 'Tech', 'Creative', 'Entertainment', 'Other'];

function categorizeVideo(title, channel) {
  const text = `${title} ${channel}`.toLowerCase();

  const keywords = {
    Study: ['tutorial', 'course', 'learn', 'lesson', 'education', 'study', 'academy', 'university', 'lecture', 'how to', 'guide', 'explained', 'crash course', 'basics', 'introduction', 'fundamentals'],
    Tech: ['programming', 'coding', 'software', 'developer', 'engineering', 'ai', 'machine learning', 'web dev', 'app', 'framework', 'language', 'code', 'git', 'database', 'cloud', 'devops', 'hack', 'computer', 'tech'],
    Creative: ['music', 'art', 'design', 'drawing', 'painting', 'photography', 'film', 'animation', 'editing', 'graphic', 'creative', 'song', 'cover', 'portfolio', 'sketch'],
    Entertainment: ['game', 'gaming', 'play', 'funny', 'comedy', 'reaction', 'vlog', 'podcast', 'talk show', 'movie', 'trailer', 'entertainment', 'meme', 'challenge', 'story'],
  };

  for (const category of CATEGORIES.slice(0, -1)) {
    for (const keyword of keywords[category]) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Other';
}

module.exports = { categorizeVideo, CATEGORIES };
