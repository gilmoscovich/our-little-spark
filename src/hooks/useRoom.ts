import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lang, Level, Mode, getRandom } from "@/data/prompts";

export type Room = {
  id: string;
  code: string;
  mode: Mode;
  level: Level;
  current_prompt: string | null;
  current_turn: "player1" | "player2";
  player1_id: string | null;
  player2_id: string | null;
  shown_prompts: Record<string, string[]>;
};

const PLAYER_KEY = "closer-player-id";

export const getPlayerId = (): string => {
  let id = localStorage.getItem(PLAYER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_KEY, id);
  }
  return id;
};

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const createRoom = async (mode: Mode, level: Level, lang: Lang = "en") => {
  const code = generateCode();
  const playerId = getPlayerId();
  const firstPrompt = getRandom(mode, level, lang);
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      code,
      mode,
      level,
      player1_id: playerId,
      current_prompt: firstPrompt,
      current_turn: "player2",
      shown_prompts: { [`${lang}:${mode}:${level}`]: [firstPrompt] },
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Room;
};

export const joinRoom = async (code: string) => {
  const upper = code.trim().toUpperCase();
  const playerId = getPlayerId();
  const { data: existing, error: fetchErr } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", upper)
    .maybeSingle();
  if (fetchErr) throw fetchErr;
  if (!existing) throw new Error("Room not found");

  // Claim a slot if not already in it
  if (existing.player1_id === playerId || existing.player2_id === playerId) {
    return existing as unknown as Room;
  }
  const update: Partial<Room> = {};
  if (!existing.player1_id) update.player1_id = playerId;
  else if (!existing.player2_id) update.player2_id = playerId;
  else throw new Error("Room is full");

  const { data, error } = await supabase
    .from("rooms")
    .update(update)
    .eq("id", existing.id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Room;
};

export const useRoom = (roomId: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!roomId) return;
    let active = true;

    const load = async () => {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .maybeSingle();
      if (active && data) setRoom(data as unknown as Room);
    };
    load();

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setRoom(payload.new as unknown as Room);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return room;
};

export const shuffleRoomPrompt = async (room: Room, lang: Lang = "en") => {
  const k = `${lang}:${room.mode}:${room.level}`;
  const shown = room.shown_prompts?.[k] ?? [];
  const next = getRandom(room.mode, room.level, lang, room.current_prompt ?? undefined);
  const newShown = shown.includes(next) ? shown : [...shown, next];
  const myId = getPlayerId();
  const nextTurn: "player1" | "player2" = myId === room.player1_id ? "player2" : "player1";

  await supabase
    .from("rooms")
    .update({
      current_prompt: next,
      current_turn: nextTurn,
      shown_prompts: { ...room.shown_prompts, [k]: newShown },
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
};

export const updateRoomModeLevel = async (room: Room, mode: Mode, level: Level, lang: Lang = "en") => {
  const next = getRandom(mode, level, lang);
  const k = `${lang}:${mode}:${level}`;
  const shown = room.shown_prompts?.[k] ?? [];
  await supabase
    .from("rooms")
    .update({
      mode,
      level,
      current_prompt: next,
      shown_prompts: { ...room.shown_prompts, [k]: [...shown, next] },
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
};
