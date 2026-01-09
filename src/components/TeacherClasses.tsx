import { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { Users, Search, BookOpen } from 'lucide-react';

interface TeacherClassesProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  role?: string;
  teacherId?: string;
}

export function TeacherClasses({ onNavigate, onLogout, role, teacherId }: TeacherClassesProps) {
  const [teacherData, setTeacherData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from API
    setTeacherData({
      first_name: 'Sarah',
      last_name: 'Johnson',
      department: 'Mathematics',
    });

    setClasses([
      {
        class_id: 1,
        class_name: 'Year 10 A',
        subject: 'Mathematics',
        year_level: 10,
        student_count: 28,
      },
      {
        class_id: 2,
        class_name: 'Year 11 B',
        subject: 'Algebra',
        year_level: 11,
        student_count: 24,
      },
      {
        class_id: 3,
        class_name: 'Year 9 C',
        subject: 'Mathematics',
        year_level: 9,
        student_count: 26,
      },
      {
        class_id: 4,
        class_name: 'Year 12 A',
        subject: 'Calculus',
        year_level: 12,
        student_count: 22,
      },
      {
        class_id: 5,
        class_name: 'Year 11 A',
        subject: 'Statistics',
        year_level: 11,
        student_count: 25,
      },
    ]);

    setLoading(false);
  }, [teacherId]);

  const handleClassClick = (classItem: any) => {
    setSelectedClass(classItem);
    
    // Mock student data for the selected class
    const mockStudents = Array.from({ length: classItem.student_count }, (_, i) => ({
      student_id: i + 1,
      first_name: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason'][i % 8],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
      email: `student${i + 1}@smartlearn.com`,
      phone_number: `555-${String(i + 1).padStart(4, '0')}`,
    }));
    
    setStudents(mockStudents);
    setSearchTerm('');
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           student.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <TeacherLayout
      currentPage="teacher-classes"
      onNavigate={onNavigate}
      onLogout={onLogout}
      teacherName={teacherData ? `${teacherData.first_name} ${teacherData.last_name}` : 'Teacher'}
    >
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">My Classes</h1>
          <p className="text-gray-600">View and manage your class lists</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-gray-900">Your Classes ({classes.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {classes.map((classItem) => (
                  <button
                    key={classItem.class_id}
                    onClick={() => handleClassClick(classItem)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedClass?.class_id === classItem.class_id ? 'bg-[#6292b1]/5 border-l-2 border-[#6292b1]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 mb-1">{classItem.class_name}</p>
                        <p className="text-sm text-gray-600 mb-1">{classItem.subject}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users size={12} />
                          <span>{classItem.student_count} students</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          Year {classItem.year_level}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="lg:col-span-2">
            {selectedClass ? (
              <div className="bg-white rounded-lg border border-gray-200">
                {/* Class Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-gray-900 mb-1">{selectedClass.class_name}</h2>
                      <p className="text-sm text-gray-600">{selectedClass.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{selectedClass.student_count} students</span>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600">#</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600">Email</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.map((student, index) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2ac8d2] to-[#6292b1] flex items-center justify-center text-white text-xs">
                                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                              </div>
                              <span className="text-gray-900">
                                {student.first_name} {student.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.phone_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No students found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Select a class to view students</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}