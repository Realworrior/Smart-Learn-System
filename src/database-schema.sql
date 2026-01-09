-- SmartLearn Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
  class_id SERIAL PRIMARY KEY,
  class_name VARCHAR(50) NOT NULL,
  year_level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
  student_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10),
  date_of_birth DATE,
  address TEXT,
  phone_number VARCHAR(20),
  email VARCHAR(100),
  class_id INTEGER REFERENCES classes(class_id) ON DELETE SET NULL,
  guardian_name VARCHAR(200),
  guardian_contact VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS teachers (
  teacher_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  department VARCHAR(100),
  qualification VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
  subject_id SERIAL PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. CLASS_SUBJECTS BRIDGE TABLE
CREATE TABLE IF NOT EXISTS class_subjects (
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (class_id, subject_id)
);

-- 6. TIMETABLE TABLE
CREATE TABLE IF NOT EXISTS timetable (
  timetable_id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE SET NULL,
  day_of_week VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, day_of_week, start_time)
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for authenticated users (admin access)
CREATE POLICY "Enable all operations for authenticated users" ON classes
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON students
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON teachers
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON subjects
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON class_subjects
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON timetable
  FOR ALL USING (true);

-- 9. Create indexes for better performance
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_class_subjects_class ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_teacher ON class_subjects(teacher_id);
CREATE INDEX idx_timetable_class ON timetable(class_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);

-- 10. Insert sample data
-- Classes
INSERT INTO classes (class_name, year_level) VALUES
  ('10-A', 10),
  ('10-B', 10),
  ('9-A', 9),
  ('9-B', 9),
  ('11-A', 11),
  ('11-B', 11)
ON CONFLICT DO NOTHING;

-- Subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
  ('Mathematics', 'MATH'),
  ('Physics', 'PHY'),
  ('Chemistry', 'CHEM'),
  ('Biology', 'BIO'),
  ('English', 'ENG'),
  ('History', 'HIST')
ON CONFLICT DO NOTHING;

-- Teachers
INSERT INTO teachers (first_name, last_name, email, phone_number, department, qualification) VALUES
  ('Jane', 'Williams', 'jane.williams@smartlearn.edu', '+1 234 567 8901', 'Mathematics', 'PhD Mathematics'),
  ('John', 'Smith', 'john.smith@smartlearn.edu', '+1 234 567 8902', 'Science', 'MSc Physics'),
  ('Sarah', 'Davis', 'sarah.davis@smartlearn.edu', '+1 234 567 8903', 'Science', 'MSc Chemistry'),
  ('Michael', 'Brown', 'michael.brown@smartlearn.edu', '+1 234 567 8904', 'Science', 'MSc Biology'),
  ('Emily', 'Johnson', 'emily.johnson@smartlearn.edu', '+1 234 567 8905', 'Languages', 'MA English Literature')
ON CONFLICT DO NOTHING;

-- Students
INSERT INTO students (first_name, last_name, gender, date_of_birth, phone_number, email, class_id, guardian_name, guardian_contact) VALUES
  ('John', 'Smith', 'Male', '2008-05-15', '+1 555 0101', 'john.smith@student.edu', 1, 'Robert Smith', '+1 555 0001'),
  ('Emily', 'Johnson', 'Female', '2008-07-22', '+1 555 0102', 'emily.johnson@student.edu', 1, 'Linda Johnson', '+1 555 0002'),
  ('Michael', 'Brown', 'Male', '2008-03-10', '+1 555 0103', 'michael.brown@student.edu', 2, 'David Brown', '+1 555 0003'),
  ('Sarah', 'Davis', 'Female', '2008-11-30', '+1 555 0104', 'sarah.davis@student.edu', 2, 'Jennifer Davis', '+1 555 0004'),
  ('David', 'Wilson', 'Male', '2009-01-20', '+1 555 0105', 'david.wilson@student.edu', 3, 'Thomas Wilson', '+1 555 0005'),
  ('Jessica', 'Martinez', 'Female', '2009-06-18', '+1 555 0106', 'jessica.martinez@student.edu', 3, 'Maria Martinez', '+1 555 0006')
ON CONFLICT DO NOTHING;

-- Class Subjects (Assign subjects to classes with teachers)
INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES
  (1, 1, 1), -- 10-A: Mathematics - Jane Williams
  (1, 2, 2), -- 10-A: Physics - John Smith
  (1, 3, 3), -- 10-A: Chemistry - Sarah Davis
  (1, 5, 5), -- 10-A: English - Emily Johnson
  (2, 1, 1), -- 10-B: Mathematics - Jane Williams
  (2, 2, 2), -- 10-B: Physics - John Smith
  (2, 4, 4), -- 10-B: Biology - Michael Brown
  (3, 1, 1), -- 9-A: Mathematics - Jane Williams
  (3, 5, 5)  -- 9-A: English - Emily Johnson
ON CONFLICT DO NOTHING;

-- Sample Timetable for 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time) VALUES
  (1, 1, 1, 'Monday', '09:00', '10:00'),
  (1, 2, 2, 'Monday', '10:15', '11:15'),
  (1, 3, 3, 'Monday', '11:30', '12:30'),
  (1, 1, 1, 'Tuesday', '09:00', '10:00'),
  (1, 5, 5, 'Tuesday', '10:15', '11:15'),
  (1, 2, 2, 'Wednesday', '09:00', '10:00'),
  (1, 3, 3, 'Wednesday', '10:15', '11:15')
ON CONFLICT DO NOTHING;

-- Create demo admin user (run separately if needed)
-- This creates the auth user - you may need to run this in the Supabase Auth section
-- The server will also attempt to create this user on /seed endpoint
