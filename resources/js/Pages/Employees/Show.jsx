import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ employee }) {
    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-yellow-100 text-yellow-800',
            terminated: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Aktif',
            inactive: 'Tidak Aktif',
            terminated: 'Diberhentikan'
        };
        return texts[status] || status;
    };

    const getGenderText = (gender) => {
        const texts = {
            male: 'Laki-laki',
            female: 'Perempuan'
        };
        return texts[gender] || '-';
    };

    const formatCurrency = (amount) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout title="Detail Karyawan">
            <Head title={`Detail Karyawan - ${employee.first_name} ${employee.last_name}`} />

            <div className="py-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Detail Karyawan</h3>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('employees.edit', employee.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('employees.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Kembali
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-center">
                                {employee.profile_photo_url ? (
                                    <img
                                        className="mx-auto h-32 w-32 rounded-full object-cover"
                                        src={employee.profile_photo_url}
                                        alt={employee.full_name}
                                    />
                                ) : (
                                    <div className="mx-auto h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-2xl font-medium text-gray-700">
                                            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <h3 className="mt-4 text-xl font-medium text-gray-900">
                                    {employee.first_name} {employee.last_name}
                                </h3>
                                <p className="text-sm text-gray-500">{employee.employee_number}</p>
                                <div className="mt-3">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
                                        {getStatusText(employee.status)}
                                    </span>
                                </div>
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-900">{employee.email}</span>
                                        </div>
                                        {employee.phone && (
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-sm text-gray-900">{employee.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-900">Bergabung: {formatDate(employee.hire_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Informasi Detail</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Informasi Pribadi</h4>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                                                <dd className="text-sm text-gray-900">{employee.first_name} {employee.last_name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="text-sm text-gray-900">{employee.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nomor Telepon</dt>
                                                <dd className="text-sm text-gray-900">{employee.phone || '-'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Tanggal Lahir</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(employee.birth_date)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
                                                <dd className="text-sm text-gray-900">{getGenderText(employee.gender)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                                                <dd className="text-sm text-gray-900">{employee.address || '-'}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Employment Information */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Informasi Pekerjaan</h4>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nomor Karyawan</dt>
                                                <dd className="text-sm text-gray-900 font-mono">{employee.employee_number}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                <dd className="text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
                                                        {getStatusText(employee.status)}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Tanggal Bergabung</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(employee.hire_date)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Gaji</dt>
                                                <dd className="text-sm text-gray-900">{formatCurrency(employee.salary)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Tanggal Dibuat</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(employee.created_at)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Terakhir Diupdate</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(employee.updated_at)}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Account Information */}
                        {employee.user && (
                            <div className="mt-6 bg-white shadow-sm rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Informasi Akun User</h3>
                                </div>
                                <div className="p-6">
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nama User</dt>
                                            <dd className="text-sm text-gray-900">{employee.user.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email User</dt>
                                            <dd className="text-sm text-gray-900">{employee.user.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                                            <dd className="text-sm">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {employee.user.role}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                                            <dd className="text-sm text-gray-900">
                                                {employee.user.email_verified_at ? 'Terverifikasi' : 'Belum Terverifikasi'}
                                            </dd>
                                        </div>
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
