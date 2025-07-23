import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ evaluationInstruments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('evaluation-instruments.index'), { search, status }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (evaluationInstrument) => {
        if (confirm(`Apakah Anda yakin ingin menghapus instrumen evaluasi "${evaluationInstrument.name}"?`)) {
            router.delete(route('evaluation-instruments.destroy', evaluationInstrument.id));
        }
    };

    return (
        <AdminLayout title="Instrumen Evaluasi">
            <Head title="Instrumen Evaluasi" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Instrumen Evaluasi</h3>
                            <div className="mt-3 sm:mt-0">
                                <Link
                                    href={route('evaluation-instruments.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Instrumen
                                </Link>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari instrumen evaluasi atau divisi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Instrumen Evaluasi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Divisi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Dibuat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {evaluationInstruments.data && evaluationInstruments.data.length > 0 ? (
                                        evaluationInstruments.data.map((instrument) => (
                                            <tr key={instrument.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {instrument.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {instrument.description}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {instrument.division ? (
                                                        <div className="text-sm text-gray-900">
                                                            {instrument.division.name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">Semua Divisi</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        instrument.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {instrument.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(instrument.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('evaluation-instruments.show', instrument.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <Link
                                                            href={route('evaluation-instruments.edit', instrument.id)}
                                                            className="text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(instrument)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                Tidak ada data instrumen evaluasi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {evaluationInstruments.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {evaluationInstruments.from || 0} sampai {evaluationInstruments.to || 0} dari {evaluationInstruments.total || 0} hasil
                                    </div>
                                    <div className="flex space-x-1">
                                        {evaluationInstruments.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
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
