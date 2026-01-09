import { useState } from 'react';
import { Calendar, Users, BookOpen, Settings, LogOut, Menu, X } from 'lucide-react';

interface TeacherLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  teacherName?: string;
}

export function TeacherLayout({ children, currentPage, onNavigate, onLogout, teacherName = 'Teacher' }: TeacherLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'teacher-schedule', label: 'My Schedule', icon: Calendar },
    { id: 'teacher-classes', label: 'My Classes', icon: Users },
    { id: 'teacher-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">SmartLearn</h1>
              <p className="text-sm text-gray-500 mt-1">Teacher Portal</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Teacher Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6292b1] to-[#4981a5] flex items-center justify-center text-white">
                {teacherName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{teacherName}</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                    ${isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    relative overflow-hidden group
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#6292b1]"></span>
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-gray-900">SmartLearn</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
