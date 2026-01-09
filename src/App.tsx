import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { TeacherManagement } from './components/TeacherManagement';
import { ScheduleManagement } from './components/ScheduleManagement';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherSchedule } from './components/TeacherSchedule';
import { TeacherClasses } from './components/TeacherClasses';
import { TeacherSettings } from './components/TeacherSettings';
import { Classes } from './components/Classes';
import { Subjects } from './components/Subjects';
import { Settings } from './components/Settings';
import { seedData } from './utils/api';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings' | 'teacher-dashboard' | 'teacher-schedule' | 'teacher-classes' | 'teacher-settings' | 'subjects';
type UserRole = 'admin' | 'teacher' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize demo user and seed data on first load
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Initializing SmartLearn...');
        console.log('');
        console.log('📋 SETUP REQUIRED:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Open SQL Editor');
        console.log('3. Run the schema from /database-schema.sql');
        console.log('4. Refresh this page');
        console.log('');
        console.log('Creating demo user...');

        const result = await seedData();
        console.log('Initialization result:', result);

        if (result.message?.includes('Run the schema')) {
          console.warn('⚠️  DATABASE NOT SET UP');
          console.warn('Please run /database-schema.sql in Supabase SQL Editor');
          console.warn('See SETUP_INSTRUCTIONS.md for detailed steps');
        } else {
          console.log('✓ Demo user ready: demo@smartlearn.com / demo123');
          console.log('✓ Database connected');
        }

        setInitialized(true);
      } catch (error: any) {
        console.error('⚠️  Initialization warning:', error.message || error);
        console.log('');
        console.log('If you see database errors:');
        console.log('→ Run /database-schema.sql in Supabase SQL Editor');
        console.log('→ See SETUP_INSTRUCTIONS.md for help');
        console.log('');
        setInitialized(true);
      }
    };

    if (!initialized) {
      initialize();
    }
  }, [initialized]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentScreen('teacher-dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Show loading state while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Initializing SmartLearn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === 'dashboard' && userRole && (
        <Dashboard
          role={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'students' && userRole && (
        <StudentList
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'teachers' && userRole && (
        <TeacherManagement
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'timetable' && userRole && (
        <ScheduleManagement
          role={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'classes' && userRole && (
        <Classes
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'settings' && userRole && (
        <Settings
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'subjects' && userRole && (
        <Subjects
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'teacher-dashboard' && userRole && (
        <TeacherDashboard
          role={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'teacher-schedule' && userRole && (
        <TeacherSchedule
          role={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'teacher-classes' && userRole && (
        <TeacherClasses
          role={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}


      {currentScreen === 'teacher-settings' && userRole && (
        <TeacherSettings
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}