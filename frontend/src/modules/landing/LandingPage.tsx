import PublicLayout from '../../layouts/PublicLayout';
import Home from './sections/Home';
import Features from './sections/Features';
import Pricing from './sections/Pricing';

export default function LandingPage() {
    return (
        <PublicLayout>
            <Home />
            <Features />
            <Pricing />
        </PublicLayout>
    );
}
