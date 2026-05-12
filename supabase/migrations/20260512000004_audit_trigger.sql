-- Audit trigger function — SECURITY DEFINER bypasses RLS to always write audit rows
CREATE OR REPLACE FUNCTION public.audit_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.audit_log (table_name, record_id, user_id, action, old_values, new_values)
  VALUES (
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    auth.uid(),
    TG_OP,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
  );
  RETURN NULL;
END;
$$;

CREATE TRIGGER audit_jobs
  AFTER INSERT OR UPDATE OR DELETE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.audit_change();

CREATE TRIGGER audit_invoices
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.audit_change();

CREATE TRIGGER audit_job_files
  AFTER INSERT OR UPDATE OR DELETE ON public.job_files
  FOR EACH ROW EXECUTE FUNCTION public.audit_change();

CREATE TRIGGER audit_approval_queue
  AFTER INSERT OR UPDATE OR DELETE ON public.approval_queue
  FOR EACH ROW EXECUTE FUNCTION public.audit_change();
