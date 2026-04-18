
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  mode text NOT NULL DEFAULT 'questions',
  level text NOT NULL DEFAULT 'sweet',
  current_prompt text,
  current_turn text NOT NULL DEFAULT 'player1',
  player1_id text,
  player2_id text,
  shown_prompts jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_code ON public.rooms(code);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Casual game with no auth: anyone who knows the room code can read/write.
CREATE POLICY "Anyone can read rooms"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update rooms"
  ON public.rooms FOR UPDATE
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
