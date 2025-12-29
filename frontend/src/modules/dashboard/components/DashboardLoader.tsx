export default function DashboardLoader() {
    return (
        <div className="flex min-h-screen bg-[#FAFBFD]">
            {/* Sidebar Skeleton */}
            <div className="hidden md:block w-64 bg-white border-r border-slate-200 h-screen p-4">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded animate-pulse"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-slate-200 rounded"></div>
                                    <div className="h-6 w-12 bg-slate-200 rounded"></div>
                                </div>
                                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                    <div className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
