import type { ReactNode } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

interface SuperAdminDashboardLayoutProps {
    children: ReactNode;
}

export default function SuperAdminDashboardLayout({ children }: SuperAdminDashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <SuperAdminSidebar />

            <main className="lg:ml-72 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
