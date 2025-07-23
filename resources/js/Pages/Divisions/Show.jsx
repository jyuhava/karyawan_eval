import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ division }) {
    return (
        <AdminLayout title={`Divisi - ${division.name}`}>
            <Head title={`Divisi - ${division.name}`} />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Detail Divisi</h3>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('divisions.edit', division.id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </Link>
                            <Link
                                href={route('divisions.index')}
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
                                        <dt className="text-sm font-medium text-gray-500">Nama Divisi</dt>
                                        <dd className="text-sm text-gray-900">{division.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.description || '-'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                division.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {division.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tanggal Dibuat</dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(division.created_at).toLocaleDateString('id-ID', {
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
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Struktur Organisasi</h4>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Manager</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.manager ? (
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {division.manager.first_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {division.manager.first_name} {division.manager.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {division.manager.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Belum ada manager</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Departemen</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.department ? (
                                                <Link
                                                    href={route('departments.show', division.department.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {division.department.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">Tidak ada departemen</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Parent Divisi</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.parent ? (
                                                <Link
                                                    href={route('divisions.show', division.parent.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {division.parent.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">Root Divisi</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Jumlah Sub-Divisi</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.children ? division.children.length : 0} divisi
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Jumlah Karyawan</dt>
                                        <dd className="text-sm text-gray-900">
                                            {division.employees ? division.employees.length : 0} karyawan
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Sub-Divisions */}
                        {division.children && division.children.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Sub-Divisi</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {division.children.map((child) => (
                                        <div key={child.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900">{child.name}</h5>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {child.description || 'Tidak ada deskripsi'}
                                                    </p>
                                                    {child.manager && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            Manager: {child.manager.first_name} {child.manager.last_name}
                                                        </p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={route('divisions.show', child.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Employees */}
                        {division.employees && division.employees.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Karyawan</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nomor Karyawan
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
                                            {division.employees.map((employee) => (
                                                <tr key={employee.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8">
                                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {employee.first_name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {employee.first_name} {employee.last_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{employee.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{employee.employee_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            employee.status === 'active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {employee.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('employees.show', employee.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Empty States */}
                        {(!division.children || division.children.length === 0) && (!division.employees || division.employees.length === 0) && (
                            <div className="mt-8 text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Divisi Kosong</h3>
                                <p className="mt-1 text-sm text-gray-500">Divisi ini belum memiliki sub-divisi atau karyawan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
