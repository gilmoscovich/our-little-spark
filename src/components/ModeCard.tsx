import { Mode, getModeMeta } from "@/data/prompts";
import { useLang } from "@/i18n/LanguageContext";

export const ModeCard = ({
  mode,
  onClick,
}: {
  mode: Mode;
  onClick: () => void;
}) => {
  const { lang } = useLang();
  const meta = getModeMeta(mode, lang);
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-white/80 p-7 text-left shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-primary opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700" />
      <div className="relative">
        <div className="w-10 h-1 rounded-full bg-gradient-primary mb-4 group-hover:w-16 transition-all duration-500" />
        <h3 className="font-display text-2xl font-semibold text-foreground mb-1 text-center">
          {meta.title}
        </h3>
        <p className="text-sm text-muted-foreground text-center">{meta.subtitle}</p>
      </div>
    </button>
  );
};
