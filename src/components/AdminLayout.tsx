import { useState } from 'react';
import { LogOut, Users, UserCheck, BookOpen, Calendar, Settings, LayoutDashboard, Menu, X } from 'lucide-react';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings' | 'subjects';

interface AdminLayoutProps {
  title: string;
  currentScreen: Screen;
  children: React.ReactNode;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function AdminLayout({ title, currentScreen, children, onNavigate, onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', screen: 'dashboard' as Screen },
    { icon: Users, label: 'Students', screen: 'students' as Screen },
    { icon: UserCheck, label: 'Teachers', screen: 'teachers' as Screen },
    { icon: BookOpen, label: 'Classes', screen: 'classes' as Screen },
    { icon: BookOpen, label: 'Subjects', screen: 'subjects' as Screen },
    { icon: Calendar, label: 'Timetable', screen: 'timetable' as Screen },
    { icon: Settings, label: 'Settings', screen: 'settings' as Screen },
  ];

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Side Navigation Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Mobile Close */}
          <div className="p-6 border-b border-gray-200 relative flex justify-between items-center">
            <div>
              <div className="absolute top-0 left-0 w-1 h-full bg-[#2ac8d2]"></div>
              <h2 className="text-gray-900 font-semibold">SmartLearn</h2>
              <p className="text-gray-500 text-sm">Admin Panel</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.screen;
                return (
                  <li key={item.screen}>
                    <button
                      onClick={() => handleNavigate(item.screen)}
                      className={`w-full flex items-center gap-3 p-3 rounded transition-colors relative ${isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2ac8d2] rounded-r"></span>}
                      <Icon size={20} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 sticky top-0 z-30 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <div className="relative flex-1">
            <h1 className="text-gray-900 text-lg md:text-xl font-semibold">{title}</h1>
            <div className="absolute -bottom-6 left-0 w-16 h-0.5 bg-gradient-to-r from-[#2ac8d2] to-transparent hidden md:block"></div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}