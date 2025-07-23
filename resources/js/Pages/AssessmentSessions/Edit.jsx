import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ assessmentSession, employees, evaluationInstruments }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: assessmentSession.employee_id,
        evaluation_instrument_id: assessmentSession.evaluation_instrument_id,
        is_education: assessmentSession.is_education,
        subject: assessmentSession.subject || '',
        material: assessmentSession.material || '',
        start_time: assessmentSession.start_time ? assessmentSession.start_time.slice(0, 16) : '',
        end_time: assessmentSession.end_time ? assessmentSession.end_time.slice(0, 16) : '',
        description: assessmentSession.description || '',
    });

    const [isEducation, setIsEducation] = useState(assessmentSession.is_education);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('assessment-sessions.update', assessmentSession.id));
    };

    const handleEducationChange = (checked) => {
        setIsEducation(checked);
        setData('is_education', checked);
        if (!checked) {
            setData(prev => ({
                ...prev,
                subject: '',
                material: ''
            }));
        }
    };

    return (
        <AdminLayout title="Edit Assessment Session">
            <Head title="Edit Assessment Session" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Edit Assessment Session</h3>
                        <Link
                            href={route('assessment-sessions.show', assessmentSession.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Employee Selection */}
                        <div>
                            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Karyawan yang Dinilai *
                            </label>
                            <select
                                id="employee_id"
                                value={data.employee_id}
                                onChange={(e) => setData('employee_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Pilih Karyawan</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.full_name} - {employee.employee_number}
                                        {employee.division && ` (${employee.division.name})`}
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
                            )}
                        </div>

                        {/* Evaluation Instrument Selection */}
                        <div>
                            <label htmlFor="evaluation_instrument_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Instrumen Evaluasi *
                            </label>
                            <select
                                id="evaluation_instrument_id"
                                value={data.evaluation_instrument_id}
                                onChange={(e) => setData('evaluation_instrument_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Pilih Instrumen Evaluasi</option>
                                {evaluationInstruments.map((instrument) => (
                                    <option key={instrument.id} value={instrument.id}>
                                        {instrument.name}
                                        {instrument.description && ` - ${instrument.description}`}
                                    </option>
                                ))}
                            </select>
                            {errors.evaluation_instrument_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.evaluation_instrument_id}</p>
                            )}
                        </div>

                        {/* Education Checkbox */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    id="is_education"
                                    type="checkbox"
                                    checked={isEducation}
                                    onChange={(e) => handleEducationChange(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_education" className="ml-2 block text-sm text-gray-900">
                                    Apakah ini untuk pendidikan/pelatihan?
                                </label>
                            </div>
                            <p className="mt-1 text-xs text-gray-600">
                                Centang jika assessment ini terkait dengan kegiatan pendidikan atau pelatihan
                            </p>
                        </div>

                        {/* Education Fields (conditional) */}
                        {isEducation && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mata Pelajaran *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: Matematika, Bahasa Indonesia"
                                        required={isEducation}
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                                        Materi *
                                    </label>
                                    <input
                                        type="text"
                                        id="material"
                                        value={data.material}
                                        onChange={(e) => setData('material', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: Aljabar Linear, Tata Bahasa"
                                        required={isEducation}
                                    />
                                    {errors.material && (
                                        <p className="mt-1 text-sm text-red-600">{errors.material}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Waktu Mulai *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start_time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.start_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Waktu Selesai *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="end_time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.end_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Deskripsi tambahan tentang assessment session ini..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Link
                                href={route('assessment-sessions.show', assessmentSession.id)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {processing && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Update Assessment Session
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
