import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { User, Bell, Shield, Palette, Database, ChevronLeft, Save, Moon, Sun, Smartphone, Mail, Globe } from 'lucide-react';
import { authAPI } from '../utils/api';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';

interface SettingsProps {
    onNavigate: (screen: Screen) => void;
    onLogout: () => void;
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });
    const [userEmail, setUserEmail] = useState('admin@smartlearn.com');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await authAPI.getSession();
                if (session?.user?.email) {
                    setUserEmail(session.user.email);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const sections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: User,
            description: 'Manage your personal information and preferences',
            color: '#2ac8d2'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: Bell,
            description: 'Configure email and push notification settings',
            color: '#fea37b'
        },
        {
            id: 'security',
            title: 'Security',
            icon: Shield,
            description: 'Password, two-factor authentication, and login sessions',
            color: '#c5a988'
        },
        {
            id: 'appearance',
            title: 'Appearance',
            icon: Palette,
            description: 'Theme preferences and accessibility options',
            color: '#6292b1'
        },
        {
            id: 'system',
            title: 'Database & System',
            icon: Database,
            description: 'System backups, data export, and maintenance',
            color: '#374151'
        }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" defaultValue="Admin User" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" value={userEmail} disabled className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input type="text" defaultValue="Administrator" disabled className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-gray-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded text-sm">
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-gray-500" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">Email Notifications</p>
                                            <p className="text-gray-500">Receive daily summaries and alerts</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifications.email} onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2ac8d2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2ac8d2]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded text-sm">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-gray-500" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">Push Notifications</p>
                                            <p className="text-gray-500">Receive real-time alerts on your device</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifications.push} onChange={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2ac8d2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2ac8d2]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded text-sm">
                                    <div className="flex items-center gap-3">
                                        <Globe className="text-gray-500" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">System Updates</p>
                                            <p className="text-gray-500">Notify me about system maintenance</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifications.updates} onChange={() => setNotifications(prev => ({ ...prev, updates: !prev.updates }))} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2ac8d2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2ac8d2]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <button className="bg-gray-900 text-white px-4 py-2 rounded w-full hover:bg-gray-800">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Theme Preferences</h3>
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${theme === 'light' ? 'border-[#2ac8d2] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <Sun size={24} className={theme === 'light' ? 'text-[#2ac8d2]' : 'text-gray-400'} />
                                    <span className={`font-medium ${theme === 'light' ? 'text-[#2ac8d2]' : 'text-gray-600'}`}>Light Mode</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-[#2ac8d2] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <Moon size={24} className={theme === 'dark' ? 'text-[#2ac8d2]' : 'text-gray-400'} />
                                    <span className={`font-medium ${theme === 'dark' ? 'text-[#2ac8d2]' : 'text-gray-600'}`}>Dark Mode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'system':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium mb-4">System Maintenance</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">Backup Data</p>
                                        <p className="text-sm text-gray-500">Create a full backup of the system database</p>
                                    </div>
                                    <button onClick={() => alert('Backup started...')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded">
                                        Backup Now
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">Export Records</p>
                                        <p className="text-sm text-gray-500">Download all student and teacher records as CSV</p>
                                    </div>
                                    <button onClick={() => alert('Exporting data...')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded">
                                        Export CSV
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded">
                                    <div>
                                        <p className="font-medium text-red-900">Reset System</p>
                                        <p className="text-sm text-red-700">Clear all data and reset to factory settings</p>
                                    </div>
                                    <button onClick={() => confirm('Are you sure? This cannot be undone.')} className="text-sm bg-white border border-red-200 text-red-700 hover:bg-red-50 px-3 py-2 rounded">
                                        Reset All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout
            title={activeSection ? sections.find(s => s.id === activeSection)?.title || 'Settings' : 'Settings'}
            currentScreen="settings"
            onNavigate={onNavigate}
            onLogout={onLogout}
        >
            <div className="max-w-4xl mx-auto">
                {activeSection ? (
                    <div>
                        <button
                            onClick={() => setActiveSection(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span>Back to Settings</span>
                        </button>
                        {renderContent()}
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Preferences</h2>
                            <p className="text-gray-600">Manage your account settings and set e-mail preferences.</p>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className="w-full text-left bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-all group flex items-start gap-4"
                                    >
                                        <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                            <Icon size={24} style={{ color: section.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-[#2ac8d2] transition-colors">{section.title}</h3>
                                            <p className="text-gray-500">{section.description}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Info</h2>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span>Version</span>
                                    <span className="font-medium text-gray-900">1.0.0</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Build</span>
                                    <span className="font-medium text-gray-900">2024.12.01</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
