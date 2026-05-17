import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "he";

const STORAGE_KEY = "closer-lang";

type UI = {
  brandTag: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  togetherCta: string;
  consentNote: string;
  back: string;
  leave: string;
  next: string;
  shuffle: string;
  yourTurn: string;
  partnerTurn: string;
  waitingPartner: string;
  sendNext: string;
  shareCode: string;
  codeCopied: string;
  playTogether: string;
  twoPhones: string;
  createRoom: string;
  joinRoom: string;
  creating: string;
  joining: string;
  chooseMode: string;
  enterCode: string;
  codeMustBe4: string;
  notFound: string;
  cantJoin: string;
  cantCreate: string;
  cantShuffle: string;
  roomFull: string;
  connecting: string;
  spicyTitle: string;
  spicyBody: string;
  spicyConfirm: string;
  spicyCancel: string;
  levels: { sweet: string; flirty: string; spicy: string };
  language: string;
  like: string;
  skip: string;
  swipeHint: string;
};

const STRINGS: Record<Lang, UI> = {
  en: {
    brandTag: "Just for two",
    heroLine1: "Closer,",
    heroLine2: "together",
    heroSub: "A little game of questions, dares & moments — to fall a little deeper, again and again.",
    togetherCta: "Play together on two phones",
    consentNote: "Play with consent and curiosity. Either of you can skip any prompt, anytime.",
    back: "Back",
    leave: "Leave",
    next: "Next prompt",
    shuffle: "Shuffle",
    yourTurn: "Your turn — read & answer",
    partnerTurn: "Partner's turn",
    waitingPartner: "Waiting for partner…",
    sendNext: "Send next prompt",
    shareCode: "Share the code",
    codeCopied: "Code copied",
    playTogether: "Play together",
    twoPhones: "Two phones, one game.",
    createRoom: "Create room",
    joinRoom: "Join room",
    creating: "Creating…",
    joining: "Joining…",
    chooseMode: "Choose a starting mode",
    enterCode: "Enter the 4-letter code",
    codeMustBe4: "Code must be 4 characters",
    notFound: "Room not found",
    cantJoin: "Could not join",
    cantCreate: "Could not create room",
    cantShuffle: "Could not shuffle",
    roomFull: "Room is full",
    connecting: "Connecting to room…",
    spicyTitle: "Spicy Mode",
    spicyBody: "Spicy content includes intimate prompts intended for consenting adults 18+. Both partners should be comfortable. You can always skip a card.",
    spicyConfirm: "We're 18+ and ready",
    spicyCancel: "Maybe later",
    levels: { sweet: "Sweet", flirty: "Flirty", spicy: "Spicy" },
    language: "Language",
    like: "Love it",
    skip: "Skip",
    swipeHint: "Swipe right to love, left to skip",
  },
  he: {
    brandTag: "רק לשניים",
    heroLine1: "קרובים,",
    heroLine2: "ביחד",
    heroSub: "משחק קטן של שאלות, אתגרים ורגעים, כדי להתאהב קצת יותר עמוק, שוב ושוב.",
    togetherCta: "שחקו יחד משני מכשירים",
    consentNote: "שחקו בהסכמה ובסקרנות. תמיד אפשר לדלג על כל שאלה.",
    back: "חזרה",
    leave: "יציאה",
    next: "השאלה הבאה",
    shuffle: "ערבוב",
    yourTurn: "התור שלך, לקרוא ולענות",
    partnerTurn: "התור של בן/בת הזוג",
    waitingPartner: "מחכים לבן/בת הזוג…",
    sendNext: "שלחו את הבאה",
    shareCode: "שתפו את הקוד",
    codeCopied: "הקוד הועתק",
    playTogether: "שחקו יחד",
    twoPhones: "שני מכשירים, משחק אחד.",
    createRoom: "צרו חדר",
    joinRoom: "הצטרפו לחדר",
    creating: "יוצרים חדר…",
    joining: "מצטרפים…",
    chooseMode: "בחרו מצב התחלה",
    enterCode: "הקלידו קוד בן 4 תווים",
    codeMustBe4: "הקוד חייב להכיל 4 תווים",
    notFound: "החדר לא נמצא",
    cantJoin: "לא הצלחנו להצטרף",
    cantCreate: "לא הצלחנו ליצור חדר",
    cantShuffle: "לא הצלחנו לערבב",
    roomFull: "החדר מלא",
    connecting: "מתחברים לחדר…",
    spicyTitle: "מצב פיקנטי",
    spicyBody: "התכנים הפיקנטיים כוללים שאלות אינטימיות, ומיועדים לבגירים מגיל 18+ בהסכמה מלאה. חשוב ששניכם תרגישו בנוח. תמיד אפשר לדלג.",
    spicyConfirm: "אנחנו 18+ ומוכנים",
    spicyCancel: "אולי בפעם אחרת",
    levels: { sweet: "רומנטי", flirty: "מפלרטט", spicy: "פיקנטי" },
    language: "שפה",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: UI };
const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = (): Ctx => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
};
