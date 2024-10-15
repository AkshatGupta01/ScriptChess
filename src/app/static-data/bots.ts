import { Bot } from "../models/bots";

let noviceBots: Bot[] = [
    {
        name: "Ava",
        description: "Eva is a beginner chess player with an eager and curious personality. She is very active in local club tournaments.She is also a popular Yoga trainer.",
        strength: "Attack",
        image: "ava.jpg",
        designation: "Yoga Trainer",
        elo: 700,
        comments: {
            "opening": "I'm just coming from my yoga center, sorry if I kept you waiting.",
            "mateSeqGiven": "I guess you won't suffer for long.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Max",
        description: "Max is a coach who help people achieve their fitness goals. He is also a chess player with a cautious and careful personality. He's a bit hesitant to make bold moves or take risks, preferring to play it safe and avoid making mistakes.",
        strength: "Positional",
        image: "max.jpg",
        designation: "Fitness Coach",
        elo: 850,
        comments: {
            "opening": "It's time for brain training. Let's go",
            "mateSeqGiven": "Just few moves more",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Zoe",
        description: "Zoe is a fashion consultant suggests and people their perfect style. She's stylish and trendy. She is also a club level chess player. She is a beginner chess bot with a playful and exploratory personality. She loves to experiment with different moves and tactics, always looking for new ways to approach the game and challenge her opponents",
        strength: "Attack",
        image: "zoe.jpg",
        designation: "Fashion consultant",
        elo: 950,
        comments: {
            "opening": "Let's have a fantastic game",
            "mateSeqGiven": "I guess I have eye on money.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Jack",
        description: "Jack is a financial advisor who help people manage their money.He may not have the most experience or skill yet, but he's determined to keep practicing and improving until he becomes a formidable player",
        strength: "Attack",
        image: "zoe.jpg",
        designation: "Financial Advisor",
        elo: 1100,
        comments: {
            "opening": "I best I will win this",
            "mateSeqGiven": "I guess I have eye on money.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Lily",
        description: "Lily is a therapist who helps people with their mental health. She is a beginner chess bot with a logical and strategic personality. She approaches each game with a methodical and analytical mindset, carefully analyzing his opponents' moves and anticipating their next moves in order to gain an advantage on the board",
        strength: "Positional",
        image: "lily.jpg",
        designation: "Therapist",
        elo: 1200,
        comments: {
            "opening": "I'll explain my game with you to king Dhritrastra, Let's begin",
            "mateSeqGiven": "I guess it will be an interesting story to describe.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    }
]

let bots: Bot[] = [
    {
        name: "Sanjay",
        description: "Sanjay is Chariot driver of King Dhritrastra, He is very skilled and smart guy. He has a boon of Seeing things happening any where on earth. He recited the entire happening of Mahabharat to king Dhritrashtra. Can you beat him on chess board?",
        strength: "Attack",
        image: "sanjay.jpg",
        designation: "Chariot Driver",
        elo: 1500,
        comments: {
            "opening": "I'll explain my game with you to king Dhritrastra, Let's begin",
            "mateSeqGiven": "I guess it will be an interesting story to describe.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Baby Abhimanyu",
        description: "Abhimanyu is son of Warrior Arjun. He learnt to break A complex military formation named Chakravhiew while his mother Subharata was pregnant with him. Can you handle the brilliance of such child?",
        strength: "Attack",
        image: "baby-abhimanyu.jpg",
        elo: 2000,
        designation: "Warrior",
        comments: {
            "opening": "Uncle Krishna has taught me very well, I am interested in testing my learnings, Let's play",
            "mateSeqGiven": "Looks like I am very close to win :)",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Duryodhan",
        description: "Duryodhan is Prince of Hastinapur, For whole life he had developed hatered for Pandwas. He is fierce Maharathi with amazing strength. He is very skilled in warfare. Can you handle the heat he brings on the board?",
        strength: "Attack",
        image: "duryodhan.jpg",
        designation: "Prince",
        elo: 2300,
        comments: {
            "opening": "I'll take you in my army if you are better than me, else i'll crush you with my bare hand? Let's play.",
            "mateSeqGiven": "You are not worthy, Let's finish this",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Bhim",
        description: "Bhim is prince of Indraprastha, He is Demigod, Son of Pawan Dev (God of Air), He is Maharathi with super human strength equivalant of 10,000 elephants. Can you stand against his might on the board?",
        strength: "Attack",
        image: "bhim.jpg",
        designation: "Prince",
        elo: 2500,
        comments: {
            "opening": "You Saw me and yet you came to fight? I will show you your place.",
            "mateSeqGiven": "How many time you'll get defeated until you defeat me? Please Learn to play better chess",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Shakuni",
        description: "Shakuni is king of Gandhaar and brother of Gandhaari, who is queen of Hashtinapur and mother of Kauravas. He is mischivious with too much evil in mind. He is infamous of using illeagal means to win any war. Are you ready to defeat him? Word of Caution, He may Cheat!!!!",
        strength: "Attack",
        image: "shakuni.jpg",
        designation: "King",
        elo: 2550,
        cheater: true,
        comments: {
            "opening": "He he he!!!, Have you come to ask for mercy?? I will take your pride first and then defeat you.",
            "mateSeqGiven": "How mercilessly I crushed you!! First learn to play child",
            "cheating": "He He He!! You think you are winning?",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Karn",
        description: "Karn is King of Ang desh. He is super skilled in archery, He is smart and a loyal friend of Duryodhan. He has personal competition with Arjun as they both are considered as best in term of archary skills. Can you Defeat this master warrior?",
        strength: "Positional",
        image: "karn.jpg",
        designation: "King",
        elo: 2700,
        comments: {
            "opening": "No one dare to stand against me. I am although keen to know what you have in your mind. Let's Play.",
            "mateSeqGiven": "Your defeat is around the corner. Take this as another learning and be better next time, Let's finish this.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Arjun",
        description: "A prince of Indraprastha, Loved by elders and favorite of Lord Krishna Himself. He is son of Indra, the king of Devas. He is considered as the best archer of the world as Declared by Sage Dron. Although, Karna would disagree. He is calm, wise, and super skilled in warfare. Can you defeat this undefeated warrior?",
        strength: "Positional",
        image: "arjun.jpg",
        designation: "Prince",
        elo: 2720,
        comments: {
            "opening": "I have conquered all my senses. Do you still think you are better than me?",
            "mateSeqGiven": "Your defeat is around the corner. Take this as another learning and be better next time, Let's finish this.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Bhishm",
        description: "Son of Holy river Ganga and Grandsire of Pandwas and Kauravs. The best of Kuru Dynasty, the only one who defeated Sage Parshurama. He is Chief of Kaurav army and protector of Hastinapur. The world has never seen a warrior like him, the undefeatable, in-front of whom Arjun himself feel inferior. Do you have what is takes to defeat Bhishma?",
        strength: "Can't decide",
        image: "bhishm.jpg",
        designation: "Ultimate Warrior",
        elo: 2810,
        comments: {
            "opening": "People regards me as second to none but Krishna. Do you have what it takes to defeat me?",
            "mateSeqGiven": "Your defeat is around the corner, But I bless you for better game next time, Let's finish this.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    },
    {
        name: "Krishn",
        description: "The embodiment of Whole reality, the incarnation of Lord Vishnu, the auspicious and guide of Arjun. The God Krishna is a complete human in all senses. Is there anything he can't do, it's yet to be found. Try your luck and skills against the God himself",
        strength: "Attack",
        image: "krishn.jpg",
        designation: "GOD",
        elo: 3000,
        comments: {
            "opening": "I decides the fate of all, But I have bound myself with my own karma, I'll play fare to let you define your fate.",
            "mateSeqGiven": "Your defeat is around the corner, But I bless you for better game next time, Let's finish this.",
            "checkReceived": "I don't see it as deadly.",
            "checkGievn": "Save your king buddy."
        }
    }
]



export { bots }
export { noviceBots }