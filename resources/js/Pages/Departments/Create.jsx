import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        director_id: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('departments.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Department" />

            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Create New Department</h2>
                                <Link href={route('departments.index')}>
                                    <SecondaryButton>Back to Departments</SecondaryButton>
                                </Link>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Department Name */}
                                    <div>
                                        <InputLabel htmlFor="name" value="Department Name *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Status *" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                {/* Director */}
                                <div>
                                    <InputLabel htmlFor="director_id" value="Director" />
                                    <select
                                        id="director_id"
                                        value={data.director_id}
                                        onChange={(e) => setData('director_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">Select Director (Optional)</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} ({employee.employee_number})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.director_id} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Select an employee to be the director of this department
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="4"
                                        placeholder="Enter department description..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link href={route('departments.index')}>
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Department'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
