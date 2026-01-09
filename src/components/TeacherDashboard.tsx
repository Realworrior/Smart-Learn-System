import { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { Calendar, Users, BookOpen, Clock } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  role?: string;
  teacherId?: string;
}

export function TeacherDashboard({ onNavigate, onLogout, role, teacherId }: TeacherDashboardProps) {
  const [teacherData, setTeacherData] = useState<any>(null);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    todayClasses: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    // In production, fetch from API based on teacherId
    setTeacherData({
      teacher_id: 1,
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@smartlearn.com',
      department: 'Mathematics',
      qualification: 'PhD Mathematics',
    });

    setTodaySchedule([
      {
        time: '08:00 - 09:00',
        subject: 'Mathematics',
        class: 'Year 10 A',
        room: 'Room 201',
      },
      {
        time: '10:00 - 11:00',
        subject: 'Algebra',
        class: 'Year 11 B',
        room: 'Room 203',
      },
      {
        time: '13:00 - 14:00',
        subject: 'Mathematics',
        class: 'Year 9 C',
        room: 'Room 201',
      },
    ]);

    setStats({
      totalClasses: 5,
      todayClasses: 3,
      totalStudents: 142,
    });

    setLoading(false);
  }, [teacherId]);

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <TeacherLayout 
      currentPage="teacher-dashboard" 
      onNavigate={onNavigate}
      onLogout={onLogout}
      teacherName={teacherData ? `${teacherData.first_name} ${teacherData.last_name}` : 'Teacher'}
    >
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Welcome back, {teacherData?.first_name || 'Teacher'}!
          </h1>
          <p className="text-gray-600">
            {getDayOfWeek()}, {getFormattedDate()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Classes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#6292b1]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Classes</p>
                <p className="text-gray-900">{stats.totalClasses}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#6292b1]/10 flex items-center justify-center">
                <BookOpen size={24} className="text-[#6292b1]" />
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2ac8d2]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Today&apos;s Classes</p>
                <p className="text-gray-900">{stats.todayClasses}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#2ac8d2]/10 flex items-center justify-center">
                <Calendar size={24} className="text-[#2ac8d2]" />
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#4981a5]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Students</p>
                <p className="text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#4981a5]/10 flex items-center justify-center">
                <Users size={24} className="text-[#4981a5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-gray-900">Today&apos;s Schedule</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading schedule...</div>
            ) : todaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#6292b1] hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6292b1] to-[#4981a5] flex items-center justify-center text-white">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-gray-900">{item.subject}</h3>
                          <p className="text-sm text-gray-600">{item.class}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-block px-3 py-1 bg-[#6292b1]/10 text-[#6292b1] rounded text-sm">
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen size={14} />
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => onNavigate('teacher-schedule')}
            className="bg-white rounded-lg p-6 border border-gray-200 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2ac8d2] to-[#6292b1] flex items-center justify-center text-white">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">View Full Schedule</h3>
                <p className="text-sm text-gray-600">See your complete weekly timetable</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('teacher-classes')}
            className="bg-white rounded-lg p-6 border border-gray-200 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4981a5] to-[#6292b1] flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">My Classes</h3>
                <p className="text-sm text-gray-600">View and manage your class lists</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
}