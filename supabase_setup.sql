-- Create users table (linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- STORAGE BUCKET INSTRUCTIONS:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create a new bucket named "notes-files"
-- 3. Set the bucket to "Public" (or add appropriate RLS policies)
-- 4. Add a policy to allow authenticated users to upload files:
--    - Policy Name: "Allow authenticated uploads"
--    - Allowed Operations: INSERT
--    - Target Role: authenticated
--    - Definition: (bucket_id = 'notes-files')

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow system to insert profiles" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for notes table
CREATE POLICY "Anyone can view notes" ON notes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Insert some sample data
INSERT INTO notes (title, subject, course, pdf_url, is_free) VALUES
('Pharmaceutics I - Introduction', 'Pharmaceutics', 'B.Pharma 1st Sem', 'https://example.com/note1.pdf', true),
('Human Anatomy & Physiology', 'HAP', 'B.Pharma 1st Sem', 'https://example.com/note2.pdf', true),
('Organic Chemistry II - Advanced', 'Chemistry', 'B.Pharma 3rd Sem', 'https://example.com/note3.pdf', false);
