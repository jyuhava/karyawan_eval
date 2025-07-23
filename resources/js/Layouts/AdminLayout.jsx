import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import TopNavbar from '@/Components/TopNavbar';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                isCollapsed={sidebarCollapsed}
                toggleSidebar={toggleSidebar} 
                toggleCollapse={toggleSidebarCollapse}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <TopNavbar 
                    toggleSidebar={toggleSidebar} 
                    toggleCollapse={toggleSidebarCollapse}
                    title={title} 
                    sidebarCollapsed={sidebarCollapsed}
                />

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
