import { useEffect, useState } from "react";
import { Level, Mode } from "@/data/prompts";
import { LevelToggle } from "@/components/LevelToggle";
import { ModeCard } from "@/components/ModeCard";
import { PromptCard } from "@/components/PromptCard";
import { AgeGate } from "@/components/AgeGate";
import { MultiplayerLobby } from "@/components/MultiplayerLobby";
import { RoomView } from "@/components/RoomView";
import { useRoom, Room } from "@/hooks/useRoom";
import { useLang } from "@/i18n/LanguageContext";
import { Heart, Users } from "lucide-react";

type View = "home" | "solo" | "lobby" | "room";

const Index = () => {
  const { lang, setLang, t } = useLang();
  const [level, setLevel] = useState<Level>("sweet");
  const [mode, setMode] = useState<Mode | null>(null);
  const [pendingLevel, setPendingLevel] = useState<Level | null>(null);
  const [spicyUnlocked, setSpicyUnlocked] = useState(false);
  const [view, setView] = useState<View>("home");
  const [roomId, setRoomId] = useState<string | null>(null);
  const liveRoom = useRoom(roomId);

  // Drive level-based theme
  const activeLevel = liveRoom?.level ?? level;
  useEffect(() => {
    document.body.dataset.level = activeLevel;
    return () => { delete document.body.dataset.level; };
  }, [activeLevel]);

  const handleLevelChange = (l: Level) => {
    if (l === "spicy" && !spicyUnlocked) {
      setPendingLevel(l);
      return;
    }
    setLevel(l);
  };

  const handleRoomJoined = (r: Room) => {
    setRoomId(r.id);
    setView("room");
  };

  return (
    <main className="min-h-screen w-full px-5 py-10 md:py-16 flex flex-col items-center">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-secondary/60 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-accent/50 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Language toggle - always visible */}
      <div className="fixed top-4 end-4 z-40 inline-flex rounded-full bg-white/60 backdrop-blur-md p-1 shadow-soft border border-white/80 text-xs">
        {(["en", "he"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              lang === l ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l === "en" ? "EN" : "עב"}
          </button>
        ))}
      </div>

      {view === "home" && (
        <header className="text-center max-w-md mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-soft mb-5">
            <Heart className="w-3.5 h-3.5 text-primary animate-heartbeat" fill="currentColor" />
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{t.brandTag}</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground leading-[1.05] mb-3">
            {t.heroLine1}
            <em className="text-primary"> {t.heroLine2}</em>
          </h1>
          <p className="text-muted-foreground text-balance">{t.heroSub}</p>
        </header>
      )}

      {view === "home" && (
        <>
          <div className="mb-6">
            <LevelToggle value={level} onChange={handleLevelChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {(["questions", "dares", "wyr", "activities"] as Mode[]).map((m) => (
              <ModeCard key={m} mode={m} onClick={() => { setMode(m); setView("solo"); }} />
            ))}
          </div>

          <button
            onClick={() => setView("lobby")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium text-foreground"
          >
            <Users className="w-4 h-4 text-primary" />
            {t.togetherCta}
          </button>

          <p className="mt-8 text-xs text-muted-foreground/70 text-center max-w-xs">{t.consentNote}</p>
        </>
      )}

      {view === "solo" && mode && (
        <div className="w-full">
          <div className="flex justify-center mb-6">
            <LevelToggle value={level} onChange={handleLevelChange} />
          </div>
          <PromptCard mode={mode} level={level} onBack={() => { setMode(null); setView("home"); }} />
        </div>
      )}

      {view === "lobby" && (
        <MultiplayerLobby onJoined={handleRoomJoined} onBack={() => setView("home")} />
      )}

      {view === "room" && liveRoom && (
        <RoomView room={liveRoom} onLeave={() => { setRoomId(null); setView("home"); }} />
      )}

      {view === "room" && !liveRoom && (
        <div className="text-muted-foreground text-sm">{t.connecting}</div>
      )}

      {pendingLevel && (
        <AgeGate
          onConfirm={() => { setSpicyUnlocked(true); setLevel("spicy"); setPendingLevel(null); }}
          onCancel={() => setPendingLevel(null)}
        />
      )}
    </main>
  );
};

export default Index;
