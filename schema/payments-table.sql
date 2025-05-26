-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_intent_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);

-- Create index on payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS payments_payment_intent_id_idx ON payments(payment_intent_id);

-- Add RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own payments
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own payments
CREATE POLICY "Users can insert their own payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for service role to manage all payments
CREATE POLICY "Service role can manage all payments"
  ON payments
  USING (auth.jwt() ->> 'role' = 'service_role');
