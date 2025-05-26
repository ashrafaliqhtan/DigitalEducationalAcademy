-- Add invoice fields to payments table
ALTER TABLE payments 
ADD COLUMN invoice_number VARCHAR(255),
ADD COLUMN invoice_url TEXT;

-- Create storage bucket for invoices if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'documents', 'documents', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'documents'
);

-- Set up storage policy for documents bucket
CREATE POLICY "Allow authenticated users to read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Allow authenticated users to upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
