-- Profiles RLS policies
CREATE POLICY "Allow users to view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Conversations RLS policies
CREATE POLICY "Allow users to view own conversations" 
  ON public.conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create own conversations" 
  ON public.conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own conversations" 
  ON public.conversations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own conversations" 
  ON public.conversations FOR DELETE 
  USING (auth.uid() = user_id);

-- Messages RLS policies
CREATE POLICY "Allow users to view own messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create own messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own messages" 
  ON public.messages FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own messages" 
  ON public.messages FOR DELETE 
  USING (auth.uid() = user_id);

-- Persona Memory RLS policies
CREATE POLICY "Allow users to view own persona memory" 
  ON public.persona_memory FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create own persona memory" 
  ON public.persona_memory FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own persona memory" 
  ON public.persona_memory FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own persona memory" 
  ON public.persona_memory FOR DELETE 
  USING (auth.uid() = user_id);
