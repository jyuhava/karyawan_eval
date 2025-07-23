import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ evaluationInstrument }) {
    return (
        <AdminLayout title={`Instrumen Evaluasi - ${evaluationInstrument.name}`}>
            <Head title={`Instrumen Evaluasi - ${evaluationInstrument.name}`} />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Detail Instrumen Evaluasi</h3>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('assessment-builder.index', evaluationInstrument.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Assessment Builder
                            </Link>
                            <Link
                                href={route('evaluation-instruments.edit', evaluationInstrument.id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </Link>
                            <Link
                                href={route('evaluation-instruments.index')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali
                            </Link>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h4>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Nama Instrumen</dt>
                                        <dd className="text-sm text-gray-900">{evaluationInstrument.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                                        <dd className="text-sm text-gray-900">
                                            {evaluationInstrument.description || '-'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                evaluationInstrument.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {evaluationInstrument.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tanggal Dibuat</dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(evaluationInstrument.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Terakhir Diperbarui</dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(evaluationInstrument.updated_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Divisi</h4>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Divisi Terkait</dt>
                                        <dd className="text-sm text-gray-900">
                                            {evaluationInstrument.division ? (
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <Link
                                                            href={route('divisions.show', evaluationInstrument.division.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {evaluationInstrument.division.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <span className="text-gray-600 font-medium">Semua Divisi</span>
                                                        <p className="text-xs text-gray-500">Instrumen berlaku untuk semua divisi</p>
                                                    </div>
                                                </div>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Cakupan Penggunaan</dt>
                                        <dd className="text-sm text-gray-900">
                                            {evaluationInstrument.division ? 'Divisi Spesifik' : 'Global (Semua Divisi)'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Categories and Indicators */}
                        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-medium text-gray-900">Kategori Penilaian</h4>
                                <Link
                                    href={route('assessment-builder.index', evaluationInstrument.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Kelola
                                </Link>
                            </div>

                            {evaluationInstrument.categories && evaluationInstrument.categories.length > 0 ? (
                                <div className="space-y-4">
                                    {evaluationInstrument.categories.map((category, categoryIndex) => (
                                        <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 flex items-center">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                            {categoryIndex + 1}
                                                        </span>
                                                        {category.name}
                                                    </h5>
                                                    {category.description && (
                                                        <p className="text-sm text-gray-600 mt-1 ml-8">{category.description}</p>
                                                    )}
                                                    
                                                    {/* Indicators */}
                                                    {category.indicators && category.indicators.length > 0 && (
                                                        <div className="mt-3 ml-8">
                                                            <h6 className="text-sm font-medium text-gray-700 mb-2">Indikator:</h6>
                                                            <div className="space-y-2">
                                                                {category.indicators.map((indicator, indicatorIndex) => (
                                                                    <div key={indicator.id} className="flex items-start">
                                                                        <span className="bg-gray-100 text-gray-600 text-xs font-medium mr-2 px-2 py-0.5 rounded">
                                                                            {categoryIndex + 1}.{indicatorIndex + 1}
                                                                        </span>
                                                                        <div className="flex-1">
                                                                            <p className="text-sm text-gray-800">{indicator.name}</p>
                                                                            {indicator.description && (
                                                                                <p className="text-xs text-gray-600 mt-1">{indicator.description}</p>
                                                                            )}
                                                                            
                                                                            {/* Requirements */}
                                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                                {indicator.require_numeric_value && (
                                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                                        Nilai Angka
                                                                                    </span>
                                                                                )}
                                                                                {indicator.require_text_value && (
                                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                                        Nilai Teks
                                                                                    </span>
                                                                                )}
                                                                                {indicator.require_note && (
                                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                                        Catatan
                                                                                    </span>
                                                                                )}
                                                                                {indicator.require_recommendation && (
                                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                                                        Rekomendasi
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum Ada Kategori</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Mulai membangun assessment dengan menambahkan kategori penilaian.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('assessment-builder.index', evaluationInstrument.id)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Tambah Kategori Pertama
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
