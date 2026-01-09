import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Book, Plus, Search, Trash2 } from 'lucide-react';
import { subjectAPI } from '../utils/api';
import { SubjectForm } from './SubjectForm';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings' | 'subjects';

interface SubjectsProps {
    onNavigate: (screen: Screen) => void;
    onLogout: () => void;
}

export function Subjects({ onNavigate, onLogout }: SubjectsProps) {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const { subjects: data } = await subjectAPI.getAll();
            setSubjects(data || []);
        } catch (err: any) {
            console.error('Error loading subjects:', err);
            setError('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        try {
            await subjectAPI.delete(id);
            await loadSubjects();
        } catch (err: any) {
            alert('Failed to delete subject: ' + err.message);
        }
    };

    const filteredSubjects = subjects.filter(sub =>
        sub.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subject_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Subject Management"
            currentScreen="subjects"
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
                            placeholder="Search subjects by name or code..."
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
                        <span className="relative">Add Subject</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading subjects...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                        <p className="font-medium">Error loading subjects</p>
                        <p className="text-sm mt-1">{error}</p>
                        <button onClick={loadSubjects} className="mt-3 text-sm underline hover:no-underline">Try again</button>
                    </div>
                )}

                {/* Subjects Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No subjects found
                            </div>
                        ) : (
                            filteredSubjects.map((sub) => (
                                <div key={sub.subject_id} className="bg-white border border-gray-200 rounded p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#f6ad55]"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{sub.subject_name}</h3>
                                            <p className="text-gray-600 font-mono text-sm">{sub.subject_code}</p>
                                        </div>
                                        <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
                                            <Book size={20} />
                                        </div>
                                    </div>

                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-4 right-14">
                                        <button
                                            onClick={() => handleDelete(sub.subject_id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            title="Delete Subject"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {showForm && (
                <SubjectForm
                    onSave={async (data) => {
                        await subjectAPI.create(data);
                        await loadSubjects();
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </AdminLayout>
    );
}
