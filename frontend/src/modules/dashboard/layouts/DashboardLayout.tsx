import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#FAFBFD]">
            {/* Sidebar Wrapper - Fixed on Desktop */}
            <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:z-40">
                <Sidebar />
            </div>

            <div className="flex-1 w-full md:ml-64 overflow-x-hidden pt-16 md:pt-0">
                <main className="p-4 md:p-6 lg:p-8 max-w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
