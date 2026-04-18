import { Level } from "@/data/prompts";
import { cn } from "@/lib/utils";

const levels: { id: Level; label: string; emoji: string }[] = [
  { id: "sweet", label: "Sweet", emoji: "🌸" },
  { id: "flirty", label: "Flirty", emoji: "💋" },
  { id: "spicy", label: "Spicy", emoji: "🔥" },
];

export const LevelToggle = ({
  value,
  onChange,
}: {
  value: Level;
  onChange: (l: Level) => void;
}) => {
  return (
    <div className="inline-flex rounded-full bg-white/60 backdrop-blur-md p-1.5 shadow-soft border border-white/80">
      {levels.map((l) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            value === l.id
              ? l.id === "spicy"
                ? "bg-gradient-spicy text-primary-foreground shadow-soft"
                : "bg-gradient-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="mr-1.5">{l.emoji}</span>
          {l.label}
        </button>
      ))}
    </div>
  );
};
