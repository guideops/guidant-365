-- job-files bucket (private, signed URLs required)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-files',
  'job-files',
  false,
  52428800,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf','image/tiff']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "upload to job-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'job-files');

CREATE POLICY "read own job-files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'job-files' AND owner_id::text = auth.uid()::text);

CREATE POLICY "delete own job-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'job-files' AND owner_id::text = auth.uid()::text);
