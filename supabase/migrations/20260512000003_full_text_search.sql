-- Full-text search for jobs
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(title, '') || ' ' ||
        coalesce(notes, '') || ' ' ||
        coalesce(next_action, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_jobs_fts ON public.jobs USING GIN (fts);

-- Full-text search for customers
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(email, '') || ' ' ||
        coalesce(notes, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_customers_fts ON public.customers USING GIN (fts);
