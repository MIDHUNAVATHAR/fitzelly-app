import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../auth/services/AuthService';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true; // Prevent double execution in React Strict Mode

        const handleCallback = async () => {
            // Check for Hash (Implicit flow - Access Token)
            const hash = location.hash;
            let tokenOrCode = null;

            if (hash) {
                const params = new URLSearchParams(hash.replace('#', ''));
                tokenOrCode = params.get('access_token');
            } else {
                // Check for Code (Auth Code flow - Redirect)
                const query = new URLSearchParams(location.search);
                tokenOrCode = query.get('code');
            }

            if (tokenOrCode) {
                try {
                    console.log("Processing Google Login...", tokenOrCode.substring(0, 10) + "...");
                    const role = localStorage.getItem('loginRole') || 'gym';

                    await AuthService.googleLogin(tokenOrCode, role);
                    // Dispatch event to update Header
                    window.dispatchEvent(new Event('auth-change'));
                    navigate('/gym/dashboard'); // Redirect to dashboard
                } catch (error) {
                    console.error("Google Callback Error:", error);
                    navigate('/'); // Redirect to home on error
                }
            } else {
                console.error("No access token or code found in URL");
                navigate('/');
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#00ffd5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-white text-xl font-bold">Verifying Google Login...</h2>
            </div>
        </div>
    );
}
