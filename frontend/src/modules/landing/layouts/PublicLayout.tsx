import type { ReactNode } from 'react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen font-sans selection:bg-teal-500/30">
            <Header />
            <main className="flex-grow">
                {/* children holds many components */}
                {children}
            </main>
            <Footer />
        </div>
    );
}
