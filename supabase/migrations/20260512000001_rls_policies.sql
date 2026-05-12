-- Enable RLS on all tables
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_files       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_timeline    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_queue  ENABLE ROW LEVEL SECURITY;

-- Direct ownership policies
CREATE POLICY "own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "own customers"
  ON public.customers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own jobs"
  ON public.jobs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own recurring"
  ON public.recurring FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own tags"
  ON public.tags FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own approvals"
  ON public.approval_queue FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "read own audit log"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- Inherited via job ownership
CREATE POLICY "own job_files"
  ON public.job_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_files.job_id AND j.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_files.job_id AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "own invoices"
  ON public.invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = invoices.job_id AND j.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = invoices.job_id AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "own timeline"
  ON public.job_timeline FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_timeline.job_id AND j.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_timeline.job_id AND j.user_id = auth.uid()
    )
  );

-- job_tags via tag ownership
CREATE POLICY "own job_tags"
  ON public.job_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tags t
      WHERE t.id = job_tags.tag_id AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tags t
      WHERE t.id = job_tags.tag_id AND t.user_id = auth.uid()
    )
  );
