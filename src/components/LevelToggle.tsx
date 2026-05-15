import { Level } from "@/data/prompts";
import { useLang } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export const LevelToggle = ({
  value,
  onChange,
}: {
  value: Level;
  onChange: (l: Level) => void;
}) => {
  const { t } = useLang();
  const levels: { id: Level; label: string }[] = [
    { id: "sweet", label: t.levels.sweet },
    { id: "flirty", label: t.levels.flirty },
    { id: "spicy", label: t.levels.spicy },
  ];
  return (
    <div className="inline-flex rounded-full bg-white/60 backdrop-blur-md p-1.5 shadow-soft border border-white/80">
      {levels.map((l) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300",
            value === l.id
              ? l.id === "spicy"
                ? "bg-gradient-spicy text-primary-foreground shadow-soft"
                : "bg-gradient-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
