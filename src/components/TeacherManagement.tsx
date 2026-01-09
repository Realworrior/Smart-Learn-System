import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { DatabaseSetupNotice } from './DatabaseSetupNotice';
import { TeacherForm } from './TeacherForm';
import { Search, Plus } from 'lucide-react';
import { teacherAPI } from '../utils/api';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';

interface TeacherManagementProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function TeacherManagement({ onNavigate, onLogout }: TeacherManagementProps) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const { teachers: data } = await teacherAPI.getAll();
      setTeachers(data || []);
    } catch (err: any) {
      console.error('Error loading teachers:', err);
      
      // Check if it's a "table not found" error
      if (err.message?.includes('Could not find the table') || err.message?.includes('PGRST205')) {
        setError('DATABASE_NOT_SETUP');
      } else {
        setError(err.message || 'Failed to load teachers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      await teacherAPI.delete(id);
      await loadTeachers();
    } catch (err: any) {
      console.error('Error deleting teacher:', err);
      alert('Failed to delete teacher');
    }
  };

  const handleSaveTeacher = async (teacherData: any) => {
    if (editingTeacher) {
      await teacherAPI.update(editingTeacher.teacher_id, teacherData);
    } else {
      await teacherAPI.create(teacherData);
    }
    await loadTeachers();
  };

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout 
      title="Teacher Management" 
      currentScreen="teachers"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teachers by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#c5a988]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Plus size={20} className="relative" />
            <span className="relative">Add Teacher</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading teachers...</p>
          </div>
        )}

        {/* Error State */}
        {error && error !== 'DATABASE_NOT_SETUP' && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p className="font-medium">Error loading teachers</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={loadTeachers}
              className="mt-3 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Database Setup Notice */}
        {error === 'DATABASE_NOT_SETUP' && !loading && (
          <DatabaseSetupNotice />
        )}

        {/* Teachers Grid */}
        {!loading && !error && (
          <>
            {filteredTeachers.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded text-center py-12">
                <p className="text-gray-500">No teachers found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'Add your first teacher to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.teacher_id}
                    className="bg-white border border-gray-200 rounded p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Teacher Info */}
                    <div className="mb-4">
                      <h3 className="text-gray-900 mb-1">
                        {teacher.first_name} {teacher.last_name}
                      </h3>
                      <p className="text-gray-500 text-sm">ID: TCH{String(teacher.teacher_id).padStart(4, '0')}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-gray-500 text-sm mb-1">Department</div>
                        <div className="bg-gray-100 text-gray-900 px-3 py-1 inline-block rounded text-sm border-l-2 border-[#c5a988]">
                          {teacher.department || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 text-sm mb-1">Qualification</div>
                        <div className="text-gray-900 text-sm">{teacher.qualification || 'N/A'}</div>
                      </div>

                      <div>
                        <div className="text-gray-500 text-sm mb-1">Email</div>
                        <div className="text-gray-700 text-sm">{teacher.email}</div>
                      </div>

                      <div>
                        <div className="text-gray-500 text-sm mb-1">Contact</div>
                        <div className="text-gray-700 text-sm">{teacher.phone_number || '-'}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button 
                        onClick={() => handleEdit(teacher)}
                        className="flex-1 text-gray-600 hover:text-gray-900 transition-colors text-sm py-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.teacher_id)}
                        className="flex-1 text-red-600 hover:text-red-700 transition-colors text-sm py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && !error && teachers.length > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <div>
              Total Teachers: <span className="text-gray-900">{teachers.length}</span>
            </div>
            {searchTerm && (
              <div>
                Filtered Results: <span className="text-gray-900">{filteredTeachers.length}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teacher Form */}
      {showForm && (
        <TeacherForm
          teacher={editingTeacher}
          onSave={handleSaveTeacher}
          onClose={handleCloseForm}
        />
      )}
    </AdminLayout>
  );
}