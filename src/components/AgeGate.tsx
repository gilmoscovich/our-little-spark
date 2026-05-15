import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";

export const AgeGate = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { t } = useLang();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/40 backdrop-blur-md animate-flip-in">
      <div className="max-w-sm w-full rounded-3xl bg-gradient-card p-8 shadow-card border border-white/80 text-center">
        <div className="w-12 h-1 mx-auto mb-5 rounded-full bg-gradient-spicy" />
        <h3 className="font-display text-2xl mb-2">{t.spicyTitle}</h3>
        <p className="text-sm text-muted-foreground mb-6">{t.spicyBody}</p>
        <div className="flex flex-col gap-2">
          <Button onClick={onConfirm} className="bg-gradient-spicy text-primary-foreground rounded-full">
            {t.spicyConfirm}
          </Button>
          <Button variant="ghost" onClick={onCancel} className="rounded-full">
            {t.spicyCancel}
          </Button>
        </div>
      </div>
    </div>
  );
};
