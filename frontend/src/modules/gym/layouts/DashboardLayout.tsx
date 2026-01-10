import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-[#FAFBFD]">
            {/* Sidebar Wrapper - Let Sidebar component handle its own width/fixed/relative state within the flex container */}
            <Sidebar />

            <div className="flex-1 w-full overflow-x-hidden overflow-y-auto pt-16 md:pt-0">
                <main className="p-4 md:p-6 lg:p-8 max-w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
