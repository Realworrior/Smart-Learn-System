import { AdminLayout } from './AdminLayout';
import { Users, UserCheck, BookOpen, TrendingUp } from 'lucide-react';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';
type UserRole = 'admin' | 'teacher';

interface DashboardProps {
  role: UserRole;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Dashboard({ role, onNavigate, onLogout }: DashboardProps) {
  if (role === 'admin') {
    return (
      <AdminLayout
        title="Dashboard"
        currentScreen="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <AdminDashboard onNavigate={onNavigate} />
      </AdminLayout>
    );
  }

  return <TeacherDashboard onNavigate={onNavigate} onLogout={onLogout} />;
}

import { useState, useEffect } from 'react';
import { studentAPI, teacherAPI, classAPI } from '../utils/api';

function AdminDashboard({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, teacherData, classData] = await Promise.all([
          studentAPI.getAll(),
          teacherAPI.getAll(),
          classAPI.getAll()
        ]);

        setStats({
          students: studentData.students.length,
          teachers: teacherData.teachers.length,
          classes: classData.classes.length
        });

        // Generate recent activity from latest additions
        // Since APIs return sorted by ID desc (newest first), we can just take the top items
        const newStudents = studentData.students.slice(0, 3).map((s: any) => ({
          action: 'New student enrolled',
          details: `${s.first_name} ${s.last_name}`,
          time: 'Recently', // We don't have reliable created_at access yet per previous errors
          dotColor: '#2ac8d2'
        }));

        const newTeachers = teacherData.teachers.slice(0, 2).map((t: any) => ({
          action: 'Teacher joined',
          details: `${t.first_name} ${t.last_name} - ${t.department}`,
          time: 'Recently',
          dotColor: '#c5a988'
        }));

        // Interleave/Combine and take top 5
        setRecentActivity([...newStudents, ...newTeachers].slice(0, 5));

      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = [
    {
      icon: Users,
      label: 'Total Students',
      value: loading ? '...' : stats.students.toString(),
      change: 'Active students',
      screen: 'students' as Screen,
      accentColor: '#2ac8d2'
    },
    {
      icon: UserCheck,
      label: 'Total Teachers',
      value: loading ? '...' : stats.teachers.toString(),
      change: 'Faculty members',
      screen: 'teachers' as Screen,
      accentColor: '#c5a988'
    },
    {
      icon: BookOpen,
      label: 'Active Classes',
      value: loading ? '...' : stats.classes.toString(),
      change: 'Scheduled sections',
      screen: 'classes' as Screen,
      accentColor: '#6292b1'
    },
    {
      icon: TrendingUp,
      label: 'Attendance Rate',
      value: '95%',
      change: '+2.5% from last month',
      screen: 'dashboard' as Screen,
      accentColor: '#fea37b'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div>
        <h2 className="mb-4 text-gray-900 dark:text-white">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.label}
                onClick={() => onNavigate(metric.screen)}
                className="bg-white border border-gray-200 rounded p-6 hover:shadow-md text-left transition-all relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="absolute top-0 left-0 w-1 h-full transition-all" style={{ backgroundColor: metric.accentColor }}></div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Icon size={24} strokeWidth={1.5} className="text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="text-3xl mb-2 text-gray-900 dark:text-white">{metric.value}</div>
                <div className="mb-1 text-gray-900 dark:text-gray-300">{metric.label}</div>
                <div className="text-gray-500 text-sm dark:text-gray-400">{metric.change}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="bg-white border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index !== recentActivity.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
              >
                <div className="mt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activity.dotColor }}></div>
                </div>
                <div className="flex-1 flex items-start justify-between">
                  <div>
                    <div className="mb-1 text-gray-900 dark:text-white">{activity.action}</div>
                    <div className="text-gray-500 text-sm dark:text-gray-400">{activity.details}</div>
                  </div>
                  <div className="text-gray-400 text-right ml-4 text-sm whitespace-nowrap">{activity.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No recent activity found.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('students')}
            className="bg-gray-900 hover:bg-gray-800 text-white p-6 rounded transition-colors relative overflow-hidden group dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2ac8d2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">Add New Student</span>
          </button>
          <button
            onClick={() => onNavigate('teachers')}
            className="bg-white border border-gray-300 text-gray-900 p-6 rounded hover:bg-gray-50 transition-colors relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <span className="absolute top-0 left-0 w-1 h-full bg-[#c5a988] opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">Add New Teacher</span>
          </button>
          <button
            onClick={() => onNavigate('timetable')}
            className="bg-white border border-gray-300 text-gray-900 p-6 rounded hover:bg-gray-50 transition-colors relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <span className="absolute top-0 left-0 w-1 h-full bg-[#6292b1] opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">Manage Timetable</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ onNavigate, onLogout }: { onNavigate: (screen: Screen) => void; onLogout: () => void }) {
  const myClasses = [
    { name: 'Class 10-A', subject: 'Mathematics' },
    { name: 'Class 10-B', subject: 'Mathematics' },
    { name: 'Class 9-A', subject: 'Algebra' },
  ];

  const mySubjects = ['Mathematics', 'Algebra', 'Geometry'];

  const schedule = [
    { time: '9:00 AM - 10:00 AM', class: 'Class 10-A', subject: 'Mathematics' },
    { time: '10:30 AM - 11:30 AM', class: 'Class 10-B', subject: 'Mathematics' },
    { time: '2:00 PM - 3:00 PM', class: 'Class 9-A', subject: 'Algebra' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-300 p-6">
        <div className="flex items-center justify-between">
          <h1>Teacher Dashboard</h1>
          <button
            onClick={onLogout}
            className="border-2 border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* My Classes */}
        <div>
          <h2 className="mb-4">My Classes</h2>
          <div className="border-2 border-gray-300 bg-white">
            {myClasses.map((cls, index) => (
              <div
                key={index}
                className={`p-4 ${index !== myClasses.length - 1 ? 'border-b-2 border-gray-300' : ''}`}
              >
                <div>{cls.name}</div>
                <div className="text-gray-600">Subject: {cls.subject}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My Subjects */}
        <div>
          <h2 className="mb-4">My Subjects</h2>
          <div className="border-2 border-gray-300 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              {mySubjects.map((subject) => (
                <div key={subject} className="border-2 border-gray-300 px-4 py-2">
                  {subject}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Schedule */}
        <div>
          <h2 className="mb-4">My Schedule</h2>
          <div className="border-2 border-gray-300 bg-white">
            {schedule.map((item, index) => (
              <div
                key={index}
                className={`p-4 ${index !== schedule.length - 1 ? 'border-b-2 border-gray-300' : ''}`}
              >
                <div>{item.time}</div>
                <div className="text-gray-600">{item.class} - {item.subject}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Shortcut */}
        <div>
          <button className="border-2 border-gray-900 bg-gray-900 text-white px-6 py-3 hover:bg-gray-700">
            Take Attendance
          </button>
        </div>
      </div>
    </div>
  );
}