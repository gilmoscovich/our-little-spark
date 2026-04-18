import { useEffect, useState } from "react";
import { Level, Mode, MODE_META, getRandom } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, Heart } from "lucide-react";

export const PromptCard = ({
  mode,
  level,
  onBack,
}: {
  mode: Mode;
  level: Level;
  onBack: () => void;
}) => {
  const meta = MODE_META[mode];
  const [prompt, setPrompt] = useState(() => getRandom(mode, level));
  const [key, setKey] = useState(0);

  useEffect(() => {
    setPrompt(getRandom(mode, level));
    setKey((k) => k + 1);
  }, [mode, level]);

  const next = () => {
    setPrompt((p) => getRandom(mode, level, p));
    setKey((k) => k + 1);
  };

  const accent =
    level === "spicy" ? "bg-gradient-spicy" : "bg-gradient-primary";

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center">
        <div className="text-3xl mb-1">{meta.emoji}</div>
        <h2 className="font-display text-2xl text-foreground">{meta.title}</h2>
      </div>

      <div
        key={key}
        className="animate-flip-in w-full aspect-[3/4] rounded-[2rem] bg-gradient-card shadow-card border border-white/80 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} />
        <Heart className="w-6 h-6 text-primary/40 mb-6" />
        <p className="font-display text-2xl md:text-3xl leading-snug text-foreground text-balance">
          {prompt}
        </p>
        <div className="absolute bottom-5 right-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          {level}
        </div>
      </div>

      <Button
        onClick={next}
        size="lg"
        className="bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-full px-8 shadow-soft"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Next prompt
      </Button>
    </div>
  );
};
