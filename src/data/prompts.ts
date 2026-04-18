export type Level = "sweet" | "flirty" | "spicy";
export type Mode = "questions" | "dares" | "wyr" | "activities";

export const MODE_META: Record<Mode, { title: string; subtitle: string; emoji: string }> = {
  questions: { title: "Deep Questions", subtitle: "Know each other, deeper", emoji: "💬" },
  dares: { title: "Truth or Dare", subtitle: "Playful little challenges", emoji: "🎭" },
  wyr: { title: "Would You Rather", subtitle: "Impossible choices, together", emoji: "🤔" },
  activities: { title: "Intimate Activities", subtitle: "Connect, body & soul", emoji: "🌹" },
};

type PromptSet = Record<Mode, Record<Level, string[]>>;

export const PROMPTS: PromptSet = {
  questions: {
    sweet: [
      "What was the exact moment you knew you were falling for me?",
      "Which memory of us would you relive forever?",
      "What's a small thing I do that always makes your day better?",
      "Where do you picture us five years from now?",
      "What's something you've never told anyone, but want to tell me?",
      "When do you feel most loved by me?",
      "What's your favorite version of me?",
      "What dream of yours do you most want me to be part of?",
      "What does 'home' mean to you when you think of us?",
      "What's the song that reminds you most of us?",
    ],
    flirty: [
      "What's the first thing you noticed about me physically?",
      "What's something I wear that drives you a little wild?",
      "Describe our perfect stay-in-bed Sunday.",
      "What's a fantasy date you've never told me about?",
      "What's your favorite way I touch you?",
      "If we had 24 hours alone, what would we do?",
      "What's the most attractive thing I do without realizing it?",
      "Where's somewhere unexpected you'd love to kiss me?",
    ],
    spicy: [
      "What's a fantasy you've been too shy to share with me?",
      "What's the most turned-on you've ever been by me?",
      "What's something new you've been wanting to try together?",
      "Describe in detail your favorite night we've had.",
      "What's a secret turn-on you have?",
      "Where in our home haven't we — but you'd like to?",
      "What outfit would you most love to see me in tonight?",
      "What's a word or phrase that always gets to you?",
    ],
  },
  dares: {
    sweet: [
      "Give me a 30-second hug without saying a word.",
      "Tell me three things you love about me, looking in my eyes.",
      "Slow dance with me to the next song that plays.",
      "Write a tiny love note and hide it for me to find tomorrow.",
      "Kiss my forehead and tell me a secret.",
      "Recreate our first date — in this room, right now.",
    ],
    flirty: [
      "Give me a 60-second neck or shoulder massage.",
      "Whisper something flirty in my ear.",
      "Kiss me somewhere you've never kissed me before.",
      "Take a cute selfie of us — your pose, my smile.",
      "Feed me something sweet — no hands for me.",
      "Show me your best slow striptease — keep one piece on.",
    ],
    spicy: [
      "Blindfold me and trace your favorite part of me with a fingertip.",
      "Kiss me for 60 seconds — no breaks.",
      "Tell me, in detail, what you want to do to me later.",
      "Lose one piece of clothing of my choice.",
      "Give me a slow, full-body massage with oil.",
      "Take me by the hand and lead me wherever you want.",
    ],
  },
  wyr: {
    sweet: [
      "Would you rather slow dance in the kitchen or stargaze on a rooftop?",
      "Would you rather get handwritten love letters or surprise voice notes?",
      "Would you rather travel the world with me or build a quiet little home?",
      "Would you rather always cuddle big spoon or little spoon?",
      "Would you rather have breakfast in bed or a midnight picnic?",
    ],
    flirty: [
      "Would you rather make out in the rain or in front of a fireplace?",
      "Would you rather give me a massage or receive one?",
      "Would you rather skinny dip at sunset or shower together by candlelight?",
      "Would you rather be teased all day or surprised at night?",
      "Would you rather lock eyes across a crowded room or sneak away early?",
    ],
    spicy: [
      "Would you rather be in charge tonight, or be told exactly what to do?",
      "Would you rather slow and teasing, or fast and intense?",
      "Would you rather lights on or blindfolds on?",
      "Would you rather a hotel weekend, or never leave the bedroom for 24 hours?",
      "Would you rather try something new together, or perfect a favorite?",
    ],
  },
  activities: {
    sweet: [
      "Eye-gazing for 2 minutes — no words, just presence.",
      "Trade three genuine compliments, slowly.",
      "Synchronized breathing for 1 minute, foreheads touching.",
      "Give each other a 5-minute hand massage.",
      "Share your favorite memory of us in detail.",
    ],
    flirty: [
      "Slow dance to one full song — no phones.",
      "Take turns kissing somewhere new for 30 seconds each.",
      "Feed each other dessert blindfolded.",
      "Trade 3-minute back massages.",
      "Undress each other one piece at a time, slowly.",
    ],
    spicy: [
      "Sensual massage — 5 minutes each, with oil, anywhere they want.",
      "Blindfolded touch: explore each other for 3 minutes using only fingertips.",
      "Take turns giving instructions for 5 minutes — your partner follows.",
      "Make out for a full song — hands stay above the waist.",
      "Whisper your fantasy in their ear, then act out the first scene.",
      "Mirror game: whatever they do to you, you do back — slowly.",
    ],
  },
};

export function getRandom(mode: Mode, level: Level, exclude?: string): string {
  const pool = PROMPTS[mode][level];
  let pick = pool[Math.floor(Math.random() * pool.length)];
  if (exclude && pool.length > 1) {
    let safety = 0;
    while (pick === exclude && safety++ < 10) {
      pick = pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return pick;
}
