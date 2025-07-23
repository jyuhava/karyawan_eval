import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('departments.index'), 
                { search, status: status !== 'all' ? status : undefined },
                { 
                    preserveState: true,
                    replace: true 
                }
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, status]);

    const handleDelete = (department) => {
        if (confirm(`Are you sure you want to delete ${department.name}?`)) {
            router.delete(route('departments.destroy', department.id));
        }
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
        router.get(route('departments.index'));
    };

    return (
        <AdminLayout>
            <Head title="Departments" />

            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>
                                <Link href={route('departments.create')}>
                                    <PrimaryButton>Add New Department</PrimaryButton>
                                </Link>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <TextInput
                                        type="text"
                                        placeholder="Search departments, directors..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="sm:w-48">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <SecondaryButton onClick={resetFilters}>
                                    Reset
                                </SecondaryButton>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Director
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employees
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {departments.data.map((department) => (
                                            <tr key={department.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {department.name}
                                                        </div>
                                                        {department.description && (
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {department.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {department.director ? department.director.full_name : 'No Director'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        department.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {department.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {department.employees_count || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route('departments.show', department.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('departments.edit', department.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(department)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {departments.data.map((department) => (
                                    <div key={department.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                department.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {department.status}
                                            </span>
                                        </div>
                                        {department.description && (
                                            <p className="text-sm text-gray-600 mb-2">{department.description}</p>
                                        )}
                                        <div className="text-sm text-gray-500 mb-3">
                                            <div>Director: {department.director ? department.director.full_name : 'No Director'}</div>
                                            <div>Employees: {department.employees_count || 0}</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('departments.show', department.id)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('departments.edit', department.id)}
                                                className="text-yellow-600 hover:text-yellow-900 text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(department)}
                                                className="text-red-600 hover:text-red-900 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {departments.data.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-4">No departments found</div>
                                    <Link href={route('departments.create')}>
                                        <PrimaryButton>Create First Department</PrimaryButton>
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {departments.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {departments.from} to {departments.to} of {departments.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {departments.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
