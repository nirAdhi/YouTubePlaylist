const CATEGORIES = [
  'Learning',
  'Tech',
  'Music',
  'Gaming',
  'Funny',
  'Motivational',
  'Relaxing',
  'Fitness',
  'Cooking',
  'News',
  'Productivity',
  'Creative',
  'Entertainment',
  'Other',
];

const KEYWORDS = {
  Learning: {
    score: 1,
    words: [
      'tutorial','course','learn','lesson','education','study','academy',
      'university','lecture','how to','guide','explained','crash course',
      'basics','introduction','fundamentals','class','lecture','training',
      'documentary','science','history','math','physics','chemistry',
      'biology','psychology','philosophy','economics','language','exam',
    ],
  },
  Tech: {
    score: 1,
    words: [
      'programming','coding','software','developer','engineering','ai',
      'artificial intelligence','machine learning','web dev','app',
      'framework','language','code','git','database','cloud','devops',
      'hack','computer','tech','gadget','review','unboxing','smartphone',
      'laptop','pc build','linux','windows','android','ios','blockchain',
      'crypto','cybersecurity','network','server','api','algorithm',
    ],
  },
  Music: {
    score: 1.2,
    words: [
      'music','song','cover','remix','album','concert','live performance',
      'singing','singer','band','artist','playlist','spotify','lyrics',
      'guitar','piano','drums','violin','instrumental','lo-fi','lofi',
      'jazz','rock','pop','hip hop','rap','classical','electronic','edm',
      'medley','acoustic','karaoke','orchestra','beats','dj','mixtape',
    ],
  },
  Gaming: {
    score: 1,
    words: [
      'game','gaming','gameplay','playthrough','walkthrough','speedrun',
      'esports','tournament','minecraft','fortnite','valorant','call of duty',
      'gta','zelda','mario','nintendo','playstation','xbox','pc game',
      'rpg','fps','mmo','strategy','indie game','retro','lets play',
      'stream highlights','noob','pro gamer','ranked',
    ],
  },
  Funny: {
    score: 1.2,
    words: [
      'funny','comedy','hilarious','laugh','prank','meme','standup',
      'sketch comedy','parody','satire','joke','reaction','fail','bloopers',
      'compilation','try not to laugh','roast','troll','awkward','cringe',
      'vine','tiktok','shorts funny','comic','humor','comedian','impression',
    ],
  },
  Motivational: {
    score: 1,
    words: [
      'motivation','motivational','inspiration','inspirational','success',
      'mindset','grind','hustle','self improvement','personal growth',
      'confidence','leadership','speech','ted talk','keynote','advice',
      'life lessons','never give up','discipline','goal setting','productivity',
      'morning routine','habits','stoicism','entrepreneur','millionaire',
      'billionaire','wealth','rich','luxury','dream big','positive',
    ],
  },
  Relaxing: {
    score: 1.2,
    words: [
      'relax','relaxing','chill','ambient','meditation','yoga','sleep',
      'nature sounds','rain','ocean','forest','fireplace','asmr','calm',
      'peaceful','zen','tranquil','healing','reiki','spa','massage',
      'stress relief','anxiety relief','deep sleep','study music',
      'lofi hip hop','beats to relax','slow','gentle','cozy','aesthetic',
    ],
  },
  Fitness: {
    score: 1,
    words: [
      'fitness','workout','gym','exercise','training','bodybuilding',
      'cardio','hiit','yoga','pilates','stretching','home workout',
      'abs','core','strength','muscle','fat loss','weight loss','diet',
      'nutrition','health','wellness','running','cycling','swimming',
      'crossfit','calisthenics','mobility','flexibility','marathon',
    ],
  },
  Cooking: {
    score: 1,
    words: [
      'cooking','recipe','chef','kitchen','food','meal prep','baking',
      'dessert','breakfast','lunch','dinner','snack','healthy eating',
      'restaurant','street food','bbq','grill','pasta','pizza','sushi',
      'burger','cake','chocolate','vegan','vegetarian','keto','protein',
      'smoothie','cocktail','drink','food review','mukbang','tasty',
    ],
  },
  News: {
    score: 1,
    words: [
      'news','breaking news','current events','politics','election',
      'government','policy','debate','interview','press conference',
      'report','investigation','expose','scandal','war','conflict',
      'weather','sports news','business news','finance','stock market',
      'update','daily','weekly','roundup','world news','local news',
    ],
  },
  Productivity: {
    score: 1,
    words: [
      'productivity','time management','focus','deep work','study with me',
      'work with me','pomodoro','concentration','minimalism','organization',
      'planner','bullet journal','notion','evernote','todo','task manager',
      'workflow','automation','efficiency','life hack','study tips',
      'exam prep','student','college','university life','career advice',
    ],
  },
  Creative: {
    score: 1,
    words: [
      'art','design','drawing','painting','sketch','illustration','digital art',
      'graphic design','ui design','ux design','photography','film making',
      'animation','3d modeling','blender','photoshop','illustrator','procreate',
      'watercolor','oil painting','portrait','landscape','architecture',
      'fashion design','interior design','craft','diy','handmade','creative',
    ],
  },
  Entertainment: {
    score: 1,
    words: [
      'movie','tv show','series','netflix','disney','marvel','dc','anime',
      'cartoon','review','ranking','top 10','trailer','behind the scenes',
      'celebrity','gossip','drama','reality tv','talent show','survival',
      'escape room','magic','illusion','stunt','extreme','parkour','travel',
      'vlog','road trip','adventure','explore','culture','festival','event',
    ],
  },
};

const CHANNEL_CATEGORIES = {
  'lofi girl': 'Relaxing',
  'chilledcow': 'Relaxing',
  'chill hop music': 'Relaxing',
  'the coding train': 'Tech',
  'traversy media': 'Tech',
  'fireship': 'Tech',
  'freecodecamp': 'Learning',
  'cs50': 'Learning',
  'kurzgesagt': 'Learning',
  'veritasium': 'Learning',
  '3blue1brown': 'Learning',
  'mkbhd': 'Tech',
  'linus tech tips': 'Tech',
  'unbox therapy': 'Tech',
  'dave2d': 'Tech',
  'mrwhosetheboss': 'Tech',
  'pewdiepie': 'Gaming',
  'markiplier': 'Gaming',
  'jacksepticeye': 'Gaming',
  'dream': 'Gaming',
  'mrbeast': 'Entertainment',
  'jre clips': 'Motivational',
  'jordan peterson': 'Motivational',
  'hamza': 'Motivational',
  'improvement pill': 'Motivational',
  'better ideas': 'Motivational',
  'gordon ramsay': 'Cooking',
  'bon appetit': 'Cooking',
  'joshua weissman': 'Cooking',
  'tasty': 'Cooking',
  'buzzfeed tasty': 'Cooking',
  'hasanabi': 'News',
  'philip defranco': 'News',
  'daily dose of internet': 'Entertainment',
  ' FailArmy': 'Funny',
  'what would you do': 'Entertainment',
  'bbc earth': 'Relaxing',
  'nature relax': 'Relaxing',
  'relaxation film': 'Relaxing',
  'penguinz0': 'Funny',
  'cody ko': 'Funny',
  'drew gooden': 'Funny',
  'danny gonzalez': 'Funny',
};

function categorizeVideo(title, channel) {
  const text = `${title} ${channel}`.toLowerCase();
  const channelLower = channel.toLowerCase().trim();

  // Check known channels first
  for (const [knownChannel, category] of Object.entries(CHANNEL_CATEGORIES)) {
    if (channelLower.includes(knownChannel)) {
      return category;
    }
  }

  // Score-based categorization
  const scores = {};
  for (const category of CATEGORIES.slice(0, -1)) {
    scores[category] = 0;
    const config = KEYWORDS[category];
    if (!config) continue;

    for (const keyword of config.words) {
      // Exact word match gets higher score
      const wordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordRegex.test(text)) {
        scores[category] += config.score * 2;
      } else if (text.includes(keyword)) {
        scores[category] += config.score;
      }
    }
  }

  // Find category with highest score
  let bestCategory = 'Other';
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  // Require minimum threshold to avoid random categorization
  return bestScore >= 1 ? bestCategory : 'Other';
}

module.exports = { categorizeVideo, CATEGORIES };
