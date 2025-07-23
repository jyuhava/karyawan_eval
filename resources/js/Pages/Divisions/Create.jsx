import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ employees, parentDivisions, departments }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        manager_id: '',
        parent_id: '',
        department_id: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('divisions.store'));
    };

    return (
        <AdminLayout title="Tambah Divisi">
            <Head title="Tambah Divisi" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Tambah Divisi Baru</h3>
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

                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Divisi *" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status *" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Deskripsi" />
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Masukkan deskripsi divisi..."
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Management Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Manajemen</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="department_id" value="Departemen" />
                                    <select
                                        id="department_id"
                                        name="department_id"
                                        value={data.department_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('department_id', e.target.value)}
                                    >
                                        <option value="">Pilih Departemen (Opsional)</option>
                                        {departments?.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.department_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="manager_id" value="Manager" />
                                    <select
                                        id="manager_id"
                                        name="manager_id"
                                        value={data.manager_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('manager_id', e.target.value)}
                                    >
                                        <option value="">Pilih Manager (Opsional)</option>
                                        {employees?.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.first_name} {employee.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.manager_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent Divisi" />
                                    <select
                                        id="parent_id"
                                        name="parent_id"
                                        value={data.parent_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                    >
                                        <option value="">Root Divisi (Tidak ada parent)</option>
                                        {parentDivisions?.map((division) => (
                                            <option key={division.id} value={division.id}>
                                                {division.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.parent_id} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-4">
                            <Link
                                href={route('divisions.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Batal
                            </Link>
                            <PrimaryButton className="ms-4" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Divisi'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Informasi</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Departemen menentukan divisi berada di bawah departemen mana</li>
                                    <li>Manager adalah karyawan yang bertanggung jawab atas divisi ini</li>
                                    <li>Parent divisi menentukan hierarki organisasi</li>
                                    <li>Divisi root tidak memiliki parent (berada di level tertinggi)</li>
                                    <li>Field yang bertanda (*) wajib diisi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
