import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Helper to handle Supabase responses
const handleResponse = async (query: any) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Student API
export const studentAPI = {
  getAll: async () => {
    const { data: students, error } = await supabaseClient
      .from('students')
      .select('*')
      // Fallback to sorting by ID since created_at might be missing in some environments
      .order('student_id', { ascending: false });

    if (error) throw new Error(error.message);
    return { students };
  },
  getById: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('students')
      .select('*')
      .eq('student_id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  create: async (data: any) => {
    // Remove classes object if present (from select) and ensure class_id is valid
    const { classes, ...studentData } = data;
    const { error } = await supabaseClient
      .from('students')
      .insert([studentData]);

    if (error) throw new Error(error.message);
  },
  update: async (id: string, data: any) => {
    const { classes, ...studentData } = data;
    const { error } = await supabaseClient
      .from('students')
      .update(studentData)
      .eq('student_id', id);

    if (error) throw new Error(error.message);
  },
  delete: async (id: string) => {
    const { error } = await supabaseClient
      .from('students')
      .delete()
      .eq('student_id', id);

    if (error) throw new Error(error.message);
  },
};

// Teacher API
export const teacherAPI = {
  getAll: async () => {
    const { data: teachers, error } = await supabaseClient
      .from('teachers')
      .select('*')
      .order('teacher_id', { ascending: false });

    if (error) throw new Error(error.message);
    return { teachers };
  },
  getById: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('teachers')
      .select('*')
      .eq('teacher_id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  create: async (data: any) => {
    const { error } = await supabaseClient
      .from('teachers')
      .insert([data]);

    if (error) throw new Error(error.message);
  },
  update: async (id: string, data: any) => {
    const { error } = await supabaseClient
      .from('teachers')
      .update(data)
      .eq('teacher_id', id);

    if (error) throw new Error(error.message);
  },
  delete: async (id: string) => {
    const { error } = await supabaseClient
      .from('teachers')
      .delete()
      .eq('teacher_id', id);

    if (error) throw new Error(error.message);
  },
};

// Class API
export const classAPI = {
  getAll: async () => {
    // Get classes and manually count students since count-join is complex in simple client
    const { data: classes, error } = await supabaseClient
      .from('classes')
      .select('*')
      .order('class_id', { ascending: false });

    if (error) throw new Error(error.message);

    // Get student counts for each class
    // Note: For a real production app with many classes, this should be a view or RPC
    const classesWithCounts = await Promise.all(classes.map(async (cls: any) => {
      const { count } = await supabaseClient
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', cls.class_id);

      return {
        ...cls,
        student_count: count || 0,
        // Mock subject since it's not directly on class table in schema but used in UI
        // Ideally we'd join class_subjects -> subjects
        subject: 'General' // Placeholder as verified in ClassForm it's just a text input but schema varies
      };
    }));

    return { classes: classesWithCounts };
  },
  getById: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('classes')
      .select('*')
      .eq('class_id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  create: async (data: any) => {
    // ClassForm sends { class_name, subject, year_level }
    // Schema only has class_name, year_level. 'subject' is in class_subjects bridge table.
    // For now, we will save the class itself to fix the crash.
    const { subject, ...classData } = data;
    const { error } = await supabaseClient
      .from('classes')
      .insert([classData]);

    if (error) throw new Error(error.message);
  },
  update: async (id: string, data: any) => {
    const { subject, ...classData } = data;
    const { error } = await supabaseClient
      .from('classes')
      .update(classData)
      .eq('class_id', id);

    if (error) throw new Error(error.message);
  },
  delete: async (id: string) => {
    const { error } = await supabaseClient
      .from('classes')
      .delete()
      .eq('class_id', id);

    if (error) throw new Error(error.message);
  },
};

// Timetable API
export const timetableAPI = {
  get: async (classId: string) => {
    const { data, error } = await supabaseClient
      .from('timetable')
      .select(`
        *,
        subjects (subject_name),
        teachers (first_name, last_name)
      `)
      .eq('class_id', classId);

    if (error) throw new Error(error.message);
    return {
      timetable: data.map((t: any) => ({
        ...t,
        subject: t.subjects?.subject_name,
        teacher: t.teachers ? `${t.teachers.first_name} ${t.teachers.last_name}` : 'Unknown'
      }))
    };
  },
  getForTeacher: async (teacherId: string) => {
    const { data, error } = await supabaseClient
      .from('timetable')
      .select(`
        *,
        subjects (subject_name),
        classes (class_name, year_level)
      `)
      .eq('teacher_id', teacherId);

    if (error) throw new Error(error.message);
    return {
      timetable: data.map((t: any) => ({
        ...t,
        subject: t.subjects?.subject_name,
        class: t.classes ? `${t.classes.class_name}` : 'Unknown'
      }))
    };
  },
  save: async (classId: string, data: any) => {
    const { message, ...timetableData } = data; // Remove potential extra fields

    // Check if entry exists first to avoid relying on DB constraint name
    // (which causes "no unique or exclusion constraint matching" error if missing)
    const { data: existing } = await supabaseClient
      .from('timetable')
      .select('timetable_id')
      .eq('class_id', classId)
      .eq('day_of_week', data.day_of_week)
      .eq('start_time', data.start_time)
      .single();

    let error;
    if (existing) {
      // Update existing
      const result = await supabaseClient
        .from('timetable')
        .update({
          ...timetableData,
          class_id: classId
        })
        .eq('timetable_id', existing.timetable_id);
      error = result.error;
    } else {
      // Insert new
      const result = await supabaseClient
        .from('timetable')
        .insert([{
          class_id: classId,
          ...timetableData
        }]);
      error = result.error;
    }

    if (error) throw new Error(error.message);
  },
};

// Subject API
export const subjectAPI = {
  getAll: async () => {
    const { data: subjects, error } = await supabaseClient
      .from('subjects')
      .select('*')
      .order('subject_name', { ascending: true });

    if (error) throw new Error(error.message);
    return { subjects };
  },
  create: async (data: any) => {
    const { error } = await supabaseClient
      .from('subjects')
      .insert([data]);

    if (error) throw new Error(error.message);
  },
  delete: async (id: string) => {
    const { error } = await supabaseClient
      .from('subjects')
      .delete()
      .eq('subject_id', id);

    if (error) throw new Error(error.message);
  },
};

// Seed data - Kept simple or disabled as it usually runs server-side
export const seedData = async () => {
  // Client-side seeding is risky/complex. 
  // We'll rely on the user creating data via the now-working forms.
  console.log("Seeding skipped in client-mode");
  return { message: 'Seeding skipped' };
};

// Auth API
export const authAPI = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },
  getSession: async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};