import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Level, Mode, getModeMeta } from "@/data/prompts";
import { LevelToggle } from "@/components/LevelToggle";
import { createRoom, joinRoom, Room } from "@/hooks/useRoom";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const MultiplayerLobby = ({
  onJoined,
  onBack,
}: {
  onJoined: (room: Room) => void;
  onBack: () => void;
}) => {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [mode, setMode] = useState<Mode>("questions");
  const [level, setLevel] = useState<Level>("sweet");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const room = await createRoom(mode, level, lang);
      onJoined(room);
    } catch {
      toast.error(t.cantCreate);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (code.trim().length !== 4) {
      toast.error(t.codeMustBe4);
      return;
    }
    setLoading(true);
    try {
      const room = await joinRoom(code);
      onJoined(room);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t.cantJoin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <button onClick={onBack} className="self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <div className="text-center">
        <h2 className="font-display text-3xl text-foreground mb-1">{t.playTogether}</h2>
        <p className="text-sm text-muted-foreground">{t.twoPhones}</p>
      </div>

      <div className="inline-flex rounded-full bg-white/60 backdrop-blur-md p-1.5 shadow-soft border border-white/80">
        {(["create", "join"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              tab === tb ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tb === "create" ? t.createRoom : t.joinRoom}
          </button>
        ))}
      </div>

      <div className="w-full bg-gradient-card border border-white/80 rounded-3xl p-6 shadow-soft flex flex-col gap-5">
        {tab === "create" ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 text-center">{t.chooseMode}</p>
              <div className="grid grid-cols-2 gap-2">
                {(["questions", "dares", "wyr", "activities"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2.5 rounded-2xl text-sm transition ${
                      mode === m ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-white/60 text-muted-foreground hover:text-foreground border border-white/80"
                    }`}
                  >
                    {getModeMeta(m, lang).title}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <LevelToggle value={level} onChange={setLevel} />
            </div>
            <Button onClick={handleCreate} disabled={loading} size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-full shadow-soft">
              {loading ? t.creating : t.createRoom}
            </Button>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 text-center">{t.enterCode}</p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="ABCD"
                className="text-center font-mono tracking-[0.5em] text-2xl h-14 rounded-2xl bg-white/80"
                dir="ltr"
              />
            </div>
            <Button onClick={handleJoin} disabled={loading} size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-full shadow-soft">
              {loading ? t.joining : t.joinRoom}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
