import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ evaluationInstrument, divisions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: evaluationInstrument.name || '',
        description: evaluationInstrument.description || '',
        division_id: evaluationInstrument.division_id || '',
        status: evaluationInstrument.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('evaluation-instruments.update', evaluationInstrument.id));
    };

    return (
        <AdminLayout title="Edit Instrumen Evaluasi">
            <Head title="Edit Instrumen Evaluasi" />

            <div className="py-3">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Edit Instrumen Evaluasi</h3>
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

                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Instrument Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-900">Informasi Instrumen</h3>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>ID Instrumen: <span className="font-medium">{evaluationInstrument.id}</span></p>
                                <p>Tanggal Dibuat: <span className="font-medium">{new Date(evaluationInstrument.created_at).toLocaleDateString('id-ID')}</span></p>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Instrumen Evaluasi *" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
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
                                placeholder="Masukkan deskripsi instrumen evaluasi..."
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Division Selection */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Divisi</h3>
                            
                            <div>
                                <InputLabel htmlFor="division_id" value="Divisi" />
                                <select
                                    id="division_id"
                                    name="division_id"
                                    value={data.division_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('division_id', e.target.value)}
                                >
                                    <option value="">Semua Divisi (Opsional)</option>
                                    {divisions?.map((division) => (
                                        <option key={division.id} value={division.id}>
                                            {division.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.division_id} className="mt-2" />
                                <p className="mt-1 text-sm text-gray-500">
                                    Pilih divisi spesifik atau biarkan kosong untuk berlaku pada semua divisi
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-4">
                            <Link
                                href={route('evaluation-instruments.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Batal
                            </Link>
                            <PrimaryButton className="ms-4" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Update Instrumen'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Peringatan</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Mengubah status instrumen akan mempengaruhi ketersediaan untuk evaluasi</li>
                                    <li>Perubahan divisi akan mempengaruhi siapa yang dapat menggunakan instrumen ini</li>
                                    <li>Pastikan perubahan tidak mengganggu evaluasi yang sedang berjalan</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
