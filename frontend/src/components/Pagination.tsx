import { memo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const Pagination = memo(({ currentPage, totalPages, total, limit, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const startItem = ((currentPage - 1) * limit) + 1;
    const endItem = Math.min(currentPage * limit, total);

    return (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-600">
                Showing {startItem} to {endItem} of {total} clients
            </p>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-slate-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';
