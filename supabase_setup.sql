-- =============================================
-- NOTESDRIVE - COMPLETE SUPABASE SCHEMA & SEED
-- =============================================

-- Safe Alterations for Existing Databases
-- 1. Alter profiles check constraint to allow semesters 1 to 12
alter table public.profiles drop constraint if exists profiles_semester_check;
alter table public.profiles add constraint profiles_semester_check check (semester between 1 and 12);

-- 2. Alter subjects check constraint and add stream/branch categorization columns
alter table public.subjects drop constraint if exists subjects_semester_check;
alter table public.subjects add constraint subjects_semester_check check (semester between 1 and 12);
alter table public.subjects add column if not exists category text;
alter table public.subjects add column if not exists branch text;

-- 3. Alter notes check constraint and add category/branch columns
alter table public.notes drop constraint if exists notes_semester_check;
alter table public.notes add constraint notes_semester_check check (semester between 1 and 12);
alter table public.notes add column if not exists category text;
alter table public.notes add column if not exists branch text;
alter table public.notes add column if not exists status text default 'pending';

-- =============================================

-- 1. USERS TABLE (Supabase auth ke saath sync)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  premium_activated_at timestamptz,
  premium_expires_at timestamptz, -- null = lifetime
  college text,
  semester int check (semester between 1 and 12),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger security check to avoid duplicates
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================

-- 2. SUBJECTS TABLE (Multi-disciplinary categorization)
create table if not exists public.subjects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique, -- e.g., "BP101T", "CS301"
  semester int not null check (semester between 1 and 12),
  category text, -- e.g., 'btech', 'bpharma', 'jee', 'neet', 'medical', 'ebooks'
  branch text, -- e.g., 'cse', 'ece', 'General', 'Physics', 'Biology', 'mbbs'
  description text,
  thumbnail_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =============================================

-- 3. NOTES TABLE (Supports sellable e-books & free handouts)
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  subject_id uuid references public.subjects(id) on delete cascade,
  semester int not null check (semester between 1 and 12),
  unit int check (unit between 1 and 5), -- Unit 1-5
  file_url text not null, -- Supabase Storage URL / Google Drive link
  file_size_mb float,
  file_type text default 'pdf', -- pdf, pptx, docx
  thumbnail_url text,
  is_premium boolean default false, -- false = free, true = premium only
  is_active boolean default true,
  download_count int default 0,
  view_count int default 0,
  tags text[], -- e.g., ['pharmacology', 'important', 'handwritten']
  uploaded_by uuid references public.profiles(id),
  price numeric(10,2) default 0.00,
  category text, -- e.g., 'btech', 'bpharma', 'jee', 'neet', 'ebooks', 'medical'
  branch text, -- e.g., 'cse', 'ece', 'General', 'Physics', 'Biology', 'mbbs'
  status text default 'pending', -- 'pending' or 'approved'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================

-- 4. PAYMENTS TABLE (Cashfree orders)
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  cashfree_order_id text unique not null,
  cashfree_payment_id text unique,
  amount numeric(10,2) not null default 499.00,
  currency text default 'INR',
  status text default 'PENDING' 
    check (status in ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED')),
  plan text default 'LIFETIME_PREMIUM',
  payment_method text, -- UPI, Card, NetBanking
  webhook_verified boolean default false,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- =============================================

-- 5. DOWNLOADS TABLE (track downloads)
create table if not exists public.downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  downloaded_at timestamptz default now(),
  unique(user_id, note_id)
);

-- =============================================

-- 6. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, note_id)
);

-- =============================================

-- 6.5. COUPONS TABLE
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount numeric(10,2) not null,
  type text not null check (type in ('percent', 'flat')),
  max_uses int not null default 100,
  used_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- =============================================

-- 6.8. INDIVIDUAL EBOOK PURCHASES TABLE
create table if not exists public.ebook_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  note_id uuid references public.notes(id) on delete cascade not null,
  cashfree_order_id text unique,
  amount numeric(10,2) not null,
  status text default 'SUCCESS' check (status in ('PENDING', 'SUCCESS', 'FAILED')),
  created_at timestamptz default now(),
  unique(user_id, note_id)
);

-- =============================================

-- 7. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.payments enable row level security;
alter table public.downloads enable row level security;
alter table public.bookmarks enable row level security;
alter table public.subjects enable row level security;
alter table public.coupons enable row level security;
alter table public.ebook_purchases enable row level security;

-- Purchases policies
drop policy if exists "Users see own purchases" on public.ebook_purchases;
create policy "Users see own purchases"
  on public.ebook_purchases for select using (auth.uid() = user_id);

drop policy if exists "Admins see all purchases" on public.ebook_purchases;
create policy "Admins see all purchases"
  on public.ebook_purchases for all using (
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (
    auth.uid() = id or 
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (
    auth.uid() = id or 
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

-- Notes policies
drop policy if exists "Free notes visible to all" on public.notes;
create policy "Free notes visible to all"
  on public.notes for select
  using (
    is_active = true and (
      (price = 0.00 and is_premium = false) or
      uploaded_by = auth.uid() or
      exists (
        select 1 from public.profiles
        where id = auth.uid() and is_premium = true
      ) or
      exists (
        select 1 from public.ebook_purchases p
        where p.user_id = auth.uid() and p.note_id = id and p.status = 'SUCCESS'
      )
    )
  );

drop policy if exists "Admins manage notes" on public.notes;
create policy "Admins manage notes"
  on public.notes for all using (
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

-- Payments policies
drop policy if exists "Users see own payments" on public.payments;
create policy "Users see own payments"
  on public.payments for select using (auth.uid() = user_id);

drop policy if exists "Users insert own payments" on public.payments;
create policy "Users insert own payments"
  on public.payments for insert with check (auth.uid() = user_id);

-- Subjects policies
drop policy if exists "Subjects visible to all" on public.subjects;
create policy "Subjects visible to all"
  on public.subjects for select using (is_active = true);

drop policy if exists "Admins manage subjects" on public.subjects;
create policy "Admins manage subjects"
  on public.subjects for all using (
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

-- Coupons policies
drop policy if exists "Coupons visible to all" on public.coupons;
create policy "Coupons visible to all"
  on public.coupons for select using (true);

drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Admins manage coupons"
  on public.coupons for all using (
    (auth.jwt() ->> 'email') in (
      'notesdriveshop@gmail.com',
      'shreyash20006@gmail.com',
      'argala28@icloud.com',
      'sb108750@gmail.com'
    )
  );

-- Downloads & Bookmarks policies
drop policy if exists "Users manage own downloads" on public.downloads;
create policy "Users manage own downloads"
  on public.downloads for all using (auth.uid() = user_id);

drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
  on public.bookmarks for all using (auth.uid() = user_id);

-- =============================================

-- 8. COMPREHENSIVE SUBJECT DATA SEED (B.Tech, JEE/NEET, B.Pharma, Medical Hub)
insert into public.subjects (name, code, semester, category, branch, description) values
  -- ==========================================
  -- B.PHARMA SYLLABUS SUBJECTS
  -- ==========================================
  ('Human Anatomy & Physiology I', 'BP101T', 1, 'bpharma', 'General', 'Introduction to the structure and functional aspects of human systems.'),
  ('Pharmaceutical Analysis I', 'BP102T', 1, 'bpharma', 'General', 'Principles and procedures of volumetric and electrochemical analysis.'),
  ('Pharmaceutics I', 'BP103T', 1, 'bpharma', 'General', 'Basic concepts of formulation development, history, and dosage forms.'),
  ('Pharmaceutical Inorganic Chemistry', 'BP104T', 1, 'bpharma', 'General', 'Study of inorganic compounds used in pharmacy and clinical applications.'),
  ('Human Anatomy & Physiology II', 'BP201T', 2, 'bpharma', 'General', 'Advanced systems of human anatomy and physiological controllers.'),
  ('Pharmaceutical Organic Chemistry I', 'BP202T', 2, 'bpharma', 'General', 'Fundamentals of classification, nomenclature, and properties of organic chemicals.'),
  ('Biochemistry', 'BP203T', 2, 'bpharma', 'General', 'Catalysis, metabolic path flows, biomolecules, and chemical foundations.'),
  ('Pathophysiology', 'BP204T', 2, 'bpharma', 'General', 'Mechanism of cellular injury and diseases affecting standard organ systems.'),
  ('Pharmaceutical Organic Chemistry II', 'BP301T', 3, 'bpharma', 'General', 'Structure, reactions, and properties of benzene, phenols, and aromatic derivatives.'),
  ('Physical Pharmaceutics I', 'BP302T', 3, 'bpharma', 'General', 'Physicochemical properties of states of matter, solubility, and liquid crystals.'),
  ('Pharmaceutical Microbiology', 'BP303T', 3, 'bpharma', 'General', 'Microbiology classification, staining, sterilization, and immunology.'),
  ('Pharmaceutical Engineering', 'BP304T', 3, 'bpharma', 'General', 'Unit operations in pharmaceutical manufacturing including heat, fluid flow, and drying.'),
  ('Pharmaceutical Organic Chemistry III', 'BP401T', 4, 'bpharma', 'General', 'Stereochemistry, heterocyclic compounds, and synthesis routes.'),
  ('Physical Pharmaceutics II', 'BP402T', 4, 'bpharma', 'General', 'Micromeritics, rheology, chemical kinetics, and coarse dispersions.'),
  ('Pharmacology I', 'BP403T', 4, 'bpharma', 'General', 'General principles of drugs, pharmacokinetics, and nervous system agents.'),
  ('Pharmacognosy & Phytochemistry I', 'BP404T', 4, 'bpharma', 'General', 'Introduction to crude drugs, cultivation, and secondary metabolites.'),
  ('Medicinal Chemistry II', 'BP501T', 5, 'bpharma', 'General', 'Chemistry and drug structure-activity relationships for cardiovascular and endocrine systems.'),
  ('Industrial Pharmacy I', 'BP502T', 5, 'bpharma', 'General', 'Formulation of tablets, capsules, liquids, and cosmetic preparations.'),
  ('Pharmacology II', 'BP503T', 5, 'bpharma', 'General', 'Pharmacology of cardiovascular, hematological, and renal systems.'),
  ('Pharmacognosy & Phytochemistry II', 'BP504T', 5, 'bpharma', 'General', 'Extraction, isolation, and analysis of natural glycosides, alkaloids, and resins.'),
  ('Medicinal Chemistry III', 'BP601T', 6, 'bpharma', 'General', 'Antibiotics, anti-tubercular agents, antiprotozoal structures, and chemotherapy.'),
  ('Pharmacology III', 'BP602T', 6, 'bpharma', 'General', 'Toxicology, autacoids, respiratory system drugs, and chemotherapy protocols.'),
  ('Herbal Drug Technology', 'BP603T', 6, 'bpharma', 'General', 'Herbal formulations, raw material standardization, and natural cosmetics.'),
  ('Biopharmaceutics & Pharmacokinetics', 'BP604T', 6, 'bpharma', 'General', 'Bioavailability, absorption, volume of distribution, and compartment modeling.'),
  ('Pharmaceutical Biotechnology', 'BP605T', 6, 'bpharma', 'General', 'Immunology, genetics, protein engineering, and enzyme immobilization.'),
  ('Quality Assurance', 'BP606T', 6, 'bpharma', 'General', 'GMP, QA protocols, validation, calibration, and quality control parameters.'),
  ('Instrumental Methods of Analysis', 'BP701T', 7, 'bpharma', 'General', 'UV, IR, NMR spectroscopy, chromatography (HPLC, GC) and mass spectrometry.'),
  ('Industrial Pharmacy II', 'BP702T', 7, 'bpharma', 'General', 'Technology transfer, scale-up, and regulatory requirements.'),
  ('Pharmacy Practice', 'BP703T', 7, 'bpharma', 'General', 'Clinical pharmacy, hospital drug catalogs, therapeutic drug monitoring, and patient counseling.'),
  ('Novel Drug Delivery System', 'BP704T', 7, 'bpharma', 'General', 'Sustained release, micro-encapsulation, transdermal, and targeted drug carriers.'),
  ('Biostatistics & Research Methodology', 'BP801T', 8, 'bpharma', 'General', 'Statistical operations, parametric tests, ANOVA, and research design.'),
  ('Social & Preventive Pharmacy', 'BP802T', 8, 'bpharma', 'General', 'Public health policies, disease control programs, and preventive healthcare.'),

  -- ==========================================
  -- B.TECH ENGINEERING SYLLABUS SUBJECTS
  -- ==========================================
  -- Common First Year
  ('Engineering Mathematics I', 'MA101', 1, 'btech', 'common_first_year', 'Calculus, matrices, and differential equations.'),
  ('Engineering Physics', 'PH101', 1, 'btech', 'common_first_year', 'Wave optics, electromagnetism, and classical/quantum physics.'),
  ('Basic Electrical Engineering', 'EE101', 1, 'btech', 'common_first_year', 'DC/AC networks, magnetic circuits, and basic machinery.'),
  ('Engineering Mechanics', 'ME101', 1, 'btech', 'common_first_year', 'Statics and dynamics of structures and systems.'),
  ('Programming in C', 'CS101', 1, 'btech', 'common_first_year', 'C syntax, problem-solving, arrays, pointers, and structures.'),
  ('Workshop Practice', 'WP101', 1, 'btech', 'common_first_year', 'Carpentry, fitting, smithy, and mechanical operations.'),
  ('Engineering Mathematics II', 'MA102', 2, 'btech', 'common_first_year', 'Vector calculus, complex analysis, and Laplace transforms.'),
  ('Engineering Chemistry', 'CH102', 2, 'btech', 'common_first_year', 'Water treatment, organic reactions, batteries, and fuels.'),
  ('Basic Electronics', 'EC102', 2, 'btech', 'common_first_year', 'Diodes, BJTs, op-amps, and digital logic bases.'),
  ('Engineering Graphics & Drawing', 'ME102', 2, 'btech', 'common_first_year', 'Orthographic and isometric projections, CAD drawing conventions.'),
  ('Data Structures', 'CS102', 2, 'btech', 'common_first_year', 'Linked lists, stacks, queues, trees, graphs, and searching algorithms.'),
  ('Environmental Studies', 'EV102', 2, 'btech', 'common_first_year', 'Eco-systems, natural resources, pollution, and global warming.'),

  -- Computer Science & Engineering (CSE)
  ('Discrete Mathematics', 'CS301', 3, 'btech', 'cse', 'Sets, logic, graph theory, combinatorics, and algebraic structures.'),
  ('Data Structures & Algorithms', 'CS302', 3, 'btech', 'cse', 'Trees, hashing, heap trees, sorting, and graph traversals.'),
  ('Digital Logic & Design', 'CS303', 3, 'btech', 'cse', 'K-maps, combinational circuits, sequential flip-flops, and registers.'),
  ('Computer Organization & Architecture', 'CS304', 3, 'btech', 'cse', 'ALU, CPU control units, pipelining, and memory hierarchy.'),
  ('Object Oriented Programming', 'CS305', 3, 'btech', 'cse', 'Inheritance, polymorphism, interfaces, and packages in Java/C++.'),
  ('Operating Systems', 'CS401', 4, 'btech', 'cse', 'Process synchronization, CPU scheduling, deadlocks, and virtual memory.'),
  ('Database Management Systems', 'CS402', 4, 'btech', 'cse', 'Relational database systems, normalization, SQL, transactions, and indexing.'),
  ('Theory of Computation', 'CS403', 4, 'btech', 'cse', 'Automata theory, context-free grammars, Turing machines, and decidability.'),
  ('Software Engineering', 'CS404', 4, 'btech', 'cse', 'SDLC, Agile methodology, requirement engineering, design models, and testing.'),
  ('Computer Networks', 'CS405', 4, 'btech', 'cse', 'OSI/TCP-IP models, routing protocols, flow control, and cybersecurity.'),
  ('Artificial Intelligence', 'CS501', 5, 'btech', 'cse', 'Heuristic search algorithms, logic, planning, and neural network introductions.'),
  ('Machine Learning', 'CS502', 5, 'btech', 'cse', 'Regression, classification, SVM, clustering, and deep architectures.'),
  ('Compiler Design', 'CS503', 5, 'btech', 'cse', 'Lexical, syntax, semantic analysis, parsing trees, and code generation.'),
  ('Web Development', 'CS504', 5, 'btech', 'cse', 'HTML, CSS, JavaScript, React, Node.js, and backend integration.'),
  ('Cloud Computing', 'CS505', 5, 'btech', 'cse', 'Virtualization, AWS, GCP platforms, SaaS, and serverless architectures.'),
  ('Big Data Analytics', 'CS601', 6, 'btech', 'cse', 'Hadoop, Spark, MapReduce framework, and data lake processing.'),
  ('Cyber Security', 'CS602', 6, 'btech', 'cse', 'Cryptography, network firewalls, penetration testing, and ethical hacking.'),
  ('Data Science Core', 'CS603', 6, 'btech', 'cse', 'Statistical analytics, modeling, data visualization, and pipeline modeling.'),
  ('Mobile Computing', 'CS604', 6, 'btech', 'cse', 'GSM architecture, cellular networks, Android development, and wireless links.'),

  -- Information Technology (IT)
  ('Software Project Management', 'IT501', 5, 'btech', 'it', 'Project scheduling, risk management, and software metrics.'),
  ('Network Programming', 'IT601', 6, 'btech', 'it', 'Sockets, UDP/TCP programming, and client-server setups.'),

  -- Electronics & Communication (ECE)
  ('Signals & Systems', 'EC301', 3, 'btech', 'ece', 'Fourier transform, Laplace, Z-transform, and system analysis.'),
  ('Analog Electronics', 'EC302', 3, 'btech', 'ece', 'Transistor amplifiers, feedback networks, and operational amplifiers.'),
  ('Digital Electronics', 'EC303', 3, 'btech', 'ece', 'Boolean algebra, multiplexers, and logic gates.'),
  ('Communication Systems', 'EC401', 4, 'btech', 'ece', 'AM, FM, digital modulations, and noise performance analysis.'),
  ('Microprocessors & Microcontrollers', 'EC402', 4, 'btech', 'ece', '8085/8086 architectures, instruction sets, and external interfacing.'),
  ('Electromagnetic Fields', 'EC403', 4, 'btech', 'ece', 'Maxwell equations, wave guides, and transmission line theory.'),
  ('VLSI Design', 'EC501', 5, 'btech', 'ece', 'CMOS logic gates, fabrication steps, and HDL modeling (Verilog).'),
  ('Embedded Systems', 'EC502', 5, 'btech', 'ece', 'RTOS, microcontroller units, and IoT devices.'),
  ('Digital Signal Processing', 'EC503', 5, 'btech', 'ece', 'DFT, FFT, IIR/FIR filter designs, and signal processors.'),

  -- Mechanical Engineering (ME)
  ('Thermodynamics', 'ME301', 3, 'btech', 'mechanical', 'Laws of thermodynamics, cycles, and energy analysis.'),
  ('Material Science', 'ME302', 3, 'btech', 'mechanical', 'Crystal structures, heat treatments, and engineering alloys.'),
  ('Fluid Mechanics', 'ME303', 3, 'btech', 'mechanical', 'Fluid properties, Bernoulli equation, and boundary layers.'),
  ('Manufacturing Processes', 'ME401', 4, 'btech', 'mechanical', 'Casting, forming, welding, and machine operations.'),
  ('Kinematics of Machines', 'ME402', 4, 'btech', 'mechanical', 'Gears, cams, links, and machine motion controls.'),
  ('Applied Thermodynamics', 'ME403', 4, 'btech', 'mechanical', 'Steam turbines, IC engines, and gas turbine cycles.'),
  ('Heat Transfer', 'ME501', 5, 'btech', 'mechanical', 'Conduction, convection, radiation, and heat exchangers.'),
  ('Design of Machine Elements', 'ME502', 5, 'btech', 'mechanical', 'Design of shafts, gears, bearings, and joints.'),

  -- Civil Engineering (CE)
  ('Strength of Materials', 'CE301', 3, 'btech', 'civil', 'Stress, strain, bending moments, and shear forces.'),
  ('Surveying', 'CE302', 3, 'btech', 'civil', 'Compass surveying, leveling, contouring, and theodolites.'),
  ('Fluid Mechanics - Civil', 'CE303', 3, 'btech', 'civil', 'Open channel flow, pipe flow, and hydraulic machinery.'),
  ('Structural Analysis', 'CE401', 4, 'btech', 'civil', 'Indeterminate structures, slope deflection, and energy methods.'),
  ('Geotechnical Engineering', 'CE402', 4, 'btech', 'civil', 'Soil mechanics, bearing capacity, and foundation safety.'),
  ('Concrete Technology', 'CE403', 4, 'btech', 'civil', 'Cement chemistry, mix design, and curing variables.'),

  -- Electrical Engineering (EE)
  ('Circuit Theory', 'EE301', 3, 'btech', 'electrical', 'Network theorems, transient analysis, and two-port networks.'),
  ('Electrical Machines I', 'EE302', 3, 'btech', 'electrical', 'DC machines and single-phase transformers.'),
  ('Power Systems I', 'EE401', 4, 'btech', 'electrical', 'Generation, transmission lines, and system calculations.'),
  ('Control Systems', 'EE402', 4, 'btech', 'electrical', 'Transfer functions, root locus, Bode plot, and PID controllers.'),

  -- Data Science
  ('Statistics for Data Science', 'DS301', 3, 'btech', 'data_science', 'Probability, hypothesis testing, and statistical inferences.'),
  ('Python for Data Science', 'DS302', 3, 'btech', 'data_science', 'Pandas, NumPy, Matplotlib, and scikit-learn coding.'),

  -- ==========================================
  -- COMPETITIVE EXAMS (IIT-JEE & NEET PREP)
  -- ==========================================
  -- IIT-JEE
  ('JEE Physics - Class 11', 'JEEPHY11', 1, 'jee', 'Physics', 'Mechanics, properties of matter, fluid models, and heat.'),
  ('JEE Physics - Class 12', 'JEEPHY12', 2, 'jee', 'Physics', 'Electrostatics, magnetism, alternating currents, and optics.'),
  ('JEE Chemistry - Class 11', 'JEECHEM11', 1, 'jee', 'Chemistry', 'Atomic structure, mole concept, chemical bonding, and s/p-block.'),
  ('JEE Chemistry - Class 12', 'JEECHEM12', 2, 'jee', 'Chemistry', 'Organic reactions, coordination, chemical kinetics, and polymer cores.'),
  ('JEE Mathematics - Class 11', 'JEEMATH11', 1, 'jee', 'Mathematics', 'Quadratic equations, sequences, trigonometry, and coordinate geometry.'),
  ('JEE Mathematics - Class 12', 'JEEMATH12', 2, 'jee', 'Mathematics', 'Limits, continuity, calculus, differential equations, and vectors.'),
  ('JEE Advanced Mechanics & Calculus', 'JEEDROP1', 3, 'jee', 'General', 'Advanced target modules for repeaters and rank boosters.'),

  -- NEET
  ('NEET Physics - Class 11', 'NEETPHY11', 1, 'neet', 'Physics', 'Mechanics, physical world, oscillations, and heat waves.'),
  ('NEET Physics - Class 12', 'NEETPHY12', 2, 'neet', 'Physics', 'Electrostatics, optics, atoms, and semiconductor devices.'),
  ('NEET Chemistry - Class 11', 'NEETCHEM11', 1, 'neet', 'Chemistry', 'Basic principles, inorganic groups, and thermodynamics.'),
  ('NEET Chemistry - Class 12', 'NEETCHEM12', 2, 'neet', 'Chemistry', 'Organic mechanisms, coordination chemistry, and solutions.'),
  ('NEET Biology - Class 11', 'NEETBIO11', 1, 'neet', 'Biology', 'Cell division, plant kingdom, and human anatomical controls.'),
  ('NEET Biology - Class 12', 'NEETBIO12', 2, 'neet', 'Biology', 'Genetics, evolution, molecular bases, and ecology.'),

  -- ==========================================
  -- MEDICAL HUB (MBBS, BDS, BPT)
  -- ==========================================
  -- MBBS
  ('MBBS Anatomy', 'MBBS101', 1, 'medical', 'mbbs', 'Gross anatomy, embryology, and histology of human regions.'),
  ('MBBS Physiology', 'MBBS102', 1, 'medical', 'mbbs', 'Nervous, cardiac, gastrointestinal, and renal physiology.'),
  ('MBBS Biochemistry', 'MBBS103', 1, 'medical', 'mbbs', 'Enzymology, metabolism pathways, and clinical molecular biochemistry.'),
  ('MBBS Pathology', 'MBBS201', 2, 'medical', 'mbbs', 'General pathology, systemic lesions, and hematological testing.'),
  ('MBBS Microbiology', 'MBBS202', 2, 'medical', 'mbbs', 'Bacteriology, virology, immunology, and clinical parasitology.'),
  ('MBBS Pharmacology', 'MBBS203', 2, 'medical', 'mbbs', 'Mechanisms of drugs, therapeutic actions, and toxicity.'),
  ('MBBS Community Medicine', 'MBBS301', 3, 'medical', 'mbbs', 'Public health policies, epidemiology, and healthcare indices.'),
  ('MBBS Ophthalmology', 'MBBS302', 3, 'medical', 'mbbs', 'Ocular diagnostics, anatomy of the eye, and refractive errors.'),
  ('MBBS General Medicine', 'MBBS401', 4, 'medical', 'mbbs', 'Diagnosis and pharmacotherapy of internal medical conditions.'),
  ('MBBS General Surgery', 'MBBS402', 4, 'medical', 'mbbs', 'Surgical procedures, wound repair, and operative surgical files.'),

  -- BDS
  ('Dental Anatomy & Histology', 'BDS102', 1, 'medical', 'bds', 'Development of teeth, root morphology, and histology of oral structures.'),
  ('Dental Materials', 'BDS202', 2, 'medical', 'bds', 'Composition and handling properties of dental cements, resins, and metals.'),
  ('Oral Pathology & Microbiology', 'BDS303', 3, 'medical', 'bds', 'Diagnosis of oral diseases, cysts, and tumors of facial bones.'),

  -- BPT
  ('Human Anatomy for Physiotherapy', 'BPT101', 1, 'medical', 'bpt', 'Detailed muscle, bone, and joint structures for physical medicine.'),
  ('Biomechanics & Kinesiology', 'BPT201', 2, 'medical', 'bpt', 'Study of movement, joint mechanics, force vectors, and locomotion.'),
  ('Electrotherapy', 'BPT203', 2, 'medical', 'bpt', 'Application of TENS, ultrasound, SWD, and electric currents in pain.')

on conflict (code) do update 
set name = excluded.name, 
    semester = excluded.semester, 
    category = excluded.category, 
    branch = excluded.branch, 
    description = excluded.description;

-- =============================================

-- 9. USEFUL VIEWS (Recreate with dynamic column inheritance)
drop view if exists public.notes_with_subject;
create view public.notes_with_subject as
  select 
    n.*,
    s.name as subject_name,
    s.code as subject_code
  from public.notes n
  left join public.subjects s on n.subject_id = s.id;

-- Download count update function
create or replace function increment_download_count(note_id uuid)
returns void as $$
  update public.notes 
  set download_count = download_count + 1 
  where id = note_id;
$$ language sql security definer;
