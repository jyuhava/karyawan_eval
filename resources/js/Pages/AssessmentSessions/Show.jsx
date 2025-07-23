import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ assessmentSession }) {
    const [activeTab, setActiveTab] = useState('assessment');
    const [results, setResults] = useState(() => {
        // Initialize results from existing data
        const initialResults = {};
        if (assessmentSession.results) {
            assessmentSession.results.forEach(result => {
                initialResults[result.evaluation_indicator_id] = {
                    numeric_value: result.numeric_value || '',
                    text_value: result.text_value || '',
                    note: result.note || '',
                    recommendation: result.recommendation || ''
                };
            });
        }
        return initialResults;
    });

    const { data: docData, setData: setDocData, post: postDoc, processing: processingDoc } = useForm({
        files: [],
        descriptions: []
    });

    const handleResultChange = (indicatorId, field, value) => {
        setResults(prev => ({
            ...prev,
            [indicatorId]: {
                ...prev[indicatorId],
                [field]: value
            }
        }));
    };

    const saveResults = () => {
        const resultsArray = Object.entries(results).map(([indicatorId, values]) => ({
            evaluation_indicator_id: parseInt(indicatorId),
            ...values
        }));

        router.post(route('assessment-sessions.save-results', assessmentSession.id), {
            results: resultsArray
        });
    };

    const toggleStatus = () => {
        if (assessmentSession.status === 'draft') {
            router.patch(route('assessment-sessions.publish', assessmentSession.id));
        } else {
            router.patch(route('assessment-sessions.unpublish', assessmentSession.id));
        }
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Array.from(docData.files).forEach((file, index) => {
            formData.append(`files[${index}]`, file);
            formData.append(`descriptions[${index}]`, docData.descriptions[index] || '');
        });

        router.post(route('assessment-sessions.upload-documentation', assessmentSession.id), formData, {
            forceFormData: true,
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        const labels = {
            draft: 'Draft',
            published: 'Published',
            completed: 'Completed',
        };
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <AdminLayout title={`Assessment Session - ${assessmentSession.employee.full_name}`}>
            <Head title={`Assessment Session - ${assessmentSession.employee.full_name}`} />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Assessment Session - {assessmentSession.employee.full_name}
                                </h3>
                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                                    <span>Instrumen: {assessmentSession.evaluation_instrument.name}</span>
                                    <span>•</span>
                                    <span>Assessor: {assessmentSession.assessor.name}</span>
                                    <span>•</span>
                                    {getStatusBadge(assessmentSession.status)}
                                </div>
                                {assessmentSession.is_education && (
                                    <div className="mt-1 text-sm text-blue-600">
                                        📚 {assessmentSession.subject} - {assessmentSession.material}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={toggleStatus}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        assessmentSession.status === 'draft'
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                    }`}
                                >
                                    {assessmentSession.status === 'draft' ? 'Publish' : 'Unpublish'}
                                </button>
                                {assessmentSession.status === 'draft' && (
                                    <Link
                                        href={route('assessment-sessions.edit', assessmentSession.id)}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Edit
                                    </Link>
                                )}
                                <Link
                                    href={route('assessment-sessions.index')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('assessment')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'assessment'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Penilaian
                            </button>
                            <button
                                onClick={() => setActiveTab('documentation')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'documentation'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Dokumentasi
                                {assessmentSession.documentations && assessmentSession.documentations.length > 0 && (
                                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                                        {assessmentSession.documentations.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'info'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Informasi
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Assessment Tab */}
                        {activeTab === 'assessment' && (
                            <div>
                                {assessmentSession.evaluation_instrument.categories && assessmentSession.evaluation_instrument.categories.length > 0 ? (
                                    <div className="space-y-8">
                                        {assessmentSession.evaluation_instrument.categories.map((category, categoryIndex) => (
                                            <div key={category.id} className="bg-gray-50 rounded-lg p-6">
                                                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-3 px-3 py-1 rounded">
                                                        {categoryIndex + 1}
                                                    </span>
                                                    {category.name}
                                                </h4>
                                                {category.description && (
                                                    <p className="text-gray-600 mb-6 ml-12">{category.description}</p>
                                                )}

                                                {category.indicators && category.indicators.length > 0 && (
                                                    <div className="space-y-6 ml-12">
                                                        {category.indicators.map((indicator, indicatorIndex) => (
                                                            <div key={indicator.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div className="flex-1">
                                                                        <h5 className="font-medium text-gray-900 flex items-center">
                                                                            <span className="bg-gray-100 text-gray-600 text-xs font-medium mr-2 px-2 py-1 rounded">
                                                                                {categoryIndex + 1}.{indicatorIndex + 1}
                                                                            </span>
                                                                            {indicator.name}
                                                                        </h5>
                                                                        {indicator.description && (
                                                                            <p className="text-sm text-gray-600 mt-1 ml-8">{indicator.description}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-blue-50 rounded-lg p-4 ml-8">
                                                                    <h6 className="text-sm font-semibold text-blue-900 mb-4 flex items-center">
                                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                                        </svg>
                                                                        Form Penilaian
                                                                    </h6>
                                                                    
                                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                        {/* Nilai Numerik & Teks */}
                                                                        <div className="space-y-4">
                                                                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                                                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                                                                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                                                    </svg>
                                                                                    Nilai Angka 
                                                                                    {indicator.require_numeric_value && <span className="text-red-500 ml-1">*</span>}
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    value={results[indicator.id]?.numeric_value || ''}
                                                                                    onChange={(e) => handleResultChange(indicator.id, 'numeric_value', e.target.value)}
                                                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                                                        indicator.require_numeric_value ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'
                                                                                    }`}
                                                                                    placeholder="Masukkan nilai angka (contoh: 85.5)"
                                                                                    required={indicator.require_numeric_value}
                                                                                />
                                                                                {indicator.require_numeric_value && (
                                                                                    <p className="text-xs text-blue-600 mt-1">Field ini wajib diisi</p>
                                                                                )}
                                                                            </div>

                                                                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                                                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                                                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                                                    </svg>
                                                                                    Nilai Teks 
                                                                                    {indicator.require_text_value && <span className="text-red-500 ml-1">*</span>}
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={results[indicator.id]?.text_value || ''}
                                                                                    onChange={(e) => handleResultChange(indicator.id, 'text_value', e.target.value)}
                                                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                                                        indicator.require_text_value ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                                                                                    }`}
                                                                                    placeholder="Masukkan nilai teks (contoh: Baik, Cukup, Kurang)"
                                                                                    required={indicator.require_text_value}
                                                                                />
                                                                                {indicator.require_text_value && (
                                                                                    <p className="text-xs text-green-600 mt-1">Field ini wajib diisi</p>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Catatan & Rekomendasi */}
                                                                        <div className="space-y-4">
                                                                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                                                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                                                                    <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                    </svg>
                                                                                    Catatan 
                                                                                    {indicator.require_note && <span className="text-red-500 ml-1">*</span>}
                                                                                </label>
                                                                                <textarea
                                                                                    rows={4}
                                                                                    value={results[indicator.id]?.note || ''}
                                                                                    onChange={(e) => handleResultChange(indicator.id, 'note', e.target.value)}
                                                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                                                                                        indicator.require_note ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-white'
                                                                                    }`}
                                                                                    placeholder="Tambahkan catatan detail tentang penilaian ini..."
                                                                                    required={indicator.require_note}
                                                                                />
                                                                                {indicator.require_note && (
                                                                                    <p className="text-xs text-orange-600 mt-1">Field ini wajib diisi</p>
                                                                                )}
                                                                            </div>

                                                                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                                                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                                                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                                                    </svg>
                                                                                    Rekomendasi 
                                                                                    {indicator.require_recommendation && <span className="text-red-500 ml-1">*</span>}
                                                                                </label>
                                                                                <textarea
                                                                                    rows={4}
                                                                                    value={results[indicator.id]?.recommendation || ''}
                                                                                    onChange={(e) => handleResultChange(indicator.id, 'recommendation', e.target.value)}
                                                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                                                                                        indicator.require_recommendation ? 'border-purple-300 bg-purple-50' : 'border-gray-300 bg-white'
                                                                                    }`}
                                                                                    placeholder="Berikan rekomendasi untuk perbaikan atau pengembangan..."
                                                                                    required={indicator.require_recommendation}
                                                                                />
                                                                                {indicator.require_recommendation && (
                                                                                    <p className="text-xs text-purple-600 mt-1">Field ini wajib diisi</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <div className="flex justify-end pt-6 border-t border-gray-200">
                                            <button
                                                onClick={saveResults}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Simpan Hasil Penilaian
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Instrumen Belum Dikonfigurasi</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Instrumen evaluasi ini belum memiliki kategori dan indikator penilaian.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href={route('assessment-builder.index', assessmentSession.evaluation_instrument.id)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Konfigurasi Instrumen
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Documentation Tab */}
                        {activeTab === 'documentation' && (
                            <div className="space-y-6">
                                {/* Upload Form */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Upload Dokumentasi</h4>
                                    <form onSubmit={handleFileUpload} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pilih File (Gambar/PDF)
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,application/pdf"
                                                onChange={(e) => setDocData('files', e.target.files)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Maksimal 5MB per file. Format: JPG, PNG, GIF, PDF
                                            </p>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processingDoc || !docData.files.length}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingDoc ? 'Mengupload...' : 'Upload Dokumentasi'}
                                        </button>
                                    </form>
                                </div>

                                {/* Documentation List */}
                                {assessmentSession.documentations && assessmentSession.documentations.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {assessmentSession.documentations.map((doc) => (
                                            <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                                        {doc.file_name}
                                                    </h5>
                                                    <button
                                                        onClick={() => router.delete(route('assessment-documentations.destroy', doc.id))}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {doc.file_type} • {Math.round(doc.file_size / 1024)} KB
                                                </p>
                                                {doc.description && (
                                                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                                                )}
                                                <a
                                                    href={`/storage/${doc.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Lihat
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum Ada Dokumentasi</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload foto atau dokumen untuk mendokumentasikan proses assessment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Info Tab */}
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Karyawan</h4>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                                            <dd className="text-sm text-gray-900">{assessmentSession.employee.full_name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nomor Karyawan</dt>
                                            <dd className="text-sm text-gray-900">{assessmentSession.employee.employee_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{assessmentSession.employee.email}</dd>
                                        </div>
                                        {assessmentSession.employee.division && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Divisi</dt>
                                                <dd className="text-sm text-gray-900">{assessmentSession.employee.division.name}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Assessment</h4>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Instrumen Evaluasi</dt>
                                            <dd className="text-sm text-gray-900">{assessmentSession.evaluation_instrument.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Assessor</dt>
                                            <dd className="text-sm text-gray-900">{assessmentSession.assessor.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Jadwal</dt>
                                            <dd className="text-sm text-gray-900">
                                                {new Date(assessmentSession.start_time).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                <br />
                                                {new Date(assessmentSession.start_time).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} - {new Date(assessmentSession.end_time).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="text-sm">{getStatusBadge(assessmentSession.status)}</dd>
                                        </div>
                                        {assessmentSession.description && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                                                <dd className="text-sm text-gray-900">{assessmentSession.description}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
