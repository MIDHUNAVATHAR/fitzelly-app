import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#FAFBFD]">
            <Sidebar />
            <div className="flex-1 w-full md:w-auto overflow-x-hidden pt-16 md:pt-0">
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
