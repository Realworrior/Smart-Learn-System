import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ClassFormProps {
    classItem?: any;
    onSave: (classData: any) => Promise<void>;
    onClose: () => void;
}

export function ClassForm({ classItem, onSave, onClose }: ClassFormProps) {
    const [formData, setFormData] = useState({
        class_name: '',
        subject: '',
        year_level: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (classItem) {
            setFormData({
                class_name: classItem.class_name || '',
                subject: classItem.subject || '',
                year_level: classItem.year_level || '',
            });
        }
    }, [classItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (!formData.class_name || !formData.subject || !formData.year_level) {
                throw new Error('All fields are required');
            }

            await onSave({
                ...formData,
                year_level: parseInt(formData.year_level.toString()),
            });
            onClose();
        } catch (err: any) {
            console.error('Error saving class:', err);
            setError(err.message || 'Failed to save class');
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {classItem ? 'Edit Class' : 'Add New Class'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Class Name
                        </label>
                        <input
                            type="text"
                            name="class_name"
                            value={formData.class_name}
                            onChange={handleChange}
                            placeholder="e.g. Class 10-A"
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="e.g. Mathematics"
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year Level
                        </label>
                        <input
                            type="number"
                            name="year_level"
                            value={formData.year_level}
                            onChange={handleChange}
                            placeholder="e.g. 10"
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                            required
                            min="1"
                            max="13"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
