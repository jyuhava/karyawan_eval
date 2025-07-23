import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ departments, divisions }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        birth_date: '',
        gender: '',
        hire_date: '',
        salary: '',
        department_id: '',
        division_id: '',
        is_division_head: false,
        profile_photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });

        post(route('employees.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Tambah Karyawan">
            <Head title="Tambah Karyawan" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Tambah Karyawan Baru</h3>
                        <Link
                            href={route('employees.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                    </div>
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Profile Photo */}
                        <div>
                            <InputLabel htmlFor="profile_photo" value="Foto Profil" />
                            <div className="mt-2">
                                <input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('profile_photo', e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <InputError message={errors.profile_photo} className="mt-2" />
                        </div>

                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="first_name" value="Nama Depan *" />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    className="mt-1 block w-full"
                                    autoComplete="given-name"
                                    isFocused={true}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="last_name" value="Nama Belakang *" />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    className="mt-1 block w-full"
                                    autoComplete="family-name"
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email *" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Nomor Telepon" />
                                <TextInput
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-1 block w-full"
                                    autoComplete="tel"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="address" value="Alamat" />
                            <textarea
                                id="address"
                                name="address"
                                value={data.address}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                />
                                <InputError message={errors.birth_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="gender" value="Jenis Kelamin" />
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                                <InputError message={errors.gender} className="mt-2" />
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pekerjaan</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="hire_date" value="Tanggal Bergabung" />
                                    <TextInput
                                        id="hire_date"
                                        type="date"
                                        name="hire_date"
                                        value={data.hire_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('hire_date', e.target.value)}
                                    />
                                    <InputError message={errors.hire_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="salary" value="Gaji" />
                                    <TextInput
                                        id="salary"
                                        type="number"
                                        name="salary"
                                        value={data.salary}
                                        className="mt-1 block w-full"
                                        min="0"
                                        step="0.01"
                                        onChange={(e) => setData('salary', e.target.value)}
                                    />
                                    <InputError message={errors.salary} className="mt-2" />
                                </div>

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
                                    <InputLabel htmlFor="division_id" value="Divisi" />
                                    <select
                                        id="division_id"
                                        name="division_id"
                                        value={data.division_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('division_id', e.target.value)}
                                    >
                                        <option value="">Pilih Divisi (Opsional)</option>
                                        {divisions?.map((division) => (
                                            <option key={division.id} value={division.id}>
                                                {division.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.division_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Division Head Checkbox */}
                            <div className="mt-4">
                                <div className="flex items-center">
                                    <input
                                        id="is_division_head"
                                        name="is_division_head"
                                        type="checkbox"
                                        checked={data.is_division_head}
                                        onChange={(e) => setData('is_division_head', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_division_head" className="ml-2 block text-sm text-gray-900">
                                        Ketua Divisi
                                    </label>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Centang jika karyawan ini adalah ketua divisi (dapat membuat assessment session)
                                </p>
                                <InputError message={errors.is_division_head} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-4">
                            <Link
                                href={route('employees.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Batal
                            </Link>
                            <PrimaryButton className="ms-4" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
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
                                    <li>Nomor karyawan akan dibuat otomatis setelah data disimpan</li>
                                    <li>Akun user dengan role "employee" akan dibuat otomatis</li>
                                    <li>Password default adalah "password123" (karyawan dapat mengubahnya nanti)</li>
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
