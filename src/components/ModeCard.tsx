import { Mode, MODE_META } from "@/data/prompts";

export const ModeCard = ({
  mode,
  onClick,
}: {
  mode: Mode;
  onClick: () => void;
}) => {
  const meta = MODE_META[mode];
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-white/80 p-6 text-left shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-primary opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700" />
      <div className="relative">
        <div className="text-4xl mb-3 group-hover:scale-110 inline-block transition-transform duration-300">
          {meta.emoji}
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
          {meta.title}
        </h3>
        <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
      </div>
    </button>
  );
};
