import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Show({ department }) {
    return (
        <AdminLayout>
            <Head title={department.name} />

            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">{department.name}</h2>
                                <div className="space-x-2">
                                    <Link href={route('departments.edit', department.id)}>
                                        <PrimaryButton>Edit Department</PrimaryButton>
                                    </Link>
                                    <Link href={route('departments.index')}>
                                        <SecondaryButton>Back to Departments</SecondaryButton>
                                    </Link>
                                </div>
                            </div>

                            {/* Department Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Department Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Name:</span>
                                                <p className="text-gray-900">{department.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Status:</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                                                    department.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {department.status}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Created:</span>
                                                <p className="text-gray-900">{new Date(department.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                                                <p className="text-gray-900">{new Date(department.updated_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Director Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {department.director ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Name:</span>
                                                        <p className="text-gray-900">{department.director.full_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Employee Number:</span>
                                                        <p className="text-gray-900">{department.director.employee_number}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Email:</span>
                                                        <p className="text-gray-900">{department.director.email}</p>
                                                    </div>
                                                    <div className="pt-2">
                                                        <Link
                                                            href={route('employees.show', department.director.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                        >
                                                            View Director Profile →
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No director assigned</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {department.description && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap">{department.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Department Employees */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Department Employees</h3>
                                    <span className="text-sm text-gray-500">
                                        {department.employees ? department.employees.length : 0} employees
                                    </span>
                                </div>
                                
                                {department.employees && department.employees.length > 0 ? (
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Employee
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Employee Number
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {department.employees.map((employee) => (
                                                        <tr key={employee.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {employee.full_name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {employee.employee_number}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {employee.email}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    employee.status === 'active' 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : employee.status === 'inactive'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {employee.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <Link
                                                                    href={route('employees.show', employee.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                                        <p className="text-gray-500 mb-4">No employees assigned to this department yet</p>
                                        <Link href={route('employees.create')}>
                                            <PrimaryButton>Add Employee</PrimaryButton>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
