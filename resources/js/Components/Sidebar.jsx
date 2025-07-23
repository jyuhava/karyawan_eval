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
            name: 'Users',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            current: false
        },
        {
            name: 'Analytics',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            current: false
        },
        {
            name: 'Reports',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            current: false
        },
        {
            name: 'Settings',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            current: false
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
                            <ApplicationLogo className="block h-8 w-auto fill-current text-white" />
                            {!isCollapsed && <span className="ml-2 text-xl font-bold text-white transition-opacity duration-300">Admin</span>}
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
