-- Advertise Requests Table
CREATE TABLE IF NOT EXISTS public.advertise_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name text NOT NULL,
  organization text NOT NULL,
  email text NOT NULL,
  package_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.advertise_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert advertise requests"
  ON public.advertise_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.advertise_requests TO anon, authenticated;
