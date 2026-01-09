import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

// Supabase client with service role for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Auth helper
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.log('Auth error:', error);
    return null;
  }
  return user;
}

// ========================================
// HEALTH CHECK
// ========================================
app.get('/make-server-e1fc0df5/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========================================
// AUTH ROUTES
// ========================================

// Sign up
app.post('/make-server-e1fc0df5/auth/signup', async (c) => {
  try {
    const { email, password, firstName, lastName, role } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name: firstName, last_name: lastName, role },
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// STUDENT ROUTES
// ========================================

// Get all students
app.get('/make-server-e1fc0df5/students', async (c) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (
          class_id,
          class_name,
          year_level
        )
      `)
      .order('student_id', { ascending: true });

    if (error) throw error;

    return c.json({ students: data || [] });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Get student by ID
app.get('/make-server-e1fc0df5/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (
          class_id,
          class_name,
          year_level
        )
      `)
      .eq('student_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Student not found' }, 404);
      }
      throw error;
    }

    return c.json({ student: data });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Create student
app.post('/make-server-e1fc0df5/students', async (c) => {
  try {
    const studentData = await c.req.json();
    
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) throw error;

    return c.json({ student: data }, 201);
  } catch (error: any) {
    console.error('Error creating student:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Update student
app.put('/make-server-e1fc0df5/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('student_id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Student not found' }, 404);
      }
      throw error;
    }

    return c.json({ student: data });
  } catch (error: any) {
    console.error('Error updating student:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Delete student
app.delete('/make-server-e1fc0df5/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', id);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// ========================================
// TEACHER ROUTES
// ========================================

// Get all teachers
app.get('/make-server-e1fc0df5/teachers', async (c) => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('teacher_id', { ascending: true });

    if (error) throw error;

    return c.json({ teachers: data || [] });
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Get teacher by ID
app.get('/make-server-e1fc0df5/teachers/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('teacher_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Teacher not found' }, 404);
      }
      throw error;
    }

    return c.json({ teacher: data });
  } catch (error: any) {
    console.error('Error fetching teacher:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Create teacher
app.post('/make-server-e1fc0df5/teachers', async (c) => {
  try {
    const teacherData = await c.req.json();
    
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacherData])
      .select()
      .single();

    if (error) throw error;

    return c.json({ teacher: data }, 201);
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Update teacher
app.put('/make-server-e1fc0df5/teachers/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const { data, error } = await supabase
      .from('teachers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('teacher_id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Teacher not found' }, 404);
      }
      throw error;
    }

    return c.json({ teacher: data });
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Delete teacher
app.delete('/make-server-e1fc0df5/teachers/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('teacher_id', id);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting teacher:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// ========================================
// CLASS ROUTES
// ========================================

// Get all classes
app.get('/make-server-e1fc0df5/classes', async (c) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('year_level', { ascending: true })
      .order('class_name', { ascending: true });

    if (error) throw error;

    return c.json({ classes: data || [] });
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// ========================================
// SUBJECT ROUTES
// ========================================

// Get all subjects
app.get('/make-server-e1fc0df5/subjects', async (c) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('subject_name', { ascending: true });

    if (error) throw error;

    return c.json({ subjects: data || [] });
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// ========================================
// TIMETABLE ROUTES
// ========================================

// Get timetable for a class
app.get('/make-server-e1fc0df5/timetable/:classId', async (c) => {
  try {
    const classId = c.req.param('classId');
    
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        subjects (
          subject_id,
          subject_name,
          subject_code
        ),
        teachers (
          teacher_id,
          first_name,
          last_name
        )
      `)
      .eq('class_id', classId)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;

    return c.json({ timetable: data || [] });
  } catch (error: any) {
    console.error('Error fetching timetable:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Create timetable entry
app.post('/make-server-e1fc0df5/timetable', async (c) => {
  try {
    const timetableData = await c.req.json();
    
    const { data, error } = await supabase
      .from('timetable')
      .insert([timetableData])
      .select()
      .single();

    if (error) throw error;

    return c.json({ timetable: data }, 201);
  } catch (error: any) {
    console.error('Error creating timetable entry:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Update timetable entry
app.put('/make-server-e1fc0df5/timetable/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const { data, error } = await supabase
      .from('timetable')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('timetable_id', id)
      .select()
      .single();

    if (error) throw error;

    return c.json({ timetable: data });
  } catch (error: any) {
    console.error('Error updating timetable entry:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// Delete timetable entry
app.delete('/make-server-e1fc0df5/timetable/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('timetable')
      .delete()
      .eq('timetable_id', id);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting timetable entry:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

// ========================================
// SEED / INITIALIZE
// ========================================

app.post('/make-server-e1fc0df5/seed', async (c) => {
  try {
    console.log('🌱 Starting seed process...');

    // Create demo user if not exists
    let userCreationStatus = 'unknown';
    try {
      console.log('Checking for existing demo user...');
      const { data: existingUser, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.log('Error listing users:', listError);
      } else {
        const demoExists = existingUser?.users?.some(u => u.email === 'demo@smartlearn.com');
        
        if (!demoExists) {
          console.log('Creating demo user: demo@smartlearn.com');
          const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: 'demo@smartlearn.com',
            password: 'demo123',
            user_metadata: { first_name: 'Demo', last_name: 'Admin', role: 'admin' },
            email_confirm: true,
          });
          
          if (userError) {
            console.error('❌ Error creating demo user:', userError.message);
            userCreationStatus = `error: ${userError.message}`;
          } else {
            console.log('✓ Demo user created successfully');
            userCreationStatus = 'created';
          }
        } else {
          console.log('✓ Demo user already exists');
          userCreationStatus = 'exists';
        }
      }
    } catch (authError: any) {
      console.error('❌ Auth error:', authError.message || authError);
      userCreationStatus = `error: ${authError.message || 'unknown'}`;
    }

    // Check if data already exists
    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log('✓ Database already seeded');
      return c.json({ 
        success: true, 
        message: 'Database already contains data',
        userStatus: userCreationStatus
      });
    }

    console.log('📚 Seeding database tables...');
    
    return c.json({ 
      success: true, 
      message: 'Please run the SQL schema from database-schema.sql in your Supabase SQL Editor',
      userStatus: userCreationStatus,
      instructions: 'Go to https://supabase.com/dashboard → SQL Editor → Run the schema from /database-schema.sql'
    });

  } catch (error: any) {
    console.error('Error seeding data:', error);
    return c.json({ error: error.message || String(error) }, 500);
  }
});

Deno.serve(app.fetch);
