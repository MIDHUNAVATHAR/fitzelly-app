import { Outlet } from 'react-router-dom';
import ClientSidebar from '../components/ClientSidebar';

export default function ClientDashboardLayout({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <ClientSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 transition-all duration-300 w-full pt-16 md:pt-0">
                <div className="container mx-auto px-4 py-8 md:p-8 max-w-7xl">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
