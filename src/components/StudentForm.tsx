import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface StudentFormProps {
  student?: any;
  classes: any[];
  onSave: (studentData: any) => Promise<void>;
  onClose: () => void;
}

export function StudentForm({ student, classes, onSave, onClose }: StudentFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    email: '',
    class_id: '',
    guardian_name: '',
    guardian_contact: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        gender: student.gender || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
        phone_number: student.phone_number || '',
        email: student.email || '',
        class_id: student.class_id || '',
        guardian_name: student.guardian_name || '',
        guardian_contact: student.guardian_contact || '',
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        throw new Error('First name and last name are required');
      }

      // Convert class_id to number if it exists
      const dataToSave = {
        ...formData,
        class_id: formData.class_id ? parseInt(formData.class_id) : null,
      };

      await onSave(dataToSave);
      onClose();
    } catch (err: any) {
      console.error('Error saving student:', err);
      setError(err.message || 'Failed to save student');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Class</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} (Year {cls.year_level})
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Guardian Name</label>
              <input
                type="text"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Guardian Contact */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Guardian Contact</label>
              <input
                type="tel"
                name="guardian_contact"
                value={formData.guardian_contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              disabled={saving}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#2ac8d2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">{saving ? 'Saving...' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
