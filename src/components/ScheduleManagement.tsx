import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, X } from 'lucide-react';
import { classAPI, teacherAPI, timetableAPI, subjectAPI } from '../utils/api';

type Screen = 'login' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'timetable' | 'settings';
type UserRole = 'admin' | 'teacher';

interface ScheduleManagementProps {
  role: UserRole;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00:00',
  '10:00:00',
  '11:00:00',
  '12:00:00',
  '13:00:00',
  '14:00:00',
  '15:00:00',
];

export function ScheduleManagement({ role, onNavigate, onLogout }: ScheduleManagementProps) {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '09:00',
    subject_id: '',
    teacher_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classData, teacherData, subjectData] = await Promise.all([
          classAPI.getAll(),
          teacherAPI.getAll(),
          subjectAPI.getAll()
        ]);
        setClasses(classData.classes);
        setTeachers(teacherData.teachers);
        setSubjects(subjectData.subjects);
        if (classData.classes.length > 0) {
          setSelectedClassId(String(classData.classes[0].class_id)); // Ensure string for select value
        }
        if (subjectData.subjects.length > 0) {
          setFormData(prev => ({ ...prev, subject_id: subjectData.subjects[0].subject_id }));
        }
        if (teacherData.teachers.length > 0) {
          setFormData(prev => ({ ...prev, teacher_id: teacherData.teachers[0].teacher_id }));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    const fetchTimetable = async () => {
      try {
        const data = await timetableAPI.get(selectedClassId);
        setTimetable(data.timetable);
      } catch (err: any) {
        console.error('Error fetching timetable:', err);
      }
    };
    fetchTimetable();
  }, [selectedClassId]);

  if (role !== 'admin') {
    return <div>Teacher view not implemented</div>;
  }

  const getEntry = (day: string, time: string) => {
    // Simple matching logic - in production use proper time comparison libraries
    // Database stores '09:00:00', we compare prefix
    return timetable.find(t =>
      t.day_of_week === day &&
      t.start_time.startsWith(time.substring(0, 5))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedClassId) return;

      await timetableAPI.save(selectedClassId, {
        ...formData,
        end_time: calculateEndTime(formData.start_time)
      });

      // Refresh timetable
      const data = await timetableAPI.get(selectedClassId);
      setTimetable(data.timetable);
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error saving timetable entry: ' + err.message);
    }
  };

  const calculateEndTime = (startTime: string) => {
    // Determine end time (default 1 hour duration)
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setHours(date.getHours() + 1);
    return date.toTimeString().substring(0, 5);
  };

  return (
    <AdminLayout
      title="Timetable Management"
      currentScreen="timetable"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Class Selection */}
        <div className="bg-white border border-gray-200 rounded p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4 text-gray-900 dark:text-white">Timetable Selection</h2>
          <div className="max-w-md">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 text-sm">Select Class</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 focus:border-gray-900 focus:outline-none transition-colors dark:bg-gray-700 dark:text-white"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 overflow-x-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-gray-900 dark:text-white">Weekly Timetable</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Plus size={16} />
              <span>Add Class</span>
            </button>
          </div>

          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">Time</div>
              {daysOfWeek.map((day) => (
                <div key={day} className="p-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-sm text-gray-900 dark:text-white">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((slot, slotIndex) => (
              <div
                key={slot}
                className={`grid grid-cols-6 ${slotIndex !== timeSlots.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  {slot.substring(0, 5)}
                </div>
                {daysOfWeek.map((day) => {
                  const entry = getEntry(day, slot);
                  return (
                    <div
                      key={`${day}-${slot}`}
                      className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                    >
                      {entry ? (
                        <div className="border border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#4981a5] rounded-l"></div>
                          <div className="mb-1 text-gray-900 dark:text-white text-sm pl-2">{entry.subject}</div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs pl-2">{entry.teacher}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full min-h-[60px]"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Add Class Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Class Session</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                  <select
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.day_of_week}
                    onChange={e => setFormData({ ...formData, day_of_week: e.target.value })}
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <select
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.start_time}
                    onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time.substring(0, 5)}>{time.substring(0, 5)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.subject_id}
                    onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher</label>
                  <select
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.teacher_id}
                    onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.teacher_id} value={t.teacher_id}>{t.first_name} {t.last_name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-gray-900 rounded hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
                  >
                    Save Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </AdminLayout >
  );
}