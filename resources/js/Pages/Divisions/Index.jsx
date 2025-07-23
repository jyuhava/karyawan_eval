import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ divisions, filters, viewType }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [view, setView] = useState(viewType || 'table');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('divisions.index'), { search, status, view }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (division) => {
        if (confirm(`Apakah Anda yakin ingin menghapus divisi "${division.name}"?`)) {
            router.delete(route('divisions.destroy', division.id));
        }
    };

    const toggleView = (newView) => {
        setView(newView);
        router.get(route('divisions.index'), { search, status, view: newView }, {
            preserveState: true,
            replace: true,
        });
    };

    const renderTreeNode = (division, level = 0) => {
        return (
            <div key={division.id} className={`${level > 0 ? 'ml-8' : ''}`}>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2">
                    <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${division.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                            <h3 className="font-medium text-gray-900">{division.name}</h3>
                            <p className="text-sm text-gray-500">{division.description}</p>
                            {division.manager && (
                                <p className="text-sm text-blue-600">
                                    Manager: {division.manager.first_name} {division.manager.last_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('divisions.show', division.id)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </Link>
                        <Link
                            href={route('divisions.edit', division.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Link>
                        <button
                            onClick={() => handleDelete(division)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {division.children && division.children.map(child => renderTreeNode(child, level + 1))}
            </div>
        );
    };

    return (
        <AdminLayout title="Divisi">
            <Head title="Divisi" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Divisi</h3>
                            <div className="mt-3 sm:mt-0 flex items-center space-x-3">
                                {/* View Toggle */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => toggleView('table')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            view === 'table' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Tabel
                                    </button>
                                    <button
                                        onClick={() => toggleView('tree')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            view === 'tree' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Tree
                                    </button>
                                </div>
                                
                                <Link
                                    href={route('divisions.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Divisi
                                </Link>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari divisi, manager, atau parent..."
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
                        {view === 'tree' ? (
                            <div className="space-y-4">
                                {divisions.length > 0 ? (
                                    divisions.map(division => renderTreeNode(division))
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada divisi</h3>
                                        <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat divisi baru.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Divisi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Departemen
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Manager
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Parent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Karyawan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {divisions.data && divisions.data.length > 0 ? (
                                            divisions.data.map((division) => (
                                                <tr key={division.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {division.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {division.description}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {division.department ? (
                                                            <div className="text-sm text-gray-900">
                                                                {division.department.name}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {division.manager ? (
                                                            <div className="text-sm text-gray-900">
                                                                {division.manager.first_name} {division.manager.last_name}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {division.parent ? (
                                                            <div className="text-sm text-gray-900">
                                                                {division.parent.name}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Root</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {division.employees_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            division.status === 'active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {division.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route('divisions.show', division.id)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Lihat
                                                            </Link>
                                                            <Link
                                                                href={route('divisions.edit', division.id)}
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(division)}
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
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data divisi
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {divisions.links && view === 'table' && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan {divisions.from || 0} sampai {divisions.to || 0} dari {divisions.total || 0} hasil
                                        </div>
                                        <div className="flex space-x-1">
                                            {divisions.links.map((link, index) => (
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
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
