import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg mx-auto">

                {/* glitched text effect for 404 */}
                <div className="relative">
                    <h1 className="text-[150px] font-black text-[#00ffd5] leading-none select-none opacity-50 blur-[2px] absolute top-0 left-0 right-0 animate-pulse">
                        404
                    </h1>
                    <h1 className="text-[150px] font-black text-white leading-none relative z-10">
                        404
                    </h1>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#00ffd5] text-slate-900 font-bold rounded-xl transition-all hover:bg-[#00e6c0] hover:shadow-[0_0_20px_rgba(0,255,213,0.4)] hover:-translate-y-1 active:translate-y-0"
                >
                    <MoveLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </button>
            </div>

            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ffd5]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ffd5]/5 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
