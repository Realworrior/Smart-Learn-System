import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { BookOpen, Plus, Search, Users } from 'lucide-react';
import { classAPI } from '../utils/api';
import { ClassForm } from './ClassForm';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';

interface ClassesProps {
    onNavigate: (screen: Screen) => void;
    onLogout: () => void;
}

export function Classes({ onNavigate, onLogout }: ClassesProps) {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const { classes: data } = await classAPI.getAll();
            setClasses(data || []);
        } catch (err: any) {
            console.error('Error loading classes:', err);
            setError('Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Class Management"
            currentScreen="classes"
            onNavigate={onNavigate}
            onLogout={onLogout}
        >
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search classes by name or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded whitespace-nowrap flex items-center gap-2 transition-colors relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#2ac8d2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <Plus size={20} className="relative" />
                        <span className="relative">Add Class</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading classes...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                        <p className="font-medium">Error loading classes</p>
                        <p className="text-sm mt-1">{error}</p>
                        <button onClick={loadClasses} className="mt-3 text-sm underline hover:no-underline">Try again</button>
                    </div>
                )}

                {/* Classes Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClasses.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No classes found
                            </div>
                        ) : (
                            filteredClasses.map((cls) => (
                                <div key={cls.class_id} className="bg-white border border-gray-200 rounded p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#6292b1]"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{cls.class_name}</h3>
                                            <p className="text-gray-600">{cls.subject}</p>
                                        </div>
                                        <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                                        <Users size={16} />
                                        <span>{cls.student_count || 0} Students</span>
                                        <span className="mx-2">•</span>
                                        <span>Year {cls.year_level}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {showForm && (
                <ClassForm
                    onSave={async (data) => {
                        await classAPI.create(data);
                        await loadClasses();
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </AdminLayout>
    );
}
