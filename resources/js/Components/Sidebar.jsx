import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Sidebar({ isOpen, isCollapsed, toggleSidebar, toggleCollapse }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            ),
            current: url === '/dashboard'
        },
        {
            name: 'Karyawan',
            href: route('employees.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            current: url.startsWith('/employees')
        },
        {
            name: 'Departemen',
            href: route('departments.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            current: url.startsWith('/departments')
        },
        {
            name: 'Divisi',
            href: route('divisions.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            current: url.startsWith('/divisions')
        },
        {
            name: 'Instrumen Evaluasi',
            href: route('evaluation-instruments.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            current: url.startsWith('/evaluation-instruments')
        },
        {
            name: 'Assessment Sessions',
            href: route('assessment-sessions.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            current: url.startsWith('/assessment-sessions')
        }
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-20"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 transition-all duration-300 ease-in-out
                lg:relative lg:flex
                ${isOpen ? 'fixed inset-y-0 left-0 z-30 translate-x-0' : 'fixed inset-y-0 left-0 z-30 -translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col w-full h-full sidebar-scroll overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
                        <Link href="/" className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            {!isCollapsed && (
                                <span className="ml-2 text-xl font-bold text-white transition-opacity duration-300">E-Valuation</span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 py-6 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300`}>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200 relative group
                                    ${isCollapsed ? 'px-3 justify-center' : 'px-4'}
                                    ${item.current
                                        ? 'bg-gray-800 text-white border-r-2 border-blue-500'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                                title={isCollapsed ? item.name : ''}
                            >
                                <span className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? '' : 'mr-3'}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className="transition-all duration-300">
                                        {item.name}
                                    </span>
                                )}
                                
                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className={`border-t border-gray-700 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                        <Link
                            href={route('profile.edit')}
                            className={`
                                flex items-center py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200
                                ${isCollapsed ? 'px-3 justify-center' : 'px-4'}
                            `}
                        >
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full flex-shrink-0">
                                <span className="text-sm font-medium text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 ml-3 transition-all duration-300">
                                    <div className="text-sm font-medium">{user.name}</div>
                                    <div className="text-xs text-gray-400">View Profile</div>
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
