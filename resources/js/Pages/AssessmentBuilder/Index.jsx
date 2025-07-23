import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ evaluationInstrument }) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showIndicatorModal, setShowIndicatorModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingIndicator, setEditingIndicator] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Category form
    const categoryForm = useForm({
        name: '',
        description: '',
    });

    // Indicator form
    const indicatorForm = useForm({
        name: '',
        description: '',
        require_numeric_value: false,
        require_text_value: false,
        require_note: false,
        require_recommendation: false,
    });

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            categoryForm.setData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            categoryForm.reset();
        }
        setShowCategoryModal(true);
    };

    const openIndicatorModal = (category, indicator = null) => {
        setSelectedCategory(category);
        if (indicator) {
            setEditingIndicator(indicator);
            indicatorForm.setData({
                name: indicator.name,
                description: indicator.description || '',
                require_numeric_value: indicator.require_numeric_value,
                require_text_value: indicator.require_text_value,
                require_note: indicator.require_note,
                require_recommendation: indicator.require_recommendation,
            });
        } else {
            setEditingIndicator(null);
            indicatorForm.reset();
        }
        setShowIndicatorModal(true);
    };

    const submitCategory = (e) => {
        e.preventDefault();
        const url = editingCategory 
            ? route('assessment-builder.categories.update', editingCategory.id)
            : route('assessment-builder.categories.store', { evaluationInstrument: evaluationInstrument.id });
        
        const method = editingCategory ? 'put' : 'post';
        
        categoryForm[method](url, {
            onSuccess: () => {
                setShowCategoryModal(false);
                categoryForm.reset();
                setEditingCategory(null);
            }
        });
    };

    const submitIndicator = (e) => {
        e.preventDefault();
        const url = editingIndicator 
            ? route('assessment-builder.indicators.update', editingIndicator.id)
            : route('assessment-builder.indicators.store', { 
                evaluationInstrument: evaluationInstrument.id, 
                category: selectedCategory.id 
            });
        
        const method = editingIndicator ? 'put' : 'post';
        
        indicatorForm[method](url, {
            onSuccess: () => {
                setShowIndicatorModal(false);
                indicatorForm.reset();
                setEditingIndicator(null);
                setSelectedCategory(null);
            }
        });
    };

    const deleteCategory = (category) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"? Semua indikator dalam kategori ini akan ikut terhapus.`)) {
            router.delete(route('assessment-builder.categories.destroy', category.id));
        }
    };

    const deleteIndicator = (indicator) => {
        if (confirm(`Apakah Anda yakin ingin menghapus indikator "${indicator.name}"?`)) {
            router.delete(route('assessment-builder.indicators.destroy', indicator.id));
        }
    };

    return (
        <AdminLayout title={`Assessment Builder - ${evaluationInstrument.name}`}>
            <Head title={`Assessment Builder - ${evaluationInstrument.name}`} />

            <div className="py-3">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Assessment Builder</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Instrumen: <span className="font-medium">{evaluationInstrument.name}</span>
                                {evaluationInstrument.division && (
                                    <span className="ml-2">• Divisi: <span className="font-medium">{evaluationInstrument.division.name}</span></span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => openCategoryModal()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Tambah Kategori
                            </button>
                            <Link
                                href={route('evaluation-instruments.show', evaluationInstrument.id)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Categories and Indicators */}
                <div className="space-y-6">
                    {evaluationInstrument.categories && evaluationInstrument.categories.length > 0 ? (
                        evaluationInstrument.categories.map((category) => (
                            <div key={category.id} className="bg-white shadow-sm rounded-lg">
                                {/* Category Header */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                                            {category.description && (
                                                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => openIndicatorModal(category)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Indikator
                                            </button>
                                            <button
                                                onClick={() => openCategoryModal(category)}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Indicators */}
                                <div className="p-6">
                                    {category.indicators && category.indicators.length > 0 ? (
                                        <div className="space-y-4">
                                            {category.indicators.map((indicator) => (
                                                <div key={indicator.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-gray-900">{indicator.name}</h5>
                                                            {indicator.description && (
                                                                <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
                                                            )}
                                                            
                                                            {/* Requirements */}
                                                            <div className="flex flex-wrap gap-2 mt-3">
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
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <button
                                                                onClick={() => openIndicatorModal(category, indicator)}
                                                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteIndicator(indicator)}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Hapus
                                                            </button>
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
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum Ada Indikator</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Mulai dengan menambahkan indikator untuk kategori ini.
                                            </p>
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => openIndicatorModal(category)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Tambah Indikator
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white shadow-sm rounded-lg p-12">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum Ada Kategori</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Mulai membangun assessment dengan menambahkan kategori penilaian.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => openCategoryModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Tambah Kategori Pertama
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
                <form onSubmit={submitCategory} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="category_name" value="Nama Kategori *" />
                            <TextInput
                                id="category_name"
                                name="name"
                                value={categoryForm.data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => categoryForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={categoryForm.errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category_description" value="Deskripsi" />
                            <textarea
                                id="category_description"
                                name="description"
                                value={categoryForm.data.description}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                                onChange={(e) => categoryForm.setData('description', e.target.value)}
                                placeholder="Masukkan deskripsi kategori..."
                            />
                            <InputError message={categoryForm.errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-6 space-x-3">
                        <SecondaryButton onClick={() => setShowCategoryModal(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={categoryForm.processing}>
                            {categoryForm.processing ? 'Menyimpan...' : (editingCategory ? 'Update' : 'Simpan')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Indicator Modal */}
            <Modal show={showIndicatorModal} onClose={() => setShowIndicatorModal(false)} maxWidth="2xl">
                <form onSubmit={submitIndicator} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingIndicator ? 'Edit Indikator' : 'Tambah Indikator Baru'}
                        {selectedCategory && (
                            <span className="text-sm text-gray-600 block mt-1">
                                Kategori: {selectedCategory.name}
                            </span>
                        )}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="indicator_name" value="Nama Indikator *" />
                            <TextInput
                                id="indicator_name"
                                name="name"
                                value={indicatorForm.data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => indicatorForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={indicatorForm.errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="indicator_description" value="Deskripsi" />
                            <textarea
                                id="indicator_description"
                                name="description"
                                value={indicatorForm.data.description}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                                onChange={(e) => indicatorForm.setData('description', e.target.value)}
                                placeholder="Masukkan deskripsi indikator..."
                            />
                            <InputError message={indicatorForm.errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Persyaratan Input" />
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={indicatorForm.data.require_numeric_value}
                                        onChange={(e) => indicatorForm.setData('require_numeric_value', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Memerlukan Nilai Angka</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={indicatorForm.data.require_text_value}
                                        onChange={(e) => indicatorForm.setData('require_text_value', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Memerlukan Nilai Teks</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={indicatorForm.data.require_note}
                                        onChange={(e) => indicatorForm.setData('require_note', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Memerlukan Catatan</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={indicatorForm.data.require_recommendation}
                                        onChange={(e) => indicatorForm.setData('require_recommendation', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Memerlukan Rekomendasi</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-6 space-x-3">
                        <SecondaryButton onClick={() => setShowIndicatorModal(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={indicatorForm.processing}>
                            {indicatorForm.processing ? 'Menyimpan...' : (editingIndicator ? 'Update' : 'Simpan')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
