import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { DatabaseSetupNotice } from './DatabaseSetupNotice';
import { StudentForm } from './StudentForm';
import { Search, Plus } from 'lucide-react';
import { studentAPI, classAPI, seedData } from '../utils/api';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';

interface StudentListProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function StudentList({ onNavigate, onLogout }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const { classes: data } = await classAPI.getAll();
      setClasses(data || []);
    } catch (err: any) {
      console.error('Error loading classes:', err);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const { students: data } = await studentAPI.getAll();
      setStudents(data || []);

      // If no students, seed the database
      if (!data || data.length === 0) {
        await seedData();
        const { students: seededData } = await studentAPI.getAll();
        setStudents(seededData || []);
      }
    } catch (err: any) {
      console.error('Error loading students:', err);

      // Check if it's a "table not found" error
      if (err.message?.includes('Could not find the table') || err.message?.includes('PGRST205')) {
        setError('DATABASE_NOT_SETUP');
      } else {
        setError(err.message || 'Failed to load students');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentAPI.delete(id);
      await loadStudents();
    } catch (err: any) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student');
    }
  };

  const handleSaveStudent = async (studentData: any) => {
    if (editingStudent) {
      await studentAPI.update(editingStudent.student_id, studentData);
    } else {
      await studentAPI.create(studentData);
    }
    await loadStudents();
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student => {
    const studentClass = classes.find(c => c.class_id === student.class_id);
    const className = studentClass?.class_name?.toLowerCase() || '';

    return (
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      className.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout
      title="Student Management"
      currentScreen="students"
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
              placeholder="Search students by name, email, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded whitespace-nowrap flex items-center gap-2 transition-colors relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2ac8d2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Plus size={20} className="relative" />
            <span className="relative">Add Student</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        )}

        {/* Error State */}
        {error && error !== 'DATABASE_NOT_SETUP' && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p className="font-medium">Error loading students</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={loadStudents}
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

        {/* Students Table */}
        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No students found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'Add your first student to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 text-gray-700 text-sm">ID</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Name</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Class</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Email</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Contact</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Guardian</th>
                      <th className="text-left p-4 text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const studentClass = classes.find(c => c.class_id === student.class_id);
                      return (
                        <tr key={student.student_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-700 text-sm">STU{String(student.student_id).padStart(4, '0')}</td>
                          <td className="p-4">
                            <div className="text-gray-900">{student.first_name} {student.last_name}</div>
                            {student.gender && <div className="text-gray-500 text-sm">{student.gender}</div>}
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm border-l-2 border-[#2ac8d2]">
                              {studentClass?.class_name || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-700 text-sm">{student.email || '-'}</td>
                          <td className="p-4 text-gray-700 text-sm">{student.phone_number || '-'}</td>
                          <td className="p-4">
                            <div className="text-gray-900 text-sm">{student.guardian_name || '-'}</div>
                            {student.guardian_contact && (
                              <div className="text-gray-500 text-xs">{student.guardian_contact}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(student)}
                                className="text-gray-600 hover:text-gray-900 transition-colors text-sm px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(student.student_id)}
                                className="text-red-600 hover:text-red-700 transition-colors text-sm px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {!loading && !error && students.length > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <div>
              Total Students: <span className="text-gray-900">{students.length}</span>
            </div>
            {searchTerm && (
              <div>
                Filtered Results: <span className="text-gray-900">{filteredStudents.length}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          classes={classes}
          onSave={handleSaveStudent}
          onClose={handleCloseForm}
        />
      )}
    </AdminLayout>
  );
}