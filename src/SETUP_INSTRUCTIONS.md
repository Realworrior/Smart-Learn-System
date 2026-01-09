# SmartLearn - Supabase Setup Instructions

## Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your SmartLearn project
3. Navigate to **SQL Editor** in the left sidebar

## Step 2: Run the Database Schema

1. Open the file `/database-schema.sql` in this project
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute the schema

This will create:
- ✅ All database tables (students, teachers, classes, subjects, class_subjects, timetable)
- ✅ Primary and foreign key relationships
- ✅ Row Level Security (RLS) policies
- ✅ Sample data for testing
- ✅ Performance indexes

## Step 3: Verify Tables Were Created

1. In your Supabase dashboard, go to **Table Editor**
2. You should see the following tables:
   - `students`
   - `teachers`
   - `classes`
   - `subjects`
   - `class_subjects`
   - `timetable`

## Step 4: Test the Application

1. Reload your SmartLearn application
2. The app will automatically:
   - Create the demo user: `demo@smartlearn.com` / `demo123`
   - Check if database tables exist
3. Login with the demo credentials
4. You should see sample data populated

## Database Schema Overview

### Tables Created

**1. students**
- Primary Key: `student_id`
- Foreign Key: `class_id` → classes
- Contains: Student personal info, guardian details

**2. teachers**
- Primary Key: `teacher_id`
- Contains: Teacher credentials, department, qualification

**3. classes**
- Primary Key: `class_id`
- Contains: Class name, year level

**4. subjects**
- Primary Key: `subject_id`
- Contains: Subject name, subject code

**5. class_subjects** (Bridge Table)
- Composite PK: `(class_id, subject_id)`
- Links: classes ↔ subjects ↔ teachers

**6. timetable**
- Primary Key: `timetable_id`
- Foreign Keys: class_id, subject_id, teacher_id
- Contains: Schedule (day, time slots)

## Sample Data Included

- **6 Students** across 3 classes (10-A, 10-B, 9-A)
- **5 Teachers** in various departments
- **6 Classes** (9-A, 9-B, 10-A, 10-B, 11-A, 11-B)
- **6 Subjects** (Math, Physics, Chemistry, Biology, English, History)
- **Sample timetable** for Class 10-A

## Troubleshooting

### Error: "relation does not exist"
- You haven't run the SQL schema yet
- Go to Supabase SQL Editor and run `/database-schema.sql`

### Error: "Invalid login credentials"
- The demo user needs to be created
- The app will try to create it automatically
- Or run the signup endpoint manually

### Data not appearing
1. Check Supabase Table Editor to confirm data exists
2. Check browser console for API errors
3. Verify RLS policies are applied correctly

## API Endpoints

The application uses these endpoints:

- **Auth**: `/auth/signup`
- **Students**: GET/POST/PUT/DELETE `/students`
- **Teachers**: GET/POST/PUT/DELETE `/teachers`
- **Classes**: GET `/classes`
- **Subjects**: GET `/subjects`
- **Timetable**: GET/POST/PUT/DELETE `/timetable/:classId`
- **Seed**: POST `/seed` (creates demo user)

## Security

- All tables have Row Level Security (RLS) enabled
- Policies allow all operations for authenticated users
- Demo user is auto-confirmed (no email verification needed)
- Service role key is only used on the server (never exposed to frontend)

## Next Steps

After setup:
1. ✅ Test CRUD operations (Create, Read, Update, Delete)
2. ✅ Add new students and teachers
3. ✅ Create timetable entries
4. ✅ Explore the relationship between entities

For production use, update RLS policies to restrict access based on user roles.
