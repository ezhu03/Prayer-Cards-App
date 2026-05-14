const STORAGE_KEY = "prayer-cards:v1";
const FLAG_STORAGE_KEY = "prayer-cards:flags:v1";
const SETTINGS_STORAGE_KEY = "prayer-cards:settings:v1";

const cadenceDays = {
  low: 7,
  medium: 3,
  high: 1,
};

const cadenceBounds = {
  low: { min: 4, max: 14 },
  medium: { min: 2, max: 7 },
  high: { min: 0.75, max: 3 },
};

const flagColorPalette = [
  "#2f80ed",
  "#27ae60",
  "#f2994a",
  "#eb5757",
  "#9b51e0",
  "#00a7b5",
  "#f2c94c",
  "#bb2f6a",
  "#16a085",
  "#6c63ff",
  "#d35400",
  "#c0392b",
  "#2d9cdb",
  "#7cb342",
  "#8e44ad",
  "#ff6f91",
];

const suggestionStopWords = new Set([
  "a",
  "about",
  "after",
  "all",
  "also",
  "am",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "but",
  "by",
  "can",
  "could",
  "do",
  "does",
  "for",
  "from",
  "get",
  "give",
  "go",
  "god",
  "got",
  "had",
  "has",
  "have",
  "he",
  "help",
  "her",
  "him",
  "his",
  "how",
  "i",
  "in",
  "is",
  "it",
  "jesus",
  "just",
  "lord",
  "me",
  "my",
  "need",
  "needs",
  "new",
  "of",
  "on",
  "or",
  "our",
  "please",
  "pray",
  "prayer",
  "request",
  "she",
  "so",
  "some",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "up",
  "us",
  "was",
  "we",
  "with",
  "would",
]);

const suggestionIntentProfiles = [
  {
    terms: ["job", "career", "interview", "boss", "coworker", "promotion", "laid off", "unemployed", "workplace"],
    categories: ["work", "business", "unemployment", "workplace-conflict", "leadership", "integrity"],
  },
  {
    terms: ["sick", "illness", "diagnosis", "surgery", "doctor", "hospital", "cancer", "pain", "therapy"],
    categories: ["health", "healing", "chronic-illness", "medical-staff", "surgery", "diagnosis", "cancer"],
  },
  {
    terms: ["anxious", "anxiety", "panic", "stress", "fear", "worried", "overwhelmed", "sleep"],
    categories: ["anxiety", "mental-health", "panic", "sleep", "rest", "peace", "decision-pressure"],
  },
  {
    terms: ["sad", "grief", "death", "loss", "funeral", "mourning", "crying", "brokenhearted"],
    categories: ["grief", "loss", "comfort", "funeral", "mourning", "suffering"],
  },
  {
    terms: ["marriage", "spouse", "husband", "wife", "dating", "relationship", "reconcile", "conflict"],
    categories: ["marriage", "relationships", "reconciliation", "conflict", "forgiveness", "patience-with-people"],
  },
  {
    terms: ["child", "children", "teen", "parent", "baby", "pregnant", "miscarriage", "adoption", "foster"],
    categories: ["parenting", "pregnancy", "infertility", "miscarriage", "postpartum", "adoption", "disciples-children"],
  },
  {
    terms: ["money", "finance", "debt", "rent", "bills", "mortgage", "poverty", "budget", "income"],
    categories: ["provision", "debt", "financial-wisdom", "poverty", "generosity", "contentment", "business"],
  },
  {
    terms: ["school", "exam", "test", "college", "study", "teacher", "class", "student"],
    categories: ["school", "exam-peace", "study", "teacher", "wisdom", "discipline"],
  },
  {
    terms: ["home", "house", "move", "apartment", "roommate", "neighbor", "housing"],
    categories: ["home", "moving", "housing", "neighborhood", "hospitality", "provision"],
  },
  {
    terms: ["safe", "unsafe", "abuse", "violence", "assault", "danger", "protect", "trauma"],
    categories: ["protection", "abuse", "trauma", "safety", "justice", "peace-world"],
  },
  {
    terms: ["faith", "doubt", "unbelief", "church", "ministry", "gospel", "mission", "disciple"],
    categories: ["faith-growth", "doubt", "church", "ministry", "evangelism", "mission", "discipleship", "scripture"],
  },
  {
    terms: ["court", "legal", "lawyer", "lawsuit", "custody", "immigration", "visa", "asylum"],
    categories: ["legal", "justice", "immigration", "truth", "government"],
  },
];

const verseSuggestions = [
  {
    category: "work",
    keywords: ["job", "work", "career", "interview", "boss", "coworker", "employment", "calling", "labor"],
    reference: "Colossians 3:23",
    text: "Whatever you do, work heartily, as for the Lord and not for men.",
  },
  {
    category: "health",
    keywords: ["health", "sick", "illness", "pain", "doctor", "healing", "surgery", "cancer", "hospital"],
    reference: "Jeremiah 17:14",
    text: "Heal me, O LORD, and I shall be healed; save me, and I shall be saved.",
  },
  {
    category: "anxiety",
    keywords: ["peace", "anxiety", "anxious", "stress", "fear", "worry", "overwhelmed", "panic"],
    reference: "Philippians 4:6",
    text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.",
  },
  {
    category: "wisdom",
    keywords: ["wisdom", "decision", "discernment", "direction", "guidance", "choice", "clarity"],
    reference: "James 1:5",
    text: "If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach.",
  },
  {
    category: "relationships",
    keywords: ["family", "marriage", "child", "children", "parent", "friend", "relationship", "community"],
    reference: "1 Thessalonians 5:11",
    text: "Therefore exhort one another, and build each other up, even as you also do.",
  },
  {
    category: "grief",
    keywords: ["grief", "loss", "sad", "comfort", "mourning", "lonely", "death", "bereaved"],
    reference: "Psalm 34:18",
    text: "The LORD is near to those who have a broken heart, and saves those who have a crushed spirit.",
  },
  {
    category: "provision",
    keywords: ["money", "finance", "financial", "rent", "debt", "provision", "bills", "income"],
    reference: "Philippians 4:19",
    text: "My God will supply every need of yours according to his riches in glory in Christ Jesus.",
  },
  {
    category: "endurance",
    keywords: ["faith", "hope", "trust", "strength", "patience", "endurance", "persevere"],
    reference: "Isaiah 40:31",
    text: "Those who wait for the LORD will renew their strength.",
  },
  {
    category: "protection",
    keywords: ["protect", "protection", "safe", "safety", "danger", "travel", "trip", "commute"],
    reference: "Psalm 121:7",
    text: "The LORD will keep you from all evil; he will keep your life.",
  },
  {
    category: "courage",
    keywords: ["courage", "brave", "afraid", "fearful", "bold", "confidence", "strength"],
    reference: "Joshua 1:9",
    text: "Be strong and courageous. Do not be frightened, and do not be dismayed.",
  },
  {
    category: "rest",
    keywords: ["rest", "tired", "weary", "burnout", "exhausted", "sleep", "fatigue"],
    reference: "Matthew 11:28",
    text: "Come to me, all who labor and are heavy laden, and I will give you rest.",
  },
  {
    category: "temptation",
    keywords: ["temptation", "habit", "addiction", "purity", "self-control", "relapse", "compulsion"],
    reference: "1 Corinthians 10:13",
    text: "God is faithful, and he will not let you be tempted beyond your ability.",
  },
  {
    category: "forgiveness",
    keywords: ["forgive", "forgiveness", "resentment", "bitterness", "offense", "mercy"],
    reference: "Ephesians 4:32",
    text: "Be kind to one another, tenderhearted, forgiving one another.",
  },
  {
    category: "repentance",
    keywords: ["repent", "sin", "guilt", "shame", "confess", "return", "restore"],
    reference: "1 John 1:9",
    text: "If we confess our sins, he is faithful and just to forgive us our sins.",
  },
  {
    category: "joy",
    keywords: ["joy", "glad", "celebrate", "thankful", "gratitude", "praise", "rejoice"],
    reference: "Psalm 16:11",
    text: "In your presence there is fullness of joy.",
  },
  {
    category: "depression",
    keywords: ["depressed", "depression", "despair", "downcast", "hopeless", "discouraged"],
    reference: "Psalm 42:11",
    text: "Hope in God; for I shall again praise him, my salvation and my God.",
  },
  {
    category: "identity",
    keywords: ["identity", "worth", "value", "beloved", "accepted", "insecure"],
    reference: "Ephesians 2:10",
    text: "For we are his workmanship, created in Christ Jesus for good works.",
  },
  {
    category: "conflict",
    keywords: ["conflict", "argument", "anger", "fight", "reconcile", "enemy", "tension"],
    reference: "Romans 12:18",
    text: "If possible, so far as it depends on you, live peaceably with all.",
  },
  {
    category: "justice",
    keywords: ["justice", "unfair", "oppression", "poor", "mercy", "advocate", "wronged"],
    reference: "Micah 6:8",
    text: "Do justice, and to love kindness, and to walk humbly with your God.",
  },
  {
    category: "parenting",
    keywords: ["parenting", "mother", "father", "child", "children", "baby", "teen"],
    reference: "Proverbs 22:6",
    text: "Train up a child in the way he should go.",
  },
  {
    category: "marriage",
    keywords: ["marriage", "spouse", "husband", "wife", "engaged", "wedding"],
    reference: "Ephesians 5:2",
    text: "Walk in love, as Christ loved us and gave himself up for us.",
  },
  {
    category: "leadership",
    keywords: ["leader", "leadership", "manage", "mentor", "pastor", "teacher", "supervise"],
    reference: "Mark 10:45",
    text: "The Son of Man came not to be served but to serve.",
  },
  {
    category: "school",
    keywords: ["school", "study", "exam", "test", "college", "class", "learn"],
    reference: "Proverbs 2:6",
    text: "For the LORD gives wisdom; from his mouth come knowledge and understanding.",
  },
  {
    category: "waiting",
    keywords: ["wait", "waiting", "delayed", "patience", "timing", "season"],
    reference: "Psalm 27:14",
    text: "Wait for the LORD; be strong, and let your heart take courage.",
  },
  {
    category: "home",
    keywords: ["home", "house", "move", "housing", "roommate", "neighbor"],
    reference: "Psalm 127:1",
    text: "Unless the LORD builds the house, those who build it labor in vain.",
  },
  {
    category: "evangelism",
    keywords: ["witness", "evangelism", "share", "gospel", "mission", "neighbor"],
    reference: "Matthew 5:16",
    text: "Let your light shine before others, so that they may see your good works.",
  },
  {
    category: "church",
    keywords: ["church", "ministry", "serve", "volunteer", "small group", "pastor"],
    reference: "1 Peter 4:10",
    text: "As each has received a gift, use it to serve one another.",
  },
  {
    category: "hope",
    keywords: ["hope", "future", "promise", "waiting", "uncertain", "discouraged"],
    reference: "Romans 15:13",
    text: "May the God of hope fill you with all joy and peace in believing.",
  },
  {
    category: "loss",
    keywords: ["loss", "lost", "mourning", "tears", "sorrow", "brokenhearted"],
    reference: "Revelation 21:4",
    text: "He will wipe away every tear from their eyes.",
  },
  {
    category: "guidance",
    keywords: ["path", "guide", "direction", "steps", "future", "decision"],
    reference: "Proverbs 3:5",
    text: "Trust in the LORD with all your heart, and do not lean on your own understanding.",
  },
  {
    category: "prayer",
    keywords: ["prayer", "pray", "intercede", "listen", "hear", "ask"],
    reference: "1 John 5:14",
    text: "If we ask anything according to his will he hears us.",
  },
  {
    category: "healing",
    keywords: ["heal", "healing", "wound", "trauma", "recover", "recovery"],
    reference: "Psalm 147:3",
    text: "He heals the brokenhearted and binds up their wounds.",
  },
  {
    category: "loneliness",
    keywords: ["alone", "lonely", "isolated", "forgotten", "friendless", "abandoned"],
    reference: "Deuteronomy 31:8",
    text: "He will not leave you or forsake you.",
  },
  {
    category: "friendship",
    keywords: ["friend", "friendship", "companion", "best friend", "community", "belonging"],
    reference: "Proverbs 17:17",
    text: "A friend loves at all times.",
  },
  {
    category: "pregnancy",
    keywords: ["pregnant", "pregnancy", "birth", "labor", "baby", "expecting", "newborn"],
    reference: "Psalm 139:13",
    text: "For you formed my inward parts; you knitted me together in my mother's womb.",
  },
  {
    category: "infertility",
    keywords: ["infertility", "miscarriage", "barren", "trying to conceive", "fertility"],
    reference: "Psalm 113:9",
    text: "He gives the barren woman a home, making her the joyous mother of children.",
  },
  {
    category: "caregiving",
    keywords: ["caregiver", "caregiving", "caretaker", "aging parent", "elderly", "nursing"],
    reference: "Galatians 6:9",
    text: "Let us not grow weary of doing good.",
  },
  {
    category: "aging",
    keywords: ["aging", "old age", "elderly", "retirement", "frail", "memory"],
    reference: "Isaiah 46:4",
    text: "Even to your old age I am he.",
  },
  {
    category: "mental-health",
    keywords: ["mental health", "therapy", "counseling", "panic", "ocd", "ptsd", "bipolar"],
    reference: "2 Timothy 1:7",
    text: "God gave us a spirit not of fear but of power and love and self-control.",
  },
  {
    category: "suicidal-thoughts",
    keywords: ["suicidal", "suicide", "self harm", "self-harm", "not want to live"],
    reference: "Psalm 118:17",
    text: "I shall not die, but I shall live, and recount the deeds of the LORD.",
  },
  {
    category: "abuse",
    keywords: ["abuse", "abused", "violence", "domestic", "unsafe", "assault", "harm"],
    reference: "Psalm 9:9",
    text: "The LORD is a stronghold for the oppressed.",
  },
  {
    category: "legal",
    keywords: ["legal", "court", "lawsuit", "judge", "trial", "lawyer", "custody"],
    reference: "Psalm 37:5",
    text: "Commit your way to the LORD; trust in him, and he will act.",
  },
  {
    category: "immigration",
    keywords: ["immigration", "visa", "citizenship", "refugee", "asylum", "green card"],
    reference: "Leviticus 19:34",
    text: "You shall love him as yourself, for you were strangers in the land of Egypt.",
  },
  {
    category: "military",
    keywords: ["military", "deployment", "soldier", "veteran", "combat", "service member"],
    reference: "Psalm 144:1",
    text: "Blessed be the LORD, my rock.",
  },
  {
    category: "first-responders",
    keywords: ["police", "firefighter", "paramedic", "first responder", "emergency", "ems"],
    reference: "John 15:13",
    text: "Greater love has no one than this, that someone lay down his life for his friends.",
  },
  {
    category: "medical-staff",
    keywords: ["nurse", "doctor", "surgeon", "therapist", "medical", "hospital staff"],
    reference: "Proverbs 11:25",
    text: "Whoever brings blessing will be enriched.",
  },
  {
    category: "business",
    keywords: ["business", "startup", "client", "customer", "company", "entrepreneur", "sales"],
    reference: "Proverbs 16:3",
    text: "Commit your work to the LORD, and your plans will be established.",
  },
  {
    category: "unemployment",
    keywords: ["unemployed", "layoff", "laid off", "lost job", "jobless", "hiring"],
    reference: "Matthew 6:33",
    text: "Seek first the kingdom of God and his righteousness.",
  },
  {
    category: "debt",
    keywords: ["debt", "loan", "credit", "bankruptcy", "owe", "payment", "mortgage"],
    reference: "Romans 13:8",
    text: "Owe no one anything, except to love each other.",
  },
  {
    category: "generosity",
    keywords: ["generous", "giving", "donate", "tithe", "charity", "share"],
    reference: "2 Corinthians 9:7",
    text: "God loves a cheerful giver.",
  },
  {
    category: "contentment",
    keywords: ["contentment", "envy", "jealous", "comparison", "not enough", "want more"],
    reference: "Philippians 4:11",
    text: "I have learned in whatever situation I am to be content.",
  },
  {
    category: "pride",
    keywords: ["pride", "humility", "arrogant", "ego", "humble", "boast"],
    reference: "James 4:6",
    text: "God opposes the proud but gives grace to the humble.",
  },
  {
    category: "anger",
    keywords: ["angry", "anger", "rage", "temper", "frustrated", "irritable"],
    reference: "James 1:19",
    text: "Let every person be quick to hear, slow to speak, slow to anger.",
  },
  {
    category: "speech",
    keywords: ["words", "speech", "tongue", "gossip", "slander", "conversation"],
    reference: "Ephesians 4:29",
    text: "Let no corrupting talk come out of your mouths.",
  },
  {
    category: "sexual-purity",
    keywords: ["lust", "porn", "sexual", "purity", "affair", "adultery"],
    reference: "1 Thessalonians 4:3",
    text: "This is the will of God, your sanctification.",
  },
  {
    category: "sobriety",
    keywords: ["alcohol", "drugs", "substance", "sober", "sobriety", "recovery"],
    reference: "John 8:36",
    text: "If the Son sets you free, you will be free indeed.",
  },
  {
    category: "technology",
    keywords: ["phone", "internet", "social media", "screen", "technology", "online"],
    reference: "Psalm 101:3",
    text: "I will not set before my eyes anything that is worthless.",
  },
  {
    category: "discipline",
    keywords: ["discipline", "routine", "focus", "habits", "consistency", "diligence"],
    reference: "Hebrews 12:11",
    text: "Later it yields the peaceful fruit of righteousness.",
  },
  {
    category: "decision-pressure",
    keywords: ["pressure", "deadline", "urgent", "stressful decision", "under pressure"],
    reference: "Isaiah 30:21",
    text: "This is the way, walk in it.",
  },
  {
    category: "mission",
    keywords: ["missionary", "missions", "calling", "send", "nations", "outreach"],
    reference: "Isaiah 6:8",
    text: "Here I am! Send me.",
  },
  {
    category: "persecution",
    keywords: ["persecution", "mocked", "rejected for faith", "opposed", "suffering for faith"],
    reference: "Matthew 5:10",
    text: "Blessed are those who are persecuted for righteousness' sake.",
  },
  {
    category: "doubt",
    keywords: ["doubt", "unbelief", "questioning", "skeptical", "faith crisis"],
    reference: "Mark 9:24",
    text: "I believe; help my unbelief!",
  },
  {
    category: "worship",
    keywords: ["worship", "sing", "praise", "adoration", "music", "devotion"],
    reference: "Psalm 95:6",
    text: "Oh come, let us worship and bow down.",
  },
  {
    category: "scripture",
    keywords: ["bible", "scripture", "word", "devotions", "quiet time", "read"],
    reference: "Psalm 119:105",
    text: "Your word is a lamp to my feet and a light to my path.",
  },
  {
    category: "obedience",
    keywords: ["obey", "obedience", "surrender", "submit", "follow", "yield"],
    reference: "John 14:15",
    text: "If you love me, you will keep my commandments.",
  },
  {
    category: "revival",
    keywords: ["revival", "renewal", "awaken", "restore", "church renewal"],
    reference: "Habakkuk 3:2",
    text: "In the midst of the years revive it.",
  },
  {
    category: "weather-disaster",
    keywords: ["storm", "fire", "flood", "earthquake", "disaster", "hurricane"],
    reference: "Nahum 1:7",
    text: "The LORD is good, a stronghold in the day of trouble.",
  },
  {
    category: "environment",
    keywords: ["creation", "environment", "stewardship", "climate", "earth", "garden"],
    reference: "Genesis 2:15",
    text: "The LORD God took the man and put him in the garden of Eden to work it and keep it.",
  },
  {
    category: "government",
    keywords: ["government", "leader", "president", "election", "politics", "nation"],
    reference: "1 Timothy 2:2",
    text: "For kings and all who are in high positions.",
  },
  {
    category: "peace-world",
    keywords: ["war", "peace", "conflict", "nation", "violence", "global"],
    reference: "Matthew 5:9",
    text: "Blessed are the peacemakers, for they shall be called sons of God.",
  },
  {
    category: "discipleship",
    keywords: ["disciple", "mentor", "grow", "spiritual growth", "formation"],
    reference: "Colossians 2:6",
    text: "Therefore, as you received Christ Jesus the Lord, so walk in him.",
  },
  {
    category: "hospitality",
    keywords: ["hospitality", "guest", "welcome", "host", "stranger", "neighbor"],
    reference: "Hebrews 13:2",
    text: "Do not neglect to show hospitality to strangers.",
  },
  {
    category: "compassion",
    keywords: ["compassion", "kindness", "mercy", "tender", "care", "empathy"],
    reference: "Colossians 3:12",
    text: "Put on then, as God's chosen ones, compassionate hearts.",
  },
  {
    category: "disciples-children",
    keywords: ["kids faith", "children faith", "sunday school", "youth group", "child faith"],
    reference: "Matthew 19:14",
    text: "Let the little children come to me.",
  },
  {
    category: "widows-orphans",
    keywords: ["widow", "orphan", "foster", "adoption", "vulnerable"],
    reference: "James 1:27",
    text: "To visit orphans and widows in their affliction.",
  },
  {
    category: "racial-reconciliation",
    keywords: ["race", "racism", "reconciliation", "ethnic", "division"],
    reference: "Galatians 3:28",
    text: "You are all one in Christ Jesus.",
  },
  {
    category: "workplace-conflict",
    keywords: ["work conflict", "boss conflict", "coworker conflict", "toxic workplace"],
    reference: "Colossians 4:6",
    text: "Let your speech always be gracious.",
  },
  {
    category: "creativity",
    keywords: ["creative", "art", "writing", "music", "design", "create"],
    reference: "Exodus 35:31",
    text: "He has filled him with the Spirit of God, with skill.",
  },
  {
    category: "sports",
    keywords: ["sports", "team", "competition", "athlete", "game", "coach"],
    reference: "1 Corinthians 9:24",
    text: "Run that you may obtain it.",
  },
  {
    category: "travel",
    keywords: ["travel", "flight", "road trip", "journey", "vacation", "drive"],
    reference: "Psalm 121:8",
    text: "The LORD will keep your going out and your coming in.",
  },
  {
    category: "new-season",
    keywords: ["new season", "transition", "change", "new chapter", "moving on"],
    reference: "Isaiah 43:19",
    text: "Behold, I am doing a new thing.",
  },
  {
    category: "failure",
    keywords: ["failure", "failed", "mistake", "regret", "setback", "disappointed"],
    reference: "Proverbs 24:16",
    text: "The righteous falls seven times and rises again.",
  },
  {
    category: "success",
    keywords: ["success", "promotion", "achievement", "win", "opportunity", "blessing"],
    reference: "Deuteronomy 8:18",
    text: "Remember the LORD your God, for it is he who gives you power to get wealth.",
  },
  {
    category: "thanksgiving",
    keywords: ["thanks", "thanksgiving", "grateful", "gratitude", "answered prayer"],
    reference: "1 Thessalonians 5:18",
    text: "Give thanks in all circumstances.",
  },
  {
    category: "patience-with-people",
    keywords: ["annoyed", "difficult person", "patience with", "hard to love"],
    reference: "Colossians 3:13",
    text: "Bearing with one another and, if one has a complaint, forgiving each other.",
  },
  {
    category: "suffering",
    keywords: ["suffering", "trial", "hardship", "affliction", "struggle"],
    reference: "Romans 5:3",
    text: "Suffering produces endurance.",
  },
  {
    category: "comfort",
    keywords: ["comfort", "console", "hurting", "broken", "weep", "crying"],
    reference: "2 Corinthians 1:3",
    text: "The Father of mercies and God of all comfort.",
  },
  {
    category: "unity",
    keywords: ["unity", "division", "team conflict", "together", "one another"],
    reference: "Ephesians 4:3",
    text: "Eager to maintain the unity of the Spirit in the bond of peace.",
  },
  {
    category: "discernment",
    keywords: ["discern", "discernment", "truth", "deception", "confusing", "wise choice"],
    reference: "Philippians 1:9",
    text: "That your love may abound more and more, with knowledge and all discernment.",
  },
  {
    category: "fruitfulness",
    keywords: ["fruitful", "impact", "purpose", "productive", "meaningful", "legacy"],
    reference: "John 15:5",
    text: "Whoever abides in me and I in him, he it is that bears much fruit.",
  },
  {
    category: "salvation",
    keywords: ["salvation", "saved", "come to faith", "believe in jesus", "conversion"],
    reference: "Romans 10:9",
    text: "If you confess with your mouth that Jesus is Lord.",
  },
  {
    category: "chronic-illness",
    keywords: ["chronic illness", "long term illness", "chronic pain", "flare", "autoimmune", "disability"],
    reference: "2 Corinthians 4:16",
    text: "Our inner self is being renewed day by day.",
  },
  {
    category: "surgery",
    keywords: ["surgery", "operation", "procedure", "anesthesia", "recovery room"],
    reference: "Psalm 121:2",
    text: "My help comes from the LORD, who made heaven and earth.",
  },
  {
    category: "diagnosis",
    keywords: ["diagnosis", "test results", "scan", "biopsy", "medical results", "lab results"],
    reference: "Psalm 103:2",
    text: "Bless the LORD, O my soul, and forget not all his benefits.",
  },
  {
    category: "cancer",
    keywords: ["cancer", "chemo", "radiation", "oncology", "tumor"],
    reference: "Isaiah 41:13",
    text: "I am the LORD your God who holds your right hand.",
  },
  {
    category: "sleep",
    keywords: ["sleep", "insomnia", "nightmares", "restless", "can't sleep"],
    reference: "Psalm 4:8",
    text: "In peace I will both lie down and sleep.",
  },
  {
    category: "panic",
    keywords: ["panic", "panic attack", "spiraling", "freaking out", "acute anxiety"],
    reference: "John 16:33",
    text: "In the world you will have tribulation. But take heart.",
  },
  {
    category: "burnout",
    keywords: ["burnout", "burned out", "overworked", "drained", "empty"],
    reference: "Isaiah 40:29",
    text: "He gives power to the faint.",
  },
  {
    category: "retreat",
    keywords: ["retreat", "quiet", "solitude", "sabbath", "break"],
    reference: "Mark 6:31",
    text: "Come away by yourselves to a desolate place and rest a while.",
  },
  {
    category: "funeral",
    keywords: ["funeral", "memorial", "burial", "wake", "graveside"],
    reference: "1 Thessalonians 4:13",
    text: "That you may not grieve as others do who have no hope.",
  },
  {
    category: "mourning",
    keywords: ["mourning", "mourn", "bereavement", "widower", "widowed"],
    reference: "Matthew 5:4",
    text: "Blessed are those who mourn, for they shall be comforted.",
  },
  {
    category: "near-god",
    keywords: ["feel far from god", "distant from god", "where is god", "abandoned by god"],
    reference: "Psalm 139:7",
    text: "Where shall I go from your Spirit?",
  },
  {
    category: "friendship-wisdom",
    keywords: ["bad friends", "wise friends", "friend group", "influence", "peer pressure"],
    reference: "Proverbs 13:20",
    text: "Whoever walks with the wise becomes wise.",
  },
  {
    category: "marriage-unity",
    keywords: ["marriage unity", "marriage strength", "together", "partnership"],
    reference: "Ecclesiastes 4:12",
    text: "A threefold cord is not quickly broken.",
  },
  {
    category: "marriage-patience",
    keywords: ["marriage patience", "spouse patience", "love patiently", "hard marriage"],
    reference: "1 Corinthians 13:4",
    text: "Love is patient and kind.",
  },
  {
    category: "family-devotion",
    keywords: ["family devotions", "family faith", "teach children", "raise kids in faith"],
    reference: "Deuteronomy 6:6",
    text: "These words that I command you today shall be on your heart.",
  },
  {
    category: "child-peace",
    keywords: ["child anxiety", "child peace", "kids peace", "school fear", "kid scared"],
    reference: "Isaiah 54:13",
    text: "All your children shall be taught by the LORD.",
  },
  {
    category: "prodigal",
    keywords: ["prodigal", "wayward child", "rebellious child", "left faith", "return home"],
    reference: "Luke 15:20",
    text: "While he was still a long way off, his father saw him.",
  },
  {
    category: "miscarriage",
    keywords: ["miscarriage", "pregnancy loss", "stillbirth", "lost baby"],
    reference: "Psalm 56:8",
    text: "You have kept count of my tossings.",
  },
  {
    category: "postpartum",
    keywords: ["postpartum", "new mom", "new mother", "birth recovery", "postpartum depression"],
    reference: "Psalm 22:9",
    text: "You are he who took me from the womb.",
  },
  {
    category: "singleness",
    keywords: ["single", "singleness", "lonely single", "waiting for spouse"],
    reference: "Isaiah 54:5",
    text: "For your Maker is your husband, the LORD of hosts is his name.",
  },
  {
    category: "reconciliation",
    keywords: ["reconcile", "make peace", "apologize", "repair relationship", "estranged"],
    reference: "Matthew 5:24",
    text: "First be reconciled to your brother.",
  },
  {
    category: "mercy",
    keywords: ["mercy", "show mercy", "hard to forgive", "let go"],
    reference: "Matthew 6:14",
    text: "If you forgive others their trespasses, your heavenly Father will also forgive you.",
  },
  {
    category: "soft-answer",
    keywords: ["harsh words", "soft answer", "argument", "defuse", "calm conversation"],
    reference: "Proverbs 15:1",
    text: "A soft answer turns away wrath.",
  },
  {
    category: "kind-words",
    keywords: ["kind words", "encouragement", "discouraging words", "hurtful words"],
    reference: "Proverbs 16:24",
    text: "Gracious words are like a honeycomb.",
  },
  {
    category: "freedom",
    keywords: ["freedom", "bondage", "stuck", "enslaved", "addicted"],
    reference: "Galatians 5:1",
    text: "For freedom Christ has set us free.",
  },
  {
    category: "self-control",
    keywords: ["self control", "impulse", "discipline", "temper", "uncontrolled"],
    reference: "Proverbs 25:28",
    text: "A man without self-control is like a city broken into.",
  },
  {
    category: "watchfulness",
    keywords: ["watchful", "tempted", "weak flesh", "spiritual alertness"],
    reference: "Matthew 26:41",
    text: "Watch and pray that you may not enter into temptation.",
  },
  {
    category: "financial-wisdom",
    keywords: ["budget", "financial wisdom", "spending", "saving", "plan money"],
    reference: "Proverbs 21:5",
    text: "The plans of the diligent lead surely to abundance.",
  },
  {
    category: "poverty",
    keywords: ["poverty", "poor", "not enough food", "hungry", "basic needs"],
    reference: "Psalm 34:10",
    text: "Those who seek the LORD lack no good thing.",
  },
  {
    category: "generosity-joy",
    keywords: ["give freely", "generosity joy", "help others", "charitable"],
    reference: "Acts 20:35",
    text: "It is more blessed to give than to receive.",
  },
  {
    category: "favor",
    keywords: ["favor", "good reputation", "interview favor", "approval", "open door"],
    reference: "Proverbs 3:4",
    text: "So you will find favor and good success.",
  },
  {
    category: "aging-fruitfulness",
    keywords: ["aging well", "retirement purpose", "old age fruit", "senior ministry"],
    reference: "Psalm 92:14",
    text: "They still bear fruit in old age.",
  },
  {
    category: "study",
    keywords: ["study", "homework", "learning", "focus studying", "academics"],
    reference: "Colossians 3:17",
    text: "Whatever you do, in word or deed, do everything in the name of the Lord Jesus.",
  },
  {
    category: "exam-peace",
    keywords: ["exam", "test anxiety", "finals", "quiz", "standardized test"],
    reference: "Isaiah 26:3",
    text: "You keep him in perfect peace whose mind is stayed on you.",
  },
  {
    category: "teaching",
    keywords: ["teacher", "professor", "lesson", "classroom", "mentor students"],
    reference: "Daniel 1:17",
    text: "God gave them learning and skill in all literature and wisdom.",
  },
  {
    category: "athletics",
    keywords: ["athlete", "training", "practice", "competition", "sports discipline"],
    reference: "2 Timothy 2:5",
    text: "An athlete is not crowned unless he competes according to the rules.",
  },
  {
    category: "travel-path",
    keywords: ["drive", "driving", "road", "walking", "commute safety"],
    reference: "Proverbs 3:23",
    text: "Then you will walk on your way securely.",
  },
  {
    category: "military-peace",
    keywords: ["deployment peace", "military family", "combat stress", "veteran peace"],
    reference: "Psalm 29:11",
    text: "May the LORD bless his people with peace.",
  },
  {
    category: "truth",
    keywords: ["truth", "lying", "false accusation", "honesty", "witness"],
    reference: "Proverbs 12:22",
    text: "Lying lips are an abomination to the LORD.",
  },
  {
    category: "immigrant-care",
    keywords: ["immigrant", "foreigner", "stranger", "refugee care", "asylum seeker"],
    reference: "Deuteronomy 10:18",
    text: "He loves the sojourner, giving him food and clothing.",
  },
  {
    category: "nation-healing",
    keywords: ["nation healing", "country", "national repentance", "revive nation"],
    reference: "2 Chronicles 7:14",
    text: "Then I will hear from heaven and will forgive their sin.",
  },
  {
    category: "public-leadership",
    keywords: ["public leader", "political leader", "elected official", "city leader"],
    reference: "Proverbs 11:14",
    text: "In an abundance of counselors there is safety.",
  },
  {
    category: "disaster-courage",
    keywords: ["disaster", "evacuation", "wildfire", "flood cleanup", "storm damage"],
    reference: "Psalm 46:2",
    text: "Therefore we will not fear though the earth gives way.",
  },
  {
    category: "storm-peace",
    keywords: ["storm peace", "hurricane", "tornado", "weather fear"],
    reference: "Mark 4:39",
    text: "Peace! Be still!",
  },
  {
    category: "abuse-safety",
    keywords: ["safe from abuse", "escape abuse", "domestic violence", "protected from harm"],
    reference: "Psalm 10:17",
    text: "O LORD, you hear the desire of the afflicted.",
  },
  {
    category: "trauma",
    keywords: ["trauma", "traumatized", "flashbacks", "ptsd", "wounded heart"],
    reference: "Isaiah 61:1",
    text: "He has sent me to bind up the brokenhearted.",
  },
  {
    category: "mental-health-comfort",
    keywords: ["intrusive thoughts", "mental spiral", "many cares", "dark thoughts"],
    reference: "Psalm 94:19",
    text: "When the cares of my heart are many, your consolations cheer my soul.",
  },
  {
    category: "depression-light",
    keywords: ["darkness", "can't get up", "depression light", "low mood"],
    reference: "Micah 7:8",
    text: "When I sit in darkness, the LORD will be a light to me.",
  },
  {
    category: "hope-rescue",
    keywords: ["desperate", "pit", "rock bottom", "need rescue", "hopeless"],
    reference: "Psalm 40:2",
    text: "He drew me up from the pit of destruction.",
  },
  {
    category: "faith-growth",
    keywords: ["grow faith", "stronger faith", "hear god", "faith comes"],
    reference: "Romans 10:17",
    text: "Faith comes from hearing, and hearing through the word of Christ.",
  },
  {
    category: "obedience-blessing",
    keywords: ["obey scripture", "follow god", "hear and obey", "obedient heart"],
    reference: "Luke 11:28",
    text: "Blessed rather are those who hear the word of God and keep it.",
  },
  {
    category: "worship-joy",
    keywords: ["serve with gladness", "worship joy", "praise joy", "glad worship"],
    reference: "Psalm 100:2",
    text: "Serve the LORD with gladness!",
  },
  {
    category: "ministry",
    keywords: ["ministry burden", "serve church", "carry burden", "serve people"],
    reference: "Galatians 6:2",
    text: "Bear one another's burdens, and so fulfill the law of Christ.",
  },
  {
    category: "mentoring",
    keywords: ["mentor", "train leaders", "discipleship group", "teach faithful people"],
    reference: "2 Timothy 2:2",
    text: "Entrust to faithful men, who will be able to teach others also.",
  },
  {
    category: "open-door",
    keywords: ["open door", "gospel opportunity", "share faith", "evangelism opportunity"],
    reference: "Colossians 4:3",
    text: "That God may open to us a door for the word.",
  },
  {
    category: "mission-sending",
    keywords: ["mission trip", "sent", "send workers", "beautiful feet"],
    reference: "Romans 10:15",
    text: "How beautiful are the feet of those who preach the good news!",
  },
  {
    category: "persecution-blessing",
    keywords: ["insulted for faith", "mocked christian", "faith opposition", "persecuted"],
    reference: "1 Peter 4:14",
    text: "If you are insulted for the name of Christ, you are blessed.",
  },
  {
    category: "justice-river",
    keywords: ["justice roll", "systemic injustice", "court justice", "righteousness"],
    reference: "Amos 5:24",
    text: "Let justice roll down like waters.",
  },
  {
    category: "compassion-poor",
    keywords: ["help poor", "lend to lord", "compassion poor", "need mercy"],
    reference: "Proverbs 19:17",
    text: "Whoever is generous to the poor lends to the LORD.",
  },
  {
    category: "hospitality-practice",
    keywords: ["practice hospitality", "welcome guests", "open home", "host people"],
    reference: "Romans 12:13",
    text: "Contribute to the needs of the saints and seek to show hospitality.",
  },
  {
    category: "reconciliation-cross",
    keywords: ["racial healing", "ethnic unity", "wall of hostility", "reconciliation across differences"],
    reference: "Ephesians 2:14",
    text: "He himself is our peace.",
  },
  {
    category: "unity-pleasant",
    keywords: ["team unity", "church unity", "family unity", "brothers dwell"],
    reference: "Psalm 133:1",
    text: "How good and pleasant it is when brothers dwell in unity!",
  },
  {
    category: "conflict-patience",
    keywords: ["hot temper", "argument escalates", "slow anger", "conflict patience"],
    reference: "Proverbs 15:18",
    text: "He who is slow to anger quiets contention.",
  },
  {
    category: "decision-courage",
    keywords: ["choose", "big decision", "commitment", "choose this day"],
    reference: "Joshua 24:15",
    text: "Choose this day whom you will serve.",
  },
  {
    category: "wise-counsel",
    keywords: ["counsel", "advice", "wise counsel", "plans fail", "mentor advice"],
    reference: "Proverbs 15:22",
    text: "Without counsel plans fail.",
  },
  {
    category: "future-hope",
    keywords: ["future", "plans", "unknown future", "hopeful future"],
    reference: "Jeremiah 29:11",
    text: "I know the plans I have for you, declares the LORD.",
  },
  {
    category: "waiting-hope",
    keywords: ["wait on god", "waiting hope", "delayed answer", "long wait"],
    reference: "Psalm 130:5",
    text: "I wait for the LORD, my soul waits.",
  },
  {
    category: "patience",
    keywords: ["patient", "patience", "waiting patiently", "enduring delay"],
    reference: "Romans 8:25",
    text: "If we hope for what we do not see, we wait for it with patience.",
  },
  {
    category: "restoration",
    keywords: ["restore", "restoration", "lost years", "recover loss"],
    reference: "Joel 2:25",
    text: "I will restore to you the years that the swarming locust has eaten.",
  },
  {
    category: "success-humility",
    keywords: ["success humility", "promotion humility", "pride after success", "achievement humility"],
    reference: "Proverbs 16:18",
    text: "Pride goes before destruction.",
  },
  {
    category: "thanksgiving-goodness",
    keywords: ["thank god", "god is good", "gratitude goodness", "give thanks"],
    reference: "Psalm 107:1",
    text: "Oh give thanks to the LORD, for he is good.",
  },
  {
    category: "joy-strength",
    keywords: ["joy strength", "sad but joyful", "need joy", "strength from joy"],
    reference: "Nehemiah 8:10",
    text: "The joy of the LORD is your strength.",
  },
  {
    category: "contentment-gain",
    keywords: ["godliness contentment", "enough", "simple life", "contentment gain"],
    reference: "1 Timothy 6:6",
    text: "Godliness with contentment is great gain.",
  },
  {
    category: "humility",
    keywords: ["humble", "humility", "selfish ambition", "count others"],
    reference: "Philippians 2:3",
    text: "In humility count others more significant than yourselves.",
  },
  {
    category: "envy-peace",
    keywords: ["envy", "jealousy", "comparison", "resent success"],
    reference: "Proverbs 14:30",
    text: "A tranquil heart gives life to the flesh.",
  },
  {
    category: "mind-renewal",
    keywords: ["internet temptation", "social media", "worldly pressure", "renew mind"],
    reference: "Romans 12:2",
    text: "Be transformed by the renewal of your mind.",
  },
  {
    category: "correction",
    keywords: ["correction", "receive feedback", "discipline hurts", "learn correction"],
    reference: "Proverbs 12:1",
    text: "Whoever loves discipline loves knowledge.",
  },
  {
    category: "time-management",
    keywords: ["time management", "schedule", "priorities", "number days", "too busy"],
    reference: "Psalm 90:12",
    text: "Teach us to number our days.",
  },
  {
    category: "moving",
    keywords: ["moving", "relocation", "new city", "new home", "leaving home"],
    reference: "Hebrews 11:8",
    text: "He went out, not knowing where he was going.",
  },
  {
    category: "housing",
    keywords: ["housing", "apartment", "rent application", "landlord", "place to live"],
    reference: "Proverbs 24:3",
    text: "By wisdom a house is built.",
  },
  {
    category: "neighborhood",
    keywords: ["neighbor", "neighborhood", "city peace", "community peace"],
    reference: "Jeremiah 29:7",
    text: "Seek the welfare of the city.",
  },
  {
    category: "adoption",
    keywords: ["adoption", "adopt", "foster care", "foster child", "orphan care"],
    reference: "Psalm 68:5",
    text: "Father of the fatherless and protector of widows is God.",
  },
  {
    category: "vulnerable",
    keywords: ["widow", "orphan", "vulnerable", "exploited", "defenseless"],
    reference: "Exodus 22:22",
    text: "You shall not mistreat any widow or fatherless child.",
  },
  {
    category: "caregiver-service",
    keywords: ["caregiver service", "care for parent", "care for sick", "serve least"],
    reference: "Matthew 25:40",
    text: "As you did it to one of the least of these my brothers, you did it to me.",
  },
  {
    category: "aging-legacy",
    keywords: ["aging legacy", "grandparent", "tell next generation", "old and gray"],
    reference: "Psalm 71:18",
    text: "Even to old age and gray hairs, O God, do not forsake me.",
  },
];

const defaultVerses = [
  {
    reference: "Numbers 6:24",
    text: "The LORD bless you, and keep you.",
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
  },
  {
    reference: "Lamentations 3:22",
    text: "The steadfast love of the LORD never ceases.",
  },
  {
    reference: "Romans 8:28",
    text: "For those who love God all things work together for good.",
  },
  {
    reference: "2 Corinthians 12:9",
    text: "My grace is sufficient for you, for my power is made perfect in weakness.",
  },
  {
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you; my peace I give to you.",
  },
  {
    reference: "Matthew 6:34",
    text: "Do not be anxious about tomorrow.",
  },
  {
    reference: "Psalm 55:22",
    text: "Cast your burden on the LORD, and he will sustain you.",
  },
  {
    reference: "Romans 12:12",
    text: "Rejoice in hope, be patient in tribulation, be constant in prayer.",
  },
  {
    reference: "Hebrews 4:16",
    text: "Let us then with confidence draw near to the throne of grace.",
  },
  {
    reference: "1 Peter 5:7",
    text: "Casting all your anxieties on him, because he cares for you.",
  },
  {
    reference: "Psalm 91:2",
    text: "My refuge and my fortress, my God, in whom I trust.",
  },
  {
    reference: "Isaiah 41:10",
    text: "Fear not, for I am with you.",
  },
  {
    reference: "2 Thessalonians 3:16",
    text: "May the Lord of peace himself give you peace at all times.",
  },
  {
    reference: "Psalm 37:4",
    text: "Delight yourself in the LORD, and he will give you the desires of your heart.",
  },
  {
    reference: "Lamentations 3:25",
    text: "The LORD is good to those who wait for him.",
  },
  {
    reference: "Proverbs 16:9",
    text: "The heart of man plans his way, but the LORD establishes his steps.",
  },
  {
    reference: "Psalm 62:8",
    text: "Trust in him at all times, O people.",
  },
  {
    reference: "Psalm 86:7",
    text: "In the day of my trouble I call upon you.",
  },
  {
    reference: "Psalm 143:8",
    text: "Let me hear in the morning of your steadfast love.",
  },
  {
    reference: "John 15:7",
    text: "Ask whatever you wish, and it will be done for you.",
  },
  {
    reference: "Jude 1:24",
    text: "Now to him who is able to keep you from stumbling.",
  },
  {
    reference: "Psalm 138:8",
    text: "The LORD will fulfill his purpose for me.",
  },
  {
    reference: "Psalm 145:18",
    text: "The LORD is near to all who call on him.",
  },
  {
    reference: "Ephesians 3:20",
    text: "He is able to do far more abundantly than all that we ask or think.",
  },
  {
    reference: "2 Corinthians 9:8",
    text: "God is able to make all grace abound to you.",
  },
  {
    reference: "1 John 4:18",
    text: "There is no fear in love, but perfect love casts out fear.",
  },
  {
    reference: "Romans 8:31",
    text: "If God is for us, who can be against us?",
  },
  {
    reference: "Psalm 139:5",
    text: "You hem me in, behind and before.",
  },
  {
    reference: "Psalm 27:1",
    text: "The LORD is my light and my salvation.",
  },
  {
    reference: "Psalm 30:5",
    text: "Weeping may tarry for the night, but joy comes with the morning.",
  },
  {
    reference: "Psalm 84:11",
    text: "No good thing does he withhold from those who walk uprightly.",
  },
  {
    reference: "Proverbs 18:10",
    text: "The name of the LORD is a strong tower.",
  },
  {
    reference: "Psalm 31:24",
    text: "Be strong, and let your heart take courage.",
  },
  {
    reference: "Isaiah 43:2",
    text: "When you pass through the waters, I will be with you.",
  },
  {
    reference: "Hebrews 13:5",
    text: "I will never leave you nor forsake you.",
  },
  {
    reference: "1 Corinthians 15:58",
    text: "Be steadfast, immovable, always abounding in the work of the Lord.",
  },
  {
    reference: "Psalm 100:5",
    text: "For the LORD is good; his steadfast love endures forever.",
  },
  {
    reference: "Psalm 116:1",
    text: "I love the LORD, because he has heard my voice.",
  },
  {
    reference: "Psalm 20:4",
    text: "May he grant you your heart's desire.",
  },
  {
    reference: "1 Chronicles 16:11",
    text: "Seek the LORD and his strength.",
  },
  {
    reference: "Psalm 18:2",
    text: "The LORD is my rock and my fortress and my deliverer.",
  },
  {
    reference: "Psalm 32:8",
    text: "I will instruct you and teach you in the way you should go.",
  },
  {
    reference: "Isaiah 58:11",
    text: "The LORD will guide you continually.",
  },
  {
    reference: "2 Peter 1:3",
    text: "His divine power has granted to us all things.",
  },
  {
    reference: "Romans 8:26",
    text: "The Spirit helps us in our weakness.",
  },
  {
    reference: "Psalm 119:114",
    text: "You are my hiding place and my shield.",
  },
];

const defaultVerse = defaultVerses[0];

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
};

const defaultSettings = {
  sortMode: "priority",
  timerPerCardSeconds: 60,
  timerTotalMinutes: 10,
  timerFlagId: "all",
};

const state = {
  cards: loadCards(),
  flags: loadFlags(),
  settings: loadSettings(),
  currentId: null,
  showingBack: false,
  editingId: null,
  pendingPhotoDataUrl: "",
  pendingFlagIds: new Set(),
  activeFlagId: "all",
  skippedIds: new Set(),
  timedSession: {
    active: false,
    cards: [],
    index: 0,
    remainingSeconds: 0,
    intervalId: null,
  },
};

const els = {
  statsStrip: document.querySelector("#statsStrip"),
  dashboardList: document.querySelector("#dashboardList"),
  dashboardDrawer: document.querySelector("#dashboardDrawer"),
  openDashboardButton: document.querySelector("#openDashboardButton"),
  closeDashboardButton: document.querySelector("#closeDashboardButton"),
  openAddButton: document.querySelector("#openAddButton"),
  formModal: document.querySelector("#formModal"),
  card: document.querySelector("#card"),
  cardPriority: document.querySelector("#cardPriority"),
  cardFront: document.querySelector("#cardFront"),
  cardBack: document.querySelector("#cardBack"),
  cardFrontKicker: document.querySelector("#cardFrontKicker"),
  cardBackKicker: document.querySelector("#cardBackKicker"),
  cardName: document.querySelector("#cardName"),
  cardPhoto: document.querySelector("#cardPhoto"),
  cardPhotoFrame: document.querySelector("#cardPhotoFrame"),
  cardMeta: document.querySelector("#cardMeta"),
  cardFlags: document.querySelector("#cardFlags"),
  cardNote: document.querySelector("#cardNote"),
  cardVerse: document.querySelector("#cardVerse"),
  updateCardButton: document.querySelector("#updateCardButton"),
  flipButton: document.querySelector("#flipButton"),
  skipButton: document.querySelector("#skipButton"),
  prayButton: document.querySelector("#prayButton"),
  openTimedPrayerButton: document.querySelector("#openTimedPrayerButton"),
  cardForm: document.querySelector("#cardForm"),
  formTitle: document.querySelector("#formTitle"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  nameInput: document.querySelector("#nameInput"),
  noteInput: document.querySelector("#noteInput"),
  priorityInput: document.querySelector("#priorityInput"),
  flagPicker: document.querySelector("#flagPicker"),
  openFlagCreatorButton: document.querySelector("#openFlagCreatorButton"),
  flagPopover: document.querySelector("#flagPopover"),
  flagNameInput: document.querySelector("#flagNameInput"),
  flagColorInput: document.querySelector("#flagColorInput"),
  addFlagButton: document.querySelector("#addFlagButton"),
  flagFilterBlock: document.querySelector("#flagFilterBlock"),
  flagFilterList: document.querySelector("#flagFilterList"),
  dashboardSortInput: document.querySelector("#dashboardSortInput"),
  timerPerCardInput: document.querySelector("#timerPerCardInput"),
  timerTotalInput: document.querySelector("#timerTotalInput"),
  timerFlagInput: document.querySelector("#timerFlagInput"),
  startTimedPrayerButton: document.querySelector("#startTimedPrayerButton"),
  photoInput: document.querySelector("#photoInput"),
  photoPreview: document.querySelector("#photoPreview"),
  clearPhotoButton: document.querySelector("#clearPhotoButton"),
  saveButton: document.querySelector("#saveButton"),
  personList: document.querySelector("#personList"),
  libraryCount: document.querySelector("#libraryCount"),
  searchInput: document.querySelector("#searchInput"),
  exportButton: document.querySelector("#exportButton"),
  drawerExportButton: document.querySelector("#drawerExportButton"),
  openImportHelpButton: document.querySelector("#openImportHelpButton"),
  resetAllButton: document.querySelector("#resetAllButton"),
  importModal: document.querySelector("#importModal"),
  closeImportHelpButton: document.querySelector("#closeImportHelpButton"),
  chooseImportFileButton: document.querySelector("#chooseImportFileButton"),
  importInput: document.querySelector("#importInput"),
  timedSession: document.querySelector("#timedSession"),
  exitTimedPrayerButton: document.querySelector("#exitTimedPrayerButton"),
  timerSlideName: document.querySelector("#timerSlideName"),
  timerSlideNote: document.querySelector("#timerSlideNote"),
  timerSlideVerse: document.querySelector("#timerSlideVerse"),
  timerPhotoFrame: document.querySelector("#timerPhotoFrame"),
  timerPhoto: document.querySelector("#timerPhoto"),
  timerCountdown: document.querySelector("#timerCountdown"),
  timerProgressText: document.querySelector("#timerProgressText"),
  timerProgressBar: document.querySelector("#timerProgressBar"),
};

function loadCards() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(normalizeCard) : [];
  } catch {
    return [];
  }
}

function loadFlags() {
  try {
    const saved = JSON.parse(localStorage.getItem(FLAG_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(normalizeFlag).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultSettings };
  }
}

function normalizeCard(card) {
  const isOldTemplate =
    (card?.name === "Alex" &&
      card?.note === "Pray for discernment and peace this week." &&
      Number(card?.prayedCount || 0) === 1) ||
    card?.name === "Tom Do";

  if (isOldTemplate || card?.template) {
    return {
      ...card,
      name: "Template Card",
      note: "Use the + button to add a real person and prayer request. This example is not counted in your statistics.",
      priority: "medium",
      flagIds: [],
      photoDataUrl: "",
      prayedCount: 0,
      lastPrayedAt: null,
      prayerHistory: [],
      verse: suggestVerseForRequest(card?.note || ""),
      template: true,
    };
  }

  const history = Array.isArray(card?.prayerHistory)
    ? card.prayerHistory.filter((date) => !Number.isNaN(new Date(date).getTime()))
    : [];

  if (card?.lastPrayedAt && !history.includes(card.lastPrayedAt)) {
    history.push(card.lastPrayedAt);
  }

  return {
    ...card,
    flagIds: Array.isArray(card?.flagIds) ? card.flagIds : [],
    prayerHistory: history.sort((a, b) => new Date(a) - new Date(b)).slice(-90),
    verse: normalizeVerse(card?.verse, card?.note),
    template: Boolean(card?.template),
  };
}

function normalizeFlag(flag) {
  if (!flag?.name) return null;
  return {
    id: flag.id || uid(),
    name: String(flag.name).trim(),
    color: isColor(flag.color) ? flag.color : "#5aa6c8",
  };
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
}

function saveFlags() {
  localStorage.setItem(FLAG_STORAGE_KEY, JSON.stringify(state.flags));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
}

function uid() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
}

function normalizeVerse(verse, requestText = "") {
  if (verse && typeof verse === "object" && verse.reference && verse.text) {
    return {
      reference: String(verse.reference),
      text: String(verse.text),
    };
  }

  if (typeof verse === "string" && verse.trim()) {
    return {
      reference: "Suggested verse",
      text: verse.trim(),
    };
  }

  return suggestVerseForRequest(requestText);
}

function normalizeReference(reference = "") {
  return String(reference).trim().replace(/\s+/g, " ").toLowerCase();
}

function verseReference(verse) {
  return normalizeReference(verse?.reference);
}

function usedVerseReferences(excludeCardId = null) {
  return new Set(
    state.cards
      .filter((card) => card.id !== excludeCardId)
      .map((card) => verseReference(card.verse))
      .filter(Boolean),
  );
}

function allVerseOptions() {
  const options = [...verseSuggestions, ...defaultVerses.map((verse) => ({ ...verse, category: "default", keywords: [] }))];
  const seen = new Set();

  return options.filter((verse) => {
    const reference = verseReference(verse);
    if (!reference || seen.has(reference)) return false;
    seen.add(reference);
    return true;
  });
}

function normalizeSuggestionText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stemSuggestionTerm(term = "") {
  const normalized = normalizeSuggestionText(term);
  if (normalized.length > 6 && normalized.endsWith("ing")) return normalized.slice(0, -3);
  if (normalized.length > 5 && normalized.endsWith("ed")) return normalized.slice(0, -2);
  if (normalized.length > 5 && normalized.endsWith("es")) return normalized.slice(0, -2);
  if (normalized.length > 4 && normalized.endsWith("s")) return normalized.slice(0, -1);
  return normalized;
}

function tokenizeSuggestionText(value = "") {
  const tokens = normalizeSuggestionText(value)
    .split(/\s+/)
    .filter((token) => token && !suggestionStopWords.has(token));
  const expanded = new Set();

  tokens.forEach((token) => {
    expanded.add(token);
    const stemmed = stemSuggestionTerm(token);
    if (stemmed && stemmed !== token && !suggestionStopWords.has(stemmed)) {
      expanded.add(stemmed);
    }
  });

  return expanded;
}

function requestSearchContext(requestText = "") {
  const normalized = normalizeSuggestionText(requestText);
  const tokens = tokenizeSuggestionText(requestText);
  const words = normalized.split(/\s+/).filter(Boolean);
  const phrases = new Set();

  for (let size = 2; size <= 4; size += 1) {
    for (let index = 0; index <= words.length - size; index += 1) {
      const phrase = words.slice(index, index + size).join(" ");
      if (!phrase.split(/\s+/).every((word) => suggestionStopWords.has(word))) {
        phrases.add(phrase);
      }
    }
  }

  return { normalized, tokens, phrases };
}

function keywordMatchScore(keyword = "", context) {
  const normalized = normalizeSuggestionText(keyword);
  if (!normalized || !context.normalized) return 0;

  const words = normalized.split(/\s+/).filter((word) => word && !suggestionStopWords.has(word));
  if (!words.length) return 0;

  if (context.normalized.includes(normalized)) {
    return 6 + words.length * 3;
  }

  const matchedWords = words.filter((word) => context.tokens.has(word) || context.tokens.has(stemSuggestionTerm(word)));
  if (matchedWords.length === words.length) {
    return 3 + matchedWords.length * 2;
  }

  if (matchedWords.length && words.length > 1) {
    return matchedWords.length;
  }

  return 0;
}

function scoreIntentBoost(verse, context) {
  const category = normalizeSuggestionText(String(verse.category || "").replace(/[-_]/g, " "));
  if (!category || !context.normalized) return 0;

  return suggestionIntentProfiles.reduce((score, profile) => {
    const requestMatchesProfile = profile.terms.some((term) => keywordMatchScore(term, context) > 0);
    if (!requestMatchesProfile) return score;

    const categoryMatchesProfile = profile.categories.some((profileCategory) => {
      const normalizedCategory = normalizeSuggestionText(String(profileCategory).replace(/[-_]/g, " "));
      return category === normalizedCategory || category.includes(normalizedCategory) || normalizedCategory.includes(category);
    });

    return score + (categoryMatchesProfile ? 7 : 0);
  }, 0);
}

function scoreCorpusOverlap(verse, context) {
  if (!context.tokens.size) return 0;

  const categoryText = String(verse.category || "").replace(/[-_]/g, " ");
  const corpusTokens = tokenizeSuggestionText([categoryText, verse.reference, verse.text, ...(verse.keywords || [])].join(" "));
  let overlap = 0;

  context.tokens.forEach((token) => {
    if (corpusTokens.has(token)) {
      overlap += token.length > 4 ? 1.5 : 1;
    }
  });

  return Math.min(overlap, 8);
}

function scoreVerseSuggestion(verse, requestContext = "") {
  const context = typeof requestContext === "object" && requestContext?.tokens ? requestContext : requestSearchContext(requestContext);
  const keywords = verse.keywords || [];
  const keywordScore = keywords.reduce((sum, keyword) => sum + keywordMatchScore(keyword, context), 0);
  const categoryScore = keywordMatchScore(String(verse.category || "").replace(/[-_]/g, " "), context) * 1.5;
  const phraseScore = [...context.phrases].reduce((sum, phrase) => sum + keywordMatchScore(phrase, requestSearchContext([verse.category, ...(verse.keywords || [])].join(" "))), 0);
  const corpusScore = scoreCorpusOverlap(verse, context);
  const intentScore = scoreIntentBoost(verse, context);

  return keywordScore + categoryScore + phraseScore + corpusScore + intentScore;
}

function fallbackVerseForRequest(requestText = "", usedReferences = new Set()) {
  const seed = Array.from(String(requestText)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ordered = [...defaultVerses].sort((a, b) => {
    const aScore = (seed + defaultVerses.indexOf(a) * 17) % defaultVerses.length;
    const bScore = (seed + defaultVerses.indexOf(b) * 17) % defaultVerses.length;
    return aScore - bScore;
  });
  return ordered.find((verse) => !usedReferences.has(verseReference(verse))) || defaultVerses[0];
}

function candidateVersesForRequest(requestText = "", usedReferences = new Set(), limit = 12) {
  const context = requestSearchContext(requestText);
  const scored = allVerseOptions()
    .map((verse) => ({
      verse,
      score: scoreVerseSuggestion(verse, context),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || verseReference(a.verse).localeCompare(verseReference(b.verse)));

  const unused = scored.map((entry) => entry.verse).filter((verse) => !usedReferences.has(verseReference(verse)));
  const fallback = fallbackVerseForRequest(requestText, usedReferences);
  const candidates = unused.length ? unused : [fallback];
  return candidates.slice(0, limit);
}

function aiCandidateVersesForRequest(requestText = "", usedReferences = new Set(), limit = 140) {
  const context = requestSearchContext(requestText);
  const primaryMatches = candidateVersesForRequest(requestText, usedReferences, limit);
  const primaryReferences = new Set(primaryMatches.map((verse) => verseReference(verse)));
  const remaining = allVerseOptions()
    .filter((verse) => {
      const reference = verseReference(verse);
      return reference && !usedReferences.has(reference) && !primaryReferences.has(reference);
    })
    .map((verse) => ({
      verse,
      score: scoreVerseSuggestion(verse, context),
    }))
    .sort((a, b) => b.score - a.score || verseReference(a.verse).localeCompare(verseReference(b.verse)))
    .map((entry) => entry.verse);

  return [...primaryMatches, ...remaining].slice(0, limit);
}

function suggestVerseForRequest(requestText = "", usedReferences = new Set()) {
  const [match] = candidateVersesForRequest(requestText, usedReferences, 1);
  return { reference: match.reference, text: match.text };
}

function verseByReference(reference) {
  const normalized = normalizeReference(reference);
  return allVerseOptions().find((verse) => verseReference(verse) === normalized) || null;
}

function ensureUniqueCardVerses() {
  const usedReferences = new Set();
  let changed = false;

  state.cards.forEach((card) => {
    if (card.template) return;

    const reference = verseReference(card.verse);
    if (!reference || usedReferences.has(reference)) {
      card.verse = suggestVerseForRequest(card.note, usedReferences);
      card.updatedAt = new Date().toISOString();
      changed = true;
    }

    usedReferences.add(verseReference(card.verse));
  });

  return changed;
}

function formatVerse(verse) {
  if (!verse?.text) return "";
  return `${verse.text} - ${verse.reference || "Suggested verse"}`;
}

function isEditableElement(element) {
  if (!element) return false;
  if (element.isContentEditable) return true;
  return Boolean(element.closest?.("input, textarea, select, [contenteditable='true']"));
}

function selectEditableContents(element) {
  if (!element) return false;
  const editable = element.closest?.("input, textarea, [contenteditable='true']") || element;

  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    editable.select();
    return true;
  }

  if (editable.isContentEditable) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editable);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  return false;
}

function requestAIVerseForCard(card) {
  if (!card?.id || !card.note || !window.webkit?.messageHandlers?.suggestVerseWithAI) return;

  const usedReferences = usedVerseReferences(card.id);
  const candidates = aiCandidateVersesForRequest(card.note, usedReferences, 140).map((verse) => ({
    reference: verse.reference,
    text: verse.text,
    category: verse.category || "general",
    keywords: verse.keywords || [],
  }));

  window.webkit.messageHandlers.suggestVerseWithAI.postMessage({
    requestId: card.id,
    note: card.note,
    currentReference: card.verse?.reference || "",
    usedReferences: [...usedReferences],
    candidates,
  });
}

window.prayerCardsReceiveAIVerse = (payload) => {
  const card = state.cards.find((entry) => entry.id === payload?.requestId);
  if (!card || card.note !== payload.note) return;

  const matchedVerse = verseByReference(payload.reference);
  if (!matchedVerse) return;

  const usedReferences = usedVerseReferences(card.id);
  if (usedReferences.has(verseReference(matchedVerse))) return;

  card.verse = {
    reference: matchedVerse.reference,
    text: matchedVerse.text,
    source: "openai",
  };
  card.updatedAt = new Date().toISOString();
  saveCards();

  if (state.currentId === card.id) {
    renderCurrentCard();
  }
};

function daysSince(dateString) {
  if (!dateString) return 999;
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return 999;
  return Math.max(0, (Date.now() - then) / 86400000);
}

function formatLastPrayed(card) {
  if (!card.lastPrayedAt) return "Never prayed";
  const days = Math.floor(daysSince(card.lastPrayedAt));
  if (days === 0) return "Prayed today";
  if (days === 1) return "Prayed yesterday";
  return `Prayed ${days} days ago`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dateKey(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return null;
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

function addDaysToKey(key, amount) {
  const [year, month, day] = key.split("-").map(Number);
  const value = new Date(year, month - 1, day + amount);
  return dateKey(value);
}

function prayerDates(card) {
  const dates = Array.isArray(card?.prayerHistory) ? [...card.prayerHistory] : [];
  if (card?.lastPrayedAt) dates.push(card.lastPrayedAt);
  return [...new Set(dates)]
    .filter((date) => !Number.isNaN(new Date(date).getTime()))
    .sort((a, b) => new Date(a) - new Date(b));
}

function adaptiveCadenceDays(card) {
  if (card.template) return Infinity;
  const base = cadenceDays[card.priority] || cadenceDays.medium;
  const bounds = cadenceBounds[card.priority] || cadenceBounds.medium;
  const dates = prayerDates(card);

  if (dates.length < 3) return base;

  const recentDates = dates.slice(-6);
  const gaps = recentDates.slice(1).map((date, index) => daysBetween(recentDates[index], date));
  const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  return clamp(base * 0.65 + averageGap * 0.35, bounds.min, bounds.max);
}

function daysBetween(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.max(0.25, (endTime - startTime) / 86400000);
}

function nextDueAt(card) {
  if (card.template) return null;
  if (!card.lastPrayedAt) return new Date(0).toISOString();
  const due = new Date(new Date(card.lastPrayedAt).getTime() + adaptiveCadenceDays(card) * 86400000);
  return due.toISOString();
}

function isDue(card) {
  const dueAt = nextDueAt(card);
  return Boolean(dueAt && Date.now() >= new Date(dueAt).getTime());
}

function formatDue(card) {
  if (card.template) return "Template";
  if (wasPrayedToday(card)) return "Done today";
  if (!card.lastPrayedAt) return "Due now";
  const dueAt = nextDueAt(card);
  const dueDays = Math.ceil((new Date(dueAt).getTime() - Date.now()) / 86400000);
  if (dueDays <= 0) return "Due now";
  if (dueDays === 1) return "Due tomorrow";
  return `Due in ${dueDays} days`;
}

function prayerDayKeys(cards) {
  return [
    ...new Set(
      cards
        .flatMap((card) => prayerDates(card))
        .map(dateKey)
        .filter(Boolean),
    ),
  ].sort();
}

function calculateStreaks(cards) {
  const days = new Set(prayerDayKeys(cards));
  let current = 0;
  let longest = 0;
  let running = 0;

  prayerDayKeys(cards).forEach((key, index, keys) => {
    running = index > 0 && addDaysToKey(keys[index - 1], 1) === key ? running + 1 : 1;
    longest = Math.max(longest, running);
  });

  const today = dateKey(new Date());
  let cursor = days.has(today) ? today : days.has(addDaysToKey(today, -1)) ? addDaysToKey(today, -1) : null;

  while (cursor && days.has(cursor)) {
    current += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  return { current, longest };
}

function wasPrayedToday(card) {
  const today = dateKey(new Date());
  return prayerDates(card).some((date) => dateKey(date) === today);
}

function availablePrayerCards() {
  return realCards().filter((card) => !wasPrayedToday(card));
}

function formatTimerSeconds(seconds) {
  const clamped = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(clamped / 60);
  const remainder = String(clamped % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function markCardPrayed(card, prayedAt = new Date().toISOString()) {
  if (!card || card.template || wasPrayedToday(card)) return false;
  card.prayedCount = (card.prayedCount || 0) + 1;
  card.lastPrayedAt = prayedAt;
  card.prayerHistory = [...new Set([...prayerDates(card), prayedAt])].slice(-90);
  card.updatedAt = prayedAt;
  state.skippedIds.delete(card.id);
  return true;
}

function flagsForCard(card) {
  const ids = new Set(card?.flagIds || []);
  return state.flags.filter((flag) => ids.has(flag.id));
}

function updatePriorityStyle() {
  els.priorityInput.classList.remove("priority-low", "priority-medium", "priority-high");
  els.priorityInput.classList.add(`priority-${els.priorityInput.value}`);
}

function updatePhotoPreview() {
  const hasPhoto = Boolean(state.pendingPhotoDataUrl);
  els.photoPreview.classList.toggle("is-empty", !hasPhoto);
  els.photoPreview.style.backgroundImage = hasPhoto ? `url("${state.pendingPhotoDataUrl}")` : "";
  els.clearPhotoButton.hidden = !hasPhoto;
}

function renderCardPhoto(card) {
  const photoDataUrl = card?.photoDataUrl || "";
  els.cardPhotoFrame.classList.toggle("is-empty", !photoDataUrl);
  if (photoDataUrl) {
    els.cardPhoto.src = photoDataUrl;
    els.cardPhoto.hidden = false;
  } else {
    els.cardPhoto.removeAttribute("src");
    els.cardPhoto.hidden = true;
  }
}

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not load image"));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function priorityScore(card) {
  if (card.template) return -999;
  if (wasPrayedToday(card)) return -998;
  const cadence = adaptiveCadenceDays(card);
  const dueAt = nextDueAt(card);
  const overdueDays = dueAt ? (Date.now() - new Date(dueAt).getTime()) / 86400000 : 999;
  const urgency = overdueDays >= 0 ? 1 + overdueDays / cadence : daysSince(card.lastPrayedAt) / cadence;
  const countPenalty = Math.min(card.prayedCount || 0, 40) * 0.04;
  const skippedPenalty = state.skippedIds.has(card.id) ? 2.5 : 0;
  return urgency + priorityRank[card.priority] * 0.12 - countPenalty - skippedPenalty;
}

function chooseNextCard() {
  if (!state.cards.length) {
    state.currentId = null;
    return;
  }

  if (state.skippedIds.size >= state.cards.length) {
    state.skippedIds.clear();
  }

  const realCards = state.cards.filter((card) => !card.template);
  const available = availablePrayerCards();
  const candidates = available.length ? available : realCards.length ? [] : state.cards;
  if (!candidates.length) {
    state.currentId = null;
    return;
  }
  const sorted = [...candidates].sort((a, b) => priorityScore(b) - priorityScore(a));
  state.currentId = sorted[0].id;
}

function currentCard() {
  return state.cards.find((card) => card.id === state.currentId) || null;
}

function templatePreviewCard() {
  return {
    id: "template-preview",
    name: "Template Card",
    note:
      "Add a name, prayer request, priority, optional flags, and an optional photo. Flip cards to see the request, or use Timed Prayer for a focused slideshow.",
    priority: "medium",
    flagIds: [],
    photoDataUrl: "",
    prayedCount: 0,
    lastPrayedAt: null,
    prayerHistory: [],
    verse: defaultVerse,
    template: true,
  };
}

function realCards() {
  return state.cards.filter((card) => !card.template);
}

function filteredCards() {
  const cards = realCards();
  if (state.activeFlagId === "all") return cards;
  return cards.filter((card) => (card.flagIds || []).includes(state.activeFlagId));
}

function sortCards(cards) {
  return [...cards].sort((a, b) => {
    if (state.settings.sortMode === "name") return a.name.localeCompare(b.name);
    if (state.settings.sortMode === "lastPrayed") return daysSince(b.lastPrayedAt) - daysSince(a.lastPrayedAt);
    return priorityScore(b) - priorityScore(a) || priorityRank[b.priority] - priorityRank[a.priority];
  });
}

function renderStats() {
  const cards = filteredCards();
  const total = cards.length;
  const prayedTotal = cards.reduce((sum, card) => sum + (card.prayedCount || 0), 0);
  const dueNow = cards.filter((card) => isDue(card) && !wasPrayedToday(card)).length;
  const streaks = calculateStreaks(realCards());

  els.statsStrip.innerHTML = `
    <div class="stat"><strong>${total}</strong><span>Cards</span></div>
    <div class="stat"><strong>${dueNow}</strong><span>Due now</span></div>
    <div class="stat"><strong>${prayedTotal}</strong><span>Total prayers</span></div>
    <div class="stat"><strong>${streaks.current}</strong><span>Day streak</span></div>
    <div class="stat"><strong>${streaks.longest}</strong><span>Best streak</span></div>
  `;

  const queue = sortCards(cards).slice(0, 5);
  els.dashboardList.innerHTML = queue.length
    ? queue
        .map(
          (card) => `
            <div class="dashboard-row">
              <strong>${escapeHtml(card.name)}</strong>
              <span>${priorityLabels[card.priority]} / ${formatDue(card)} / ${formatLastPrayed(card)} / ${card.prayedCount || 0} prayers</span>
              ${renderFlagChips(flagsForCard(card))}
            </div>
          `,
        )
        .join("")
    : `<div class="empty">No cards yet</div>`;
}

function renderCurrentCard() {
  const card = currentCard();
  const existingNote = els.card.querySelector(".template-note");

  if (existingNote) existingNote.remove();

  els.card.classList.remove("is-deck-mat", "is-template-preview");
  els.cardFrontKicker.textContent = "Pray for";
  els.cardBackKicker.textContent = "Prayer request";
  els.flipButton.disabled = false;
  els.skipButton.disabled = !card;
  els.prayButton.disabled = !card;
  els.updateCardButton.disabled = !card;
  els.cardFlags.innerHTML = "";
  els.cardVerse.hidden = true;
  els.cardVerse.textContent = "";

  if (!card) {
    const allDone = realCards().length && !availablePrayerCards().length;
    if (allDone) {
      const totalCards = realCards().length;
      els.card.classList.add("is-deck-mat");
      els.cardFrontKicker.textContent = "";
      els.cardBackKicker.textContent = "Deck";
      els.cardPriority.textContent = "";
      els.cardName.textContent = "All done for today";
      els.cardMeta.textContent = "0 cards left today";
      els.cardNote.textContent = `${totalCards} ${totalCards === 1 ? "card" : "cards"} in this deck.`;
      renderCardPhoto(null);
      setCardFace(false);
      els.flipButton.disabled = true;
    } else {
      els.card.classList.add("is-template-preview");
      els.cardFrontKicker.textContent = "Welcome";
      els.cardBackKicker.textContent = "How it works";
      els.cardPriority.textContent = "";
      els.cardName.textContent = "No cards yet";
      els.cardMeta.textContent = "Add someone to begin.";
      els.cardNote.textContent =
        "Tap + to add a person, write the request, choose a priority, then flip or mark prayed.";
      els.cardVerse.hidden = true;
      els.cardVerse.textContent = "";
      renderCardPhoto(null);
      setCardFace(state.showingBack);
      const note = document.createElement("div");
      note.className = "template-note";
      note.textContent = "Use + to add your first card";
      els.cardFront.append(note);
    }
    els.skipButton.disabled = true;
    els.prayButton.disabled = true;
    els.updateCardButton.disabled = true;
    return;
  }

  els.cardPriority.textContent = card.template ? "Template" : priorityLabels[card.priority] || "Medium";
  els.cardName.textContent = card.name;
  els.cardMeta.textContent = card.template
    ? "Example only / not counted"
    : `${formatDue(card)} / ${formatLastPrayed(card)} / ${card.prayedCount || 0} prayers`;
  els.cardNote.textContent = card.note;
  const verse = formatVerse(card.verse);
  els.cardVerse.textContent = verse;
  els.cardVerse.hidden = !verse || !state.showingBack;
  els.cardFlags.innerHTML = renderFlagChips(flagsForCard(card), "light");
  renderCardPhoto(card);
  setCardFace(state.showingBack);

  if (card.template) {
    const note = document.createElement("div");
    note.className = "template-note";
    note.textContent = "Template example";
    els.cardFront.append(note);
  }

  els.prayButton.disabled = card.template || wasPrayedToday(card);
  els.skipButton.disabled = card.template;
  els.updateCardButton.disabled = card.template;
}

function setCardFace(showingBack) {
  state.showingBack = showingBack;
  els.card.classList.toggle("is-flipped", showingBack);
  els.cardFront.classList.toggle("hidden", showingBack);
  els.cardBack.classList.toggle("hidden", !showingBack);
  els.cardFront.setAttribute("aria-hidden", String(showingBack));
  els.cardBack.setAttribute("aria-hidden", String(!showingBack));
  els.cardVerse.hidden = !showingBack || !els.cardVerse.textContent;
  els.flipButton.textContent = "Flip";
}

function flipCurrentCard() {
  if (els.flipButton.disabled || els.card.classList.contains("is-flip-out")) return;

  const nextFace = !state.showingBack;
  els.card.classList.add("is-flip-out");

  window.setTimeout(() => {
    setCardFace(nextFace);
    window.requestAnimationFrame(() => {
      els.card.classList.remove("is-flip-out");
    });
  }, 220);
}

function renderFlagChips(flags, tone = "normal") {
  if (!flags.length) return "";
  return `
    <div class="flag-chip-row">
      ${flags
        .map(
          (flag) => `
            <span class="flag-chip ${tone === "light" ? "flag-chip-light" : ""}" style="--flag-color: ${escapeHtml(flag.color)}">
              ${escapeHtml(flag.name)}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderFlagPicker() {
  if (!state.flags.length) {
    els.flagPicker.innerHTML = `<div class="empty compact-empty">No flags yet</div>`;
    return;
  }

  els.flagPicker.innerHTML = state.flags
    .map((flag) => {
      const checked = state.pendingFlagIds.has(flag.id) ? "checked" : "";
      return `
        <label class="flag-toggle" style="--flag-color: ${escapeHtml(flag.color)}">
          <input type="checkbox" value="${escapeHtml(flag.id)}" ${checked} />
          <span>${escapeHtml(flag.name)}</span>
        </label>
      `;
    })
    .join("");
}

function renderFlagFilters() {
  const hasFlags = Boolean(state.flags.length);
  els.flagFilterBlock.hidden = !hasFlags;
  if (!hasFlags && state.activeFlagId !== "all") {
    state.activeFlagId = "all";
  }

  const allActive = state.activeFlagId === "all" ? " active" : "";
  const flagButtons = state.flags
    .map((flag) => {
      const active = state.activeFlagId === flag.id ? " active" : "";
      return `
        <button class="flag-filter${active}" type="button" data-flag-id="${escapeHtml(flag.id)}" style="--flag-color: ${escapeHtml(flag.color)}">
          ${escapeHtml(flag.name)}
        </button>
      `;
    })
    .join("");

  els.flagFilterList.innerHTML = `
    <button class="flag-filter${allActive}" type="button" data-flag-id="all">All</button>
    ${flagButtons}
  `;
}

function renderTimerFlagOptions() {
  const options = [
    `<option value="all">All cards</option>`,
    ...state.flags.map((flag) => `<option value="${escapeHtml(flag.id)}">${escapeHtml(flag.name)}</option>`),
  ];

  els.timerFlagInput.innerHTML = options.join("");
  const selected = state.settings.timerFlagId || "all";
  els.timerFlagInput.value =
    selected === "all" || state.flags.some((flag) => flag.id === selected) ? selected : "all";
}

function hexToRgb(hex = "") {
  const normalized = String(hex).replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function colorDistance(a, b) {
  const left = hexToRgb(a);
  const right = hexToRgb(b);
  if (!left || !right) return 0;
  return Math.hypot(left.r - right.r, left.g - right.g, left.b - right.b);
}

function suggestedFlagColor(offset = 0) {
  const usedColors = state.flags.map((flag) => flag.color).filter(isColor);
  if (!usedColors.length) {
    return flagColorPalette[offset % flagColorPalette.length];
  }

  const rankedColors = flagColorPalette
    .map((color, index) => {
      const minimumDistance = Math.min(...usedColors.map((usedColor) => colorDistance(color, usedColor)));
      const reusePenalty = usedColors.includes(color) ? 1000 : 0;
      return { color, score: minimumDistance - reusePenalty, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return rankedColors[offset % rankedColors.length].color;
}

function renderFlagColorChoices() {
  document.querySelectorAll(".flag-swatches button").forEach((button, index) => {
    const color = suggestedFlagColor(index);
    button.dataset.color = color;
    button.style.setProperty("--swatch-color", color);
  });
}

function renderList() {
  const query = els.searchInput.value.trim().toLowerCase();
  const cards = sortCards(filteredCards())
    .filter((card) => {
      const flagText = flagsForCard(card)
        .map((flag) => flag.name)
        .join(" ");
      const haystack = `${card.name} ${card.note} ${flagText}`.toLowerCase();
      return haystack.includes(query);
    });

  els.libraryCount.textContent = filteredCards().length;

  if (!cards.length) {
    els.personList.innerHTML = `<div class="empty">${realCards().length ? "No matches" : "No people added yet"}</div>`;
    return;
  }

  els.personList.innerHTML = cards
    .map((card) => {
      const priority = priorityLabels[card.priority] || "Medium";
      const active = card.id === state.currentId ? " active" : "";
      const prayedToday = wasPrayedToday(card);
      return `
        <div class="person-item${active}" data-id="${card.id}">
          <div>
            <p class="person-name">${escapeHtml(card.name)}</p>
            <p class="person-detail">${priority} / ${formatDue(card)} / ${formatLastPrayed(card)} / ${card.prayedCount || 0} prayers</p>
            ${renderFlagChips(flagsForCard(card))}
          </div>
          <div class="item-actions">
            <button class="item-button" type="button" data-action="focus">View</button>
            <button class="item-button" type="button" data-action="pray" ${prayedToday ? "disabled" : ""}>Pray</button>
            <button class="item-button" type="button" data-action="edit">Edit</button>
            <button class="item-button danger" type="button" data-action="delete">Delete</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

function render() {
  if (!state.currentId && state.cards.length) chooseNextCard();
  els.dashboardSortInput.value = state.settings.sortMode;
  els.timerPerCardInput.value = state.settings.timerPerCardSeconds;
  els.timerTotalInput.value = state.settings.timerTotalMinutes;
  renderFlagFilters();
  renderFlagPicker();
  renderTimerFlagOptions();
  renderFlagColorChoices();
  renderStats();
  renderCurrentCard();
  renderList();
}

function syncTimerSettings() {
  const perCard = Number(els.timerPerCardInput.value);
  const total = Number(els.timerTotalInput.value);
  state.settings.timerPerCardSeconds = clamp(Number.isFinite(perCard) ? perCard : 60, 10, 600);
  state.settings.timerTotalMinutes = clamp(Number.isFinite(total) ? total : 10, 1, 180);
  state.settings.timerFlagId = els.timerFlagInput.value || "all";
  saveSettings();
}

function timerCandidateCards() {
  const flagId = state.settings.timerFlagId || "all";
  const cards = realCards().filter(
    (card) => !wasPrayedToday(card) && (flagId === "all" || (card.flagIds || []).includes(flagId)),
  );
  return sortCards(cards);
}

function startTimedPrayer() {
  syncTimerSettings();
  const perCardSeconds = state.settings.timerPerCardSeconds;
  const totalSeconds = state.settings.timerTotalMinutes * 60;
  const maxSlides = Math.floor(totalSeconds / perCardSeconds);
  const cards = timerCandidateCards().slice(0, maxSlides);

  if (!cards.length) {
    if (maxSlides < 1) {
      showToast("Total time is too short");
    } else if (realCards().length) {
      showTimedComplete("All done today", "Every matching card has already been prayed for today.");
    } else {
      showToast("No cards for that timer");
    }
    return;
  }

  stopTimedPrayer(false);
  state.timedSession = {
    active: true,
    cards,
    index: 0,
    remainingSeconds: perCardSeconds,
    intervalId: null,
  };
  els.dashboardDrawer.hidden = true;
  els.timedSession.hidden = false;
  renderTimedSlide();
  state.timedSession.intervalId = window.setInterval(tickTimedPrayer, 1000);
}

function stopTimedPrayer(shouldRender = true) {
  if (state.timedSession.intervalId) {
    window.clearInterval(state.timedSession.intervalId);
  }

  state.timedSession = {
    active: false,
    cards: [],
    index: 0,
    remainingSeconds: 0,
    intervalId: null,
  };
  els.timedSession.hidden = true;

  if (shouldRender) {
    state.currentId = null;
    chooseNextCard();
    render();
  }
}

function renderTimedSlide() {
  const session = state.timedSession;
  const card = session.cards[session.index];
  const total = session.cards.length;
  const progress = total ? (session.index / total) * 100 : 0;
  const verse = formatVerse(card?.verse);
  const hasPhoto = Boolean(card?.photoDataUrl);

  els.timerSlideName.textContent = card?.name || "Finished";
  els.timerSlideNote.textContent = card?.note || "Timed prayer complete.";
  els.timerSlideVerse.textContent = verse;
  els.timerSlideVerse.hidden = !verse;
  els.timerPhotoFrame.classList.toggle("is-empty", !hasPhoto);
  if (hasPhoto) {
    els.timerPhoto.src = card.photoDataUrl;
    els.timerPhoto.hidden = false;
  } else {
    els.timerPhoto.removeAttribute("src");
    els.timerPhoto.hidden = true;
  }
  els.timerCountdown.textContent = formatTimerSeconds(session.remainingSeconds);
  els.timerProgressText.textContent = `${Math.min(session.index + 1, total)} / ${total}`;
  els.timerProgressBar.style.width = `${progress}%`;
}

function tickTimedPrayer() {
  if (!state.timedSession.active) return;

  state.timedSession.remainingSeconds -= 1;
  if (state.timedSession.remainingSeconds <= 0) {
    finishTimedSlide();
    return;
  }

  renderTimedSlide();
}

function finishTimedSlide() {
  const session = state.timedSession;
  const card = session.cards[session.index];
  if (card) {
    if (markCardPrayed(card)) saveCards();
  }

  session.index += 1;
  if (session.index >= session.cards.length) {
    showTimedComplete("All done", "Every completed slide has been marked prayed for today.");
    state.currentId = null;
    chooseNextCard();
    renderStats();
    renderList();
    return;
  }

  session.remainingSeconds = state.settings.timerPerCardSeconds;
  renderTimedSlide();
}

function showTimedComplete(title, message) {
  if (state.timedSession.intervalId) {
    window.clearInterval(state.timedSession.intervalId);
  }

  state.timedSession.active = false;
  state.timedSession.intervalId = null;
  els.dashboardDrawer.hidden = true;
  els.timedSession.hidden = false;
  els.timerSlideName.textContent = title;
  els.timerSlideNote.textContent = message;
  els.timerSlideVerse.textContent = "";
  els.timerSlideVerse.hidden = true;
  els.timerPhotoFrame.classList.add("is-empty");
  els.timerPhoto.removeAttribute("src");
  els.timerPhoto.hidden = true;
  els.timerCountdown.textContent = "Done";
  els.timerProgressText.textContent = "Complete";
  els.timerProgressBar.style.width = "100%";
}

function resetForm() {
  state.editingId = null;
  state.pendingPhotoDataUrl = "";
  state.pendingFlagIds.clear();
  els.cardForm.reset();
  els.priorityInput.value = "medium";
  els.flagNameInput.value = "";
  els.flagColorInput.value = suggestedFlagColor(0);
  updatePriorityStyle();
  updatePhotoPreview();
  renderFlagPicker();
  renderFlagColorChoices();
  els.formTitle.textContent = "Add Card";
  els.saveButton.textContent = "Add Card";
}

function openForm(card = null) {
  if (card) {
    state.editingId = card.id;
    state.pendingPhotoDataUrl = card.photoDataUrl || "";
    state.pendingFlagIds = new Set(card.flagIds || []);
    els.nameInput.value = card.name;
    els.noteInput.value = card.note;
    els.priorityInput.value = card.priority;
    els.formTitle.textContent = "Update Card";
    els.saveButton.textContent = "Save Changes";
  } else {
    resetForm();
  }

  updatePriorityStyle();
  updatePhotoPreview();
  renderFlagPicker();
  els.formModal.hidden = false;
  els.nameInput.focus();
}

function closeForm() {
  els.formModal.hidden = true;
  resetForm();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

function closeActiveOverlay() {
  if (!els.timedSession.hidden) {
    stopTimedPrayer(true);
    return true;
  }

  if (!els.formModal.hidden) {
    closeForm();
    return true;
  }

  if (!els.importModal.hidden) {
    els.importModal.hidden = true;
    return true;
  }

  if (!els.dashboardDrawer.hidden) {
    els.dashboardDrawer.hidden = true;
    return true;
  }

  return false;
}

function openDashboardAndSearch() {
  els.dashboardDrawer.hidden = false;
  requestAnimationFrame(() => els.searchInput.focus());
}

window.prayerCardsCommand = (command) => {
  switch (command) {
    case "new-card":
      openForm();
      break;
    case "open-menu":
      openDashboardAndSearch();
      break;
    case "timed-prayer":
      startTimedPrayer();
      break;
    case "export":
      exportCards();
      break;
    case "import":
      els.importModal.hidden = false;
      break;
    case "close-overlay":
      closeActiveOverlay();
      break;
    default:
      break;
  }
};

function addFlagFromForm() {
  const name = els.flagNameInput.value.trim();
  const color = els.flagColorInput.value;
  if (!name) return;

  const existing = state.flags.find((flag) => flag.name.toLowerCase() === name.toLowerCase());
  const flag = existing || { id: uid(), name, color };

  if (!existing) {
    state.flags.push(flag);
    saveFlags();
  }

  state.pendingFlagIds.add(flag.id);
  els.flagNameInput.value = "";
  els.flagColorInput.value = suggestedFlagColor(0);
  els.flagPopover.hidden = true;
  render();
}

function ensureFlag(name, color = suggestedFlagColor(0)) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;

  const existing = state.flags.find((flag) => flag.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing.id;

  const flag = { id: uid(), name: trimmed, color };
  state.flags.push(flag);
  return flag.id;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function cardsFromCsv(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];

  const headers = rows[0].map((header) => header.toLowerCase());
  const hasHeader = headers.includes("name") && headers.includes("note");
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const indexOf = (field, fallback) => {
    const index = headers.indexOf(field);
    return index >= 0 ? index : fallback;
  };

  const nameIndex = hasHeader ? indexOf("name", 0) : 0;
  const noteIndex = hasHeader ? indexOf("note", 1) : 1;
  const priorityIndex = hasHeader ? indexOf("priority", 2) : 2;
  const flagsIndex = hasHeader ? indexOf("flags", 3) : 3;

  const cards = dataRows
    .map((row) => {
      const name = row[nameIndex]?.trim();
      const note = row[noteIndex]?.trim();
      if (!name || !note) return null;

      const priorityValue = row[priorityIndex]?.toLowerCase();
      const priority = ["low", "medium", "high"].includes(priorityValue) ? priorityValue : "medium";
      const flagIds = String(row[flagsIndex] || "")
        .split(";")
        .map((flagName) => ensureFlag(flagName))
        .filter(Boolean);

      return {
        id: uid(),
        name,
        note,
        priority,
        flagIds,
        photoDataUrl: "",
        prayedCount: 0,
        lastPrayedAt: null,
        prayerHistory: [],
        verse: suggestVerseForRequest(note),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    })
    .filter(Boolean);

  saveFlags();
  return cards;
}

function exportCards() {
  const payload = JSON.stringify(
    {
      version: 3,
      cards: state.cards,
      flags: state.flags,
      settings: state.settings,
    },
    null,
    2,
  );
  const filename = `prayer-cards-${new Date().toISOString().slice(0, 10)}.json`;

  if (window.webkit?.messageHandlers?.downloadCards) {
    window.webkit.messageHandlers.downloadCards.postMessage({ filename, payload });
    return;
  }

  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function saveCardFromForm() {
  if (els.cardForm.reportValidity && !els.cardForm.reportValidity()) {
    return;
  }

  const name = els.nameInput.value.trim();
  const note = els.noteInput.value.trim();
  const priority = els.priorityInput.value || "medium";
  const flagIds = [...state.pendingFlagIds];

  if (!name || !note) {
    showToast("Name and prayer request are required");
    return;
  }

  const isEditing = Boolean(state.editingId);

  if (state.editingId) {
    const card = state.cards.find((item) => item.id === state.editingId);
    if (card) {
      const noteChanged = card.note !== note;
      card.name = name;
      card.note = note;
      card.priority = priority;
      card.flagIds = flagIds;
      card.photoDataUrl = state.pendingPhotoDataUrl;
      if (noteChanged || !card.verse) {
        card.verse = suggestVerseForRequest(note, usedVerseReferences(card.id));
      }
      card.updatedAt = new Date().toISOString();
      state.currentId = card.id;
      requestAIVerseForCard(card);
    }
  } else {
    const card = {
      id: uid(),
      name,
      note,
      priority,
      flagIds,
      photoDataUrl: state.pendingPhotoDataUrl,
      prayedCount: 0,
      lastPrayedAt: null,
      prayerHistory: [],
      verse: suggestVerseForRequest(note, usedVerseReferences()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.cards.push(card);
    state.currentId = card.id;
    requestAIVerseForCard(card);
  }

  state.showingBack = false;
  saveCards();
  closeForm();
  render();
  showToast(isEditing ? "Card updated" : "Card added");
}

els.cardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCardFromForm();
});

els.saveButton.addEventListener("click", (event) => {
  event.preventDefault();
  saveCardFromForm();
});
els.openAddButton.addEventListener("click", () => openForm());
els.cancelEditButton.addEventListener("click", closeForm);
els.updateCardButton.addEventListener("click", () => {
  const card = currentCard();
  if (card) openForm(card);
});

els.openDashboardButton.addEventListener("click", () => {
  els.dashboardDrawer.hidden = false;
});

els.closeDashboardButton.addEventListener("click", () => {
  els.dashboardDrawer.hidden = true;
});

els.dashboardDrawer.addEventListener("click", (event) => {
  if (event.target === els.dashboardDrawer) els.dashboardDrawer.hidden = true;
});

els.formModal.addEventListener("click", (event) => {
  if (event.target === els.formModal) closeForm();
  if (!event.target.closest(".flag-tools")) els.flagPopover.hidden = true;
});

els.flipButton.addEventListener("click", flipCurrentCard);

els.card.addEventListener("click", (event) => {
  if (event.target.closest("button, input, textarea, select, label, a")) return;
  flipCurrentCard();
});

els.card.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    flipCurrentCard();
  }
});

els.skipButton.addEventListener("click", () => {
  const card = currentCard();
  if (!card) return;
  state.skippedIds.add(card.id);
  state.showingBack = false;
  chooseNextCard();
  render();
});

els.prayButton.addEventListener("click", () => {
  const card = currentCard();
  if (!card) return;

  const didMark = markCardPrayed(card);
  if (!didMark) {
    showToast("Already counted today");
  }
  state.showingBack = false;
  chooseNextCard();
  if (didMark) saveCards();
  render();
});

els.personList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  const item = event.target.closest(".person-item");
  if (!button || !item) return;

  const card = state.cards.find((entry) => entry.id === item.dataset.id);
  if (!card) return;

  if (button.dataset.action === "focus") {
    state.currentId = card.id;
    state.showingBack = false;
    els.dashboardDrawer.hidden = true;
    render();
    return;
  }

  if (button.dataset.action === "delete") {
    const shouldDelete = window.confirm(`Delete ${card.name}?`);
    if (!shouldDelete) return;

    state.cards = state.cards.filter((entry) => entry.id !== card.id);
    state.skippedIds.delete(card.id);
    if (state.currentId === card.id) {
      state.currentId = null;
      state.showingBack = false;
      chooseNextCard();
    }
    if (state.editingId === card.id) resetForm();
    saveCards();
    render();
    return;
  }

  if (button.dataset.action === "pray") {
    if (markCardPrayed(card)) {
      if (state.currentId === card.id) {
        state.currentId = null;
        state.showingBack = false;
        chooseNextCard();
      }
      saveCards();
      render();
    } else {
      showToast("Already counted today");
    }
    return;
  }

  openForm(card);
});

els.searchInput.addEventListener("input", renderList);
els.priorityInput.addEventListener("change", updatePriorityStyle);
els.dashboardSortInput.addEventListener("change", () => {
  state.settings.sortMode = els.dashboardSortInput.value;
  saveSettings();
  render();
});
els.timerPerCardInput.addEventListener("change", syncTimerSettings);
els.timerTotalInput.addEventListener("change", syncTimerSettings);
els.timerFlagInput.addEventListener("change", syncTimerSettings);
els.openTimedPrayerButton.addEventListener("click", startTimedPrayer);
els.startTimedPrayerButton.addEventListener("click", startTimedPrayer);
els.exitTimedPrayerButton.addEventListener("click", () => stopTimedPrayer(true));

els.flagPicker.addEventListener("change", (event) => {
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;

  if (input.checked) {
    state.pendingFlagIds.add(input.value);
  } else {
    state.pendingFlagIds.delete(input.value);
  }
});

els.addFlagButton.addEventListener("click", addFlagFromForm);
els.openFlagCreatorButton.addEventListener("click", () => {
  els.flagPopover.hidden = !els.flagPopover.hidden;
  if (!els.flagPopover.hidden) els.flagNameInput.focus();
});
els.flagNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addFlagFromForm();
  }
});

document.querySelectorAll(".flag-swatches button").forEach((button) => {
  button.addEventListener("click", () => {
    els.flagColorInput.value = button.dataset.color;
  });
});

document.addEventListener("keydown", (event) => {
  const isCommandShortcut = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
  const isControlShortcut = event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
  const key = event.key.toLowerCase();
  const isEditable = isEditableElement(event.target);

  if ((isCommandShortcut || isControlShortcut) && key === "a" && isEditable) {
    if (selectEditableContents(event.target)) {
      event.preventDefault();
    }
    return;
  }

  if (event.key === "Escape") {
    if (closeActiveOverlay()) event.preventDefault();
    return;
  }

  if (isEditable) return;
  if (!isCommandShortcut) return;

  const commands = {
    n: "new-card",
    f: "open-menu",
    t: "timed-prayer",
    e: "export",
    i: "import",
  };

  const command = commands[key];
  if (!command) return;

  event.preventDefault();
  window.prayerCardsCommand(command);
});

els.flagFilterList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-flag-id]");
  if (!button) return;
  state.activeFlagId = button.dataset.flagId;
  render();
});

els.photoInput.addEventListener("change", async () => {
  const file = els.photoInput.files?.[0];
  if (!file) return;

  try {
    state.pendingPhotoDataUrl = await imageFileToDataUrl(file);
    updatePhotoPreview();
  } catch {
    showToast("Photo could not be loaded");
  } finally {
    els.photoInput.value = "";
  }
});

els.clearPhotoButton.addEventListener("click", () => {
  state.pendingPhotoDataUrl = "";
  updatePhotoPreview();
});

els.exportButton.addEventListener("click", exportCards);
els.drawerExportButton.addEventListener("click", exportCards);
els.openImportHelpButton.addEventListener("click", () => {
  els.importModal.hidden = false;
});
els.resetAllButton.addEventListener("click", () => {
  const shouldReset = window.confirm("Delete all cards, flags, and settings? This cannot be undone unless you have an export.");
  if (!shouldReset) return;

  state.cards = [];
  state.flags = [];
  state.settings = { ...defaultSettings };
  state.currentId = null;
  state.activeFlagId = "all";
  state.showingBack = false;
  state.skippedIds.clear();
  saveCards();
  saveFlags();
  saveSettings();
  render();
  showToast("Reset complete");
});
els.closeImportHelpButton.addEventListener("click", () => {
  els.importModal.hidden = true;
});
els.chooseImportFileButton.addEventListener("click", () => {
  els.importInput.click();
});
els.importModal.addEventListener("click", (event) => {
  if (event.target === els.importModal) els.importModal.hidden = true;
});

els.importInput.addEventListener("change", async () => {
  const file = els.importInput.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const isCsv = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
    const imported = isCsv ? { cards: cardsFromCsv(text), flags: state.flags, settings: state.settings } : JSON.parse(text);
    const importedCards = Array.isArray(imported) ? imported : imported.cards;
    const importedFlags = Array.isArray(imported.flags) ? imported.flags : state.flags;

    if (!Array.isArray(importedCards)) throw new Error("Invalid file");

    state.flags = importedFlags.map(normalizeFlag).filter(Boolean);
    state.cards = importedCards
      .filter((card) => card.name && card.note)
      .map((card) =>
        normalizeCard({
          id: card.id || uid(),
          name: String(card.name),
          note: String(card.note),
          priority: ["low", "medium", "high"].includes(card.priority) ? card.priority : "medium",
          flagIds: Array.isArray(card.flagIds) ? card.flagIds : [],
          photoDataUrl: typeof card.photoDataUrl === "string" ? card.photoDataUrl : "",
          prayedCount: Number(card.prayedCount || 0),
          lastPrayedAt: card.lastPrayedAt || null,
          prayerHistory: Array.isArray(card.prayerHistory) ? card.prayerHistory : [],
          verse: card.verse || null,
          createdAt: card.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template: Boolean(card.template),
        }),
      );

    state.settings = { ...defaultSettings, ...(imported.settings || {}) };
    state.currentId = null;
    state.activeFlagId = "all";
    state.showingBack = false;
    els.importModal.hidden = true;
    ensureUniqueCardVerses();
    saveFlags();
    saveCards();
    saveSettings();
    render();
    showToast("Imported cards");
  } catch {
    showToast("Import failed");
  } finally {
    els.importInput.value = "";
  }
});

if (ensureUniqueCardVerses()) {
  saveCards();
}
render();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}
