import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TeacherFormProps {
  teacher?: any;
  onSave: (teacherData: any) => Promise<void>;
  onClose: () => void;
}

export function TeacherForm({ teacher, onSave, onClose }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    department: '',
    qualification: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        first_name: teacher.first_name || '',
        last_name: teacher.last_name || '',
        email: teacher.email || '',
        phone_number: teacher.phone_number || '',
        department: teacher.department || '',
        qualification: teacher.qualification || '',
      });
    }
  }, [teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email) {
        throw new Error('First name, last name, and email are required');
      }

      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error('Error saving teacher:', err);
      setError(err.message || 'Failed to save teacher');
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
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
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

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            {/* Department */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Science"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., PhD Mathematics, MSc Physics"
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
              <span className="absolute inset-0 bg-gradient-to-r from-[#c5a988]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">{saving ? 'Saving...' : 'Save Teacher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
