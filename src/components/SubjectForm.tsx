import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SubjectFormProps {
    subjectItem?: any;
    onSave: (subjectData: any) => Promise<void>;
    onClose: () => void;
}

export function SubjectForm({ subjectItem, onSave, onClose }: SubjectFormProps) {
    const [formData, setFormData] = useState({
        subject_name: '',
        subject_code: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subjectItem) {
            setFormData({
                subject_name: subjectItem.subject_name || '',
                subject_code: subjectItem.subject_code || '',
            });
        }
    }, [subjectItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (!formData.subject_name || !formData.subject_code) {
                throw new Error('All fields are required');
            }

            await onSave(formData);
            onClose();
        } catch (err: any) {
            console.error('Error saving subject:', err);
            setError(err.message || 'Failed to save subject. Make sure code is unique.');
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {subjectItem ? 'Edit Subject' : 'Add New Subject'}
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
                            Subject Name
                        </label>
                        <input
                            type="text"
                            name="subject_name"
                            value={formData.subject_name}
                            onChange={handleChange}
                            placeholder="e.g. Mathematics"
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Code
                        </label>
                        <input
                            type="text"
                            name="subject_code"
                            value={formData.subject_code}
                            onChange={handleChange}
                            placeholder="e.g. MATH"
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none"
                            required
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
                            {saving ? 'Saving...' : 'Save Subject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
