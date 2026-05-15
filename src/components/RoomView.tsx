import { useState } from "react";
import { Level, Mode, getModeMeta } from "@/data/prompts";
import { Room, shuffleRoomPrompt, updateRoomModeLevel, getPlayerId } from "@/hooks/useRoom";
import { useLang } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LevelToggle } from "@/components/LevelToggle";
import { ArrowLeft, Shuffle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const RoomView = ({ room, onLeave }: { room: Room; onLeave: () => void }) => {
  const { lang, t } = useLang();
  const [copied, setCopied] = useState(false);
  const me = getPlayerId();
  const myRole: "player1" | "player2" =
    me === room.player1_id ? "player1" : me === room.player2_id ? "player2" : "player1";
  const isMyTurn = room.current_turn === myRole;
  const partnerJoined = !!room.player1_id && !!room.player2_id;

  const meta = getModeMeta(room.mode, lang);
  const accent = room.level === "spicy" ? "bg-gradient-spicy" : "bg-gradient-primary";

  const copyCode = async () => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    toast.success(t.codeCopied);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShuffle = async () => {
    try { await shuffleRoomPrompt(room, lang); } catch { toast.error(t.cantShuffle); }
  };

  const handleModeChange = async (mode: Mode) => {
    await updateRoomModeLevel(room, mode, room.level, lang);
  };
  const handleLevelChange = async (level: Level) => {
    await updateRoomModeLevel(room, room.mode, level, lang);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5">
      <div className="w-full flex items-center justify-between">
        <button onClick={onLeave} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> {t.leave}
        </button>
        <button onClick={copyCode} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-soft text-sm font-mono tracking-[0.3em]" dir="ltr">
          {room.code}
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!partnerJoined && (
        <div className="w-full text-center text-sm text-muted-foreground bg-white/50 rounded-2xl px-4 py-3 border border-white/80">
          {t.shareCode} <span className="font-mono font-semibold text-foreground" dir="ltr">{room.code}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {(["questions", "dares", "wyr", "activities"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition ${
              room.mode === m ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-white/60 text-muted-foreground hover:text-foreground border border-white/80"
            }`}
          >
            {getModeMeta(m, lang).title}
          </button>
        ))}
      </div>

      <LevelToggle value={room.level} onChange={handleLevelChange} />

      <div className="text-center">
        <h2 className="font-display text-xl text-foreground">{meta.title}</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {isMyTurn ? t.yourTurn : t.partnerTurn}
        </p>
      </div>

      <div key={room.current_prompt ?? "empty"} className="animate-flip-in w-full aspect-[3/4] rounded-[2rem] bg-gradient-card shadow-card border border-white/80 relative overflow-hidden flex items-center justify-center">
        <div className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} />
        <p className="font-display text-2xl md:text-3xl leading-snug text-foreground text-balance text-center px-8">
          {room.current_prompt ?? "…"}
        </p>
        <div className="absolute bottom-5 right-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          {t.levels[room.level]}
        </div>
      </div>

      <Button onClick={handleShuffle} disabled={!isMyTurn} size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-full px-8 shadow-soft disabled:opacity-50">
        <Shuffle className="w-4 h-4 mr-2" />
        {isMyTurn ? t.sendNext : t.waitingPartner}
      </Button>
    </div>
  );
};
