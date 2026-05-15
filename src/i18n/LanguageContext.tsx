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
  },
  he: {
    brandTag: "רק לשניים",
    heroLine1: "קרובים,",
    heroLine2: "ביחד",
    heroSub: "משחק קטן של שאלות, אתגרים ורגעים — כדי להתאהב קצת יותר עמוק, שוב ושוב.",
    togetherCta: "שחקו יחד בשני מכשירים",
    consentNote: "שחקו בהסכמה וסקרנות. אפשר לדלג על כל שאלה, בכל רגע.",
    back: "חזרה",
    leave: "יציאה",
    next: "שאלה הבאה",
    shuffle: "ערבוב",
    yourTurn: "תורך — קרא וענה",
    partnerTurn: "תור בן/בת הזוג",
    waitingPartner: "מחכה לבן/בת הזוג…",
    sendNext: "שלח את הבא",
    shareCode: "שתפו את הקוד",
    codeCopied: "הקוד הועתק",
    playTogether: "שחקו יחד",
    twoPhones: "שני מכשירים, משחק אחד.",
    createRoom: "צרו חדר",
    joinRoom: "הצטרפו לחדר",
    creating: "יוצר…",
    joining: "מצטרף…",
    chooseMode: "בחרו מצב התחלה",
    enterCode: "הזינו קוד בן 4 תווים",
    codeMustBe4: "הקוד חייב להיות 4 תווים",
    notFound: "החדר לא נמצא",
    cantJoin: "לא ניתן להצטרף",
    cantCreate: "לא ניתן ליצור חדר",
    cantShuffle: "לא ניתן לערבב",
    roomFull: "החדר מלא",
    connecting: "מתחבר לחדר…",
    spicyTitle: "מצב חריף",
    spicyBody: "התוכן החריף כולל שאלות אינטימיות המיועדות לבגירים בני 18+ בהסכמה הדדית. ודאו ששניכם מרגישים בנוח. תמיד אפשר לדלג.",
    spicyConfirm: "אנחנו 18+ ומוכנים",
    spicyCancel: "אולי בפעם אחרת",
    levels: { sweet: "מתוק", flirty: "מתחרזק", spicy: "חריף" },
    language: "שפה",
  },
};

// Fix Hebrew flirty label
STRINGS.he.levels.flirty = "מפלרטט";

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
