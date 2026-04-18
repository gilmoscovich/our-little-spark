import { Button } from "@/components/ui/button";

export const AgeGate = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/40 backdrop-blur-md animate-flip-in">
      <div className="max-w-sm w-full rounded-3xl bg-gradient-card p-8 shadow-card border border-white/80 text-center">
        <div className="text-5xl mb-3">🔥</div>
        <h3 className="font-display text-2xl mb-2">Spicy Mode</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Spicy content includes intimate prompts intended for consenting adults
          18+. Both partners should be comfortable. You can always skip a card.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConfirm}
            className="bg-gradient-spicy text-primary-foreground rounded-full"
          >
            We're 18+ and ready
          </Button>
          <Button variant="ghost" onClick={onCancel} className="rounded-full">
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
};
