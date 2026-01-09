import { useState } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { User, Bell, Shield, Palette, ChevronLeft, Save, Moon, Sun, Smartphone, Mail, Globe } from 'lucide-react';

interface TeacherSettingsProps {
    onNavigate: (page: string) => void;
    onLogout: () => void;
    teacherName?: string;
}

export function TeacherSettings({ onNavigate, onLogout, teacherName }: TeacherSettingsProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true
    });

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
            description: 'Password and login sessions',
            color: '#c5a988'
        },
        {
            id: 'appearance',
            title: 'Appearance',
            icon: Palette,
            description: 'Theme preferences',
            color: '#6292b1'
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" defaultValue="Sarah" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" defaultValue="Johnson" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" defaultValue="sarah.johnson@smartlearn.com" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input type="text" defaultValue="Teacher" disabled className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input type="text" defaultValue="Mathematics" className="w-full p-2 border border-gray-300 rounded focus:border-[#2ac8d2] focus:outline-none" />
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
            default:
                return null;
        }
    };

    return (
        <TeacherLayout
            currentPage="teacher-settings"
            onNavigate={onNavigate}
            onLogout={onLogout}
            teacherName={teacherName}
        >
            <div className="p-4 lg:p-8 max-w-4xl mx-auto">
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
                    </>
                )}
            </div>
        </TeacherLayout>
    );
}
