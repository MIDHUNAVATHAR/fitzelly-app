import type { ReactNode } from "react";
import TrainerSidebar from '../components/TrainerSidebar';

interface TrainerDashboardLayoutProps {
    children: ReactNode;
}

export default function TrainerDashboardLayout({ children }: TrainerDashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <TrainerSidebar />

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-300 ease-in-out w-full md:w-auto">
                <div className="p-4 md:p-8 pt-20 md:pt-8 bg-slate-50 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
