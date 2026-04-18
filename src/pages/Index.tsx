import { useState } from "react";
import { Level, Mode } from "@/data/prompts";
import { LevelToggle } from "@/components/LevelToggle";
import { ModeCard } from "@/components/ModeCard";
import { PromptCard } from "@/components/PromptCard";
import { AgeGate } from "@/components/AgeGate";
import { Heart } from "lucide-react";

const Index = () => {
  const [level, setLevel] = useState<Level>("sweet");
  const [mode, setMode] = useState<Mode | null>(null);
  const [pendingLevel, setPendingLevel] = useState<Level | null>(null);
  const [spicyUnlocked, setSpicyUnlocked] = useState(false);

  const handleLevelChange = (l: Level) => {
    if (l === "spicy" && !spicyUnlocked) {
      setPendingLevel(l);
      return;
    }
    setLevel(l);
  };

  return (
    <main className="min-h-screen w-full px-5 py-10 md:py-16 flex flex-col items-center">
      {/* decorative blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-secondary/60 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-accent/50 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <header className="text-center max-w-md mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-soft mb-5">
          <Heart className="w-3.5 h-3.5 text-primary animate-heartbeat" fill="currentColor" />
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Just for two
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground leading-[1.05] mb-3">
          Closer,
          <em className="text-primary"> together</em>
        </h1>
        <p className="text-muted-foreground text-balance">
          A little game of questions, dares & moments — to fall a little deeper, again and again.
        </p>
      </header>

      {!mode ? (
        <>
          <div className="mb-8">
            <LevelToggle value={level} onChange={handleLevelChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {(["questions", "dares", "wyr", "activities"] as Mode[]).map((m) => (
              <ModeCard key={m} mode={m} onClick={() => setMode(m)} />
            ))}
          </div>
          <p className="mt-10 text-xs text-muted-foreground/70 text-center max-w-xs">
            Play with consent and curiosity. Either of you can skip any prompt, anytime. ♡
          </p>
        </>
      ) : (
        <div className="w-full">
          <div className="flex justify-center mb-6">
            <LevelToggle value={level} onChange={handleLevelChange} />
          </div>
          <PromptCard mode={mode} level={level} onBack={() => setMode(null)} />
        </div>
      )}

      {pendingLevel && (
        <AgeGate
          onConfirm={() => {
            setSpicyUnlocked(true);
            setLevel("spicy");
            setPendingLevel(null);
          }}
          onCancel={() => setPendingLevel(null)}
        />
      )}
    </main>
  );
};

export default Index;
