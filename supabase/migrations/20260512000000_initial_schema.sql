-- ENUMS
CREATE TYPE public.job_status AS ENUM (
  'inquiry','quote_tosend','quote_sent','agreed','rejected',
  'negotiation','planned_start','in_progress','awaiting_payment','archived'
);
CREATE TYPE public.job_priority AS ENUM ('high','medium','low');
CREATE TYPE public.timeline_type AS ENUM ('status_change','email','file','note','call');
CREATE TYPE public.recurrence_interval AS ENUM ('weekly','monthly','yearly');
CREATE TYPE public.approval_type AS ENUM ('document','email');
CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected','edited');
CREATE TYPE public.file_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.invoice_status AS ENUM ('sent','paid','overdue');
CREATE TYPE public.email_scope AS ENUM ('read','draft');

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 text        NOT NULL,
  privacy_email_scope   email_scope NOT NULL DEFAULT 'draft',
  gmail_access_token    text,
  gmail_refresh_token   text,
  onboarding_complete   boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- customers
CREATE TABLE IF NOT EXISTS public.customers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  email      text,
  phone      text,
  address    text,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id uuid         REFERENCES public.customers(id) ON DELETE SET NULL,
  title       text         NOT NULL,
  status      job_status   NOT NULL DEFAULT 'inquiry',
  next_action text,
  next_due    date,
  priority    job_priority NOT NULL DEFAULT 'medium',
  start_date  date,
  end_date    date,
  notes       text,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now()
);

-- job_files
CREATE TABLE IF NOT EXISTS public.job_files (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id         uuid        NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  filename       text        NOT NULL,
  filepath       text        NOT NULL,
  extracted_data jsonb,
  ai_confidence  float,
  status         file_status NOT NULL DEFAULT 'pending',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id          uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid           NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  amount      decimal(10,2)  NOT NULL,
  due_date    date,
  paid_amount decimal(10,2)  NOT NULL DEFAULT 0,
  status      invoice_status NOT NULL DEFAULT 'sent',
  file_id     uuid           REFERENCES public.job_files(id) ON DELETE SET NULL,
  created_at  timestamptz    NOT NULL DEFAULT now()
);

-- job_timeline
CREATE TABLE IF NOT EXISTS public.job_timeline (
  id         uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     uuid          NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  type       timeline_type NOT NULL DEFAULT 'note',
  content    text          NOT NULL,
  created_at timestamptz   NOT NULL DEFAULT now()
);

-- recurring
CREATE TABLE IF NOT EXISTS public.recurring (
  id         uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid                NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text                NOT NULL,
  amount     decimal(10,2),
  recurrence recurrence_interval NOT NULL DEFAULT 'monthly',
  next_date  date                NOT NULL,
  created_at timestamptz         NOT NULL DEFAULT now()
);

-- tags
CREATE TABLE IF NOT EXISTS public.tags (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name    text NOT NULL,
  UNIQUE (user_id, name)
);

-- job_tags (junction)
CREATE TABLE IF NOT EXISTS public.job_tags (
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

-- audit_log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text        NOT NULL,
  record_id  uuid        NOT NULL,
  user_id    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  action     text        NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- approval_queue
CREATE TABLE IF NOT EXISTS public.approval_queue (
  id               uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type             approval_type   NOT NULL,
  source_data      jsonb           NOT NULL DEFAULT '{}',
  suggested_update jsonb           NOT NULL DEFAULT '{}',
  status           approval_status NOT NULL DEFAULT 'pending',
  created_at       timestamptz     NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_user_status    ON public.jobs (user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_next_due        ON public.jobs (user_id, next_due) WHERE next_due IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_customer        ON public.jobs (customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_user       ON public.customers (user_id);
CREATE INDEX IF NOT EXISTS idx_job_files_job        ON public.job_files (job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job         ON public.invoices (job_id);
CREATE INDEX IF NOT EXISTS idx_job_timeline_job     ON public.job_timeline (job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_user       ON public.recurring (user_id, next_date);
CREATE INDEX IF NOT EXISTS idx_approval_queue_user  ON public.approval_queue (user_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_log_record     ON public.audit_log (table_name, record_id, created_at DESC);

-- updated_at auto-trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
