import { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { teacherAPI, timetableAPI } from '../utils/api';
import { Clock } from 'lucide-react';

interface TeacherScheduleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  role?: string;
  teacherId?: string;
}

export function TeacherSchedule({ onNavigate, onLogout, role, teacherId }: TeacherScheduleProps) {
  const [teacherData, setTeacherData] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // Simulate auth - get first teacher or use ID
        const { teachers } = await teacherAPI.getAll();
        const me = teacherId ? teachers.find((t: any) => t.teacher_id == teacherId) : teachers[0];

        if (me) {
          setTeacherData(me);

          const { timetable } = await timetableAPI.getForTeacher(me.teacher_id);

          // Transform array to object map
          const scheduleMap: any = {};
          timetable.forEach((t: any) => {
            const day = t.day_of_week;
            // Match start time to slot - simplistic matching
            const startPrefix = t.start_time.substring(0, 5);
            const slot = timeSlots.find(s => s.startsWith(startPrefix));

            if (slot) {
              if (!scheduleMap[day]) scheduleMap[day] = {};
              scheduleMap[day][slot] = {
                subject: t.subject,
                class: t.class,
                room: 'Room ' + ((t.class_id % 10) + 100) // Mock room based on ID
              };
            }
          });
          setSchedule(scheduleMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [teacherId]);

  return (
    <TeacherLayout
      currentPage="teacher-schedule"
      onNavigate={onNavigate}
      onLogout={onLogout}
      teacherName={teacherData ? `${teacherData.first_name} ${teacherData.last_name}` : 'Teacher'}
    >
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">My Schedule</h1>
          <p className="text-gray-600">Your weekly teaching timetable</p>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm text-gray-700 w-32">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>Time</span>
                    </div>
                  </th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-3 text-left text-sm text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-gray-600 bg-gray-50 align-top">
                      {time}
                    </td>
                    {days.map((day) => {
                      const classData = schedule[day]?.[time];

                      return (
                        <td
                          key={`${day}-${time}`}
                          className="px-4 py-3 align-top"
                        >
                          {classData ? (
                            <div className="p-3 rounded-lg bg-gradient-to-br from-[#6292b1]/10 to-[#4981a5]/10 border border-[#6292b1]/20 hover:border-[#6292b1] transition-all group cursor-pointer">
                              <div className="mb-1">
                                <p className="text-sm text-gray-900">{classData.subject}</p>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{classData.class}</p>
                              <p className="text-xs text-gray-500">{classData.room}</p>
                            </div>
                          ) : (
                            <div className="h-full min-h-[60px]"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#6292b1]/10 to-[#4981a5]/10 border border-[#6292b1]/20"></div>
            <span>Scheduled Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
            <span>Free Period</span>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}