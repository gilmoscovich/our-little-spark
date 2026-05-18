import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Level, Mode, getModeMeta, getRandom } from "@/data/prompts";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowLeft, Heart, X } from "lucide-react";

type Card = { id: number; text: string };

const SWIPE_THRESHOLD = 110;

export const PromptCard = ({
  mode,
  level,
  onBack,
}: {
  mode: Mode;
  level: Level;
  onBack: () => void;
}) => {
  const { lang, t } = useLang();
  const meta = getModeMeta(mode, lang);
  const [card, setCard] = useState<Card>(() => ({ id: 0, text: getRandom(mode, level, lang) }));
  const swipeLockedRef = useRef(false);
  const swipeAnimationRef = useRef<{ stop: () => void } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  useEffect(() => {
    swipeAnimationRef.current?.stop();
    swipeLockedRef.current = false;
    setIsSwiping(false);
    setCard({ id: Date.now(), text: getRandom(mode, level, lang) });
    x.set(0);
  }, [mode, level, lang]);

  const advance = (dir: 1 | -1) => {
    if (swipeLockedRef.current) return;
    swipeLockedRef.current = true;
    setIsSwiping(true);

    const offscreenX = dir * (Math.max(window.innerWidth, 420) + 360);
    swipeAnimationRef.current?.stop();
    swipeAnimationRef.current = animate(x, offscreenX, {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setCard((c) => ({ id: c.id + 1, text: getRandom(mode, level, lang, c.text) }));
        x.set(0);
        swipeLockedRef.current = false;
        setIsSwiping(false);
      },
    });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) advance(1);
    else if (info.offset.x < -SWIPE_THRESHOLD) advance(-1);
    else animate(x, 0, { type: "spring", stiffness: 520, damping: 34 });
  };

  const accent = level === "spicy" ? "bg-gradient-spicy" : "bg-gradient-primary";

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <div className="text-center">
        <h2 className="font-display text-2xl text-foreground">{meta.title}</h2>
      </div>

      <div className="relative w-full aspect-[3/4]">
        {/* Peek card underneath */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-card shadow-card border border-white/80 scale-95 opacity-70" />

        <motion.div
          key={card.id}
          drag={isSwiping ? false : "x"}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={1}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ x, rotate, touchAction: "none" }}
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="absolute inset-0 rounded-[2rem] bg-gradient-card shadow-card border border-white/80 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} />

          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 px-3 py-1 rounded-full border-2 border-primary text-primary font-display text-sm tracking-widest uppercase rotate-[-12deg] pointer-events-none"
          >
            {t.like}
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 px-3 py-1 rounded-full border-2 border-muted-foreground text-muted-foreground font-display text-sm tracking-widest uppercase rotate-[12deg] pointer-events-none"
          >
            {t.skip}
          </motion.div>

          <p className="font-display text-2xl md:text-3xl leading-snug text-foreground text-balance text-center px-8 select-none">
            {card.text}
          </p>
          <div className="absolute bottom-5 right-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            {t.levels[level]}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-8" dir="ltr">
        <button
          onClick={() => advance(-1)}
          disabled={isSwiping}
          aria-label={t.skip}
          className="w-16 h-16 rounded-full bg-white/80 backdrop-blur border border-white shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition disabled:pointer-events-none disabled:opacity-60"
        >
          <X className="w-7 h-7" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => advance(1)}
          disabled={isSwiping}
          aria-label={t.like}
          className="w-16 h-16 rounded-full bg-gradient-primary shadow-card flex items-center justify-center text-primary-foreground hover:-translate-y-0.5 transition disabled:pointer-events-none disabled:opacity-60"
        >
          <Heart className="w-7 h-7" fill="currentColor" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground/70 text-center">{t.swipeHint}</p>
    </div>
  );
};
