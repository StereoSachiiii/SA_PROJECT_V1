import { useState } from 'react';

interface RefundSearchProps {
    onSearch: (id: string) => void;
    loading: boolean;
}

export default function RefundSearch({ onSearch, loading }: RefundSearchProps) {
    const [id, setId] = useState('');
    // Actually just use normal state, I was being fancy with the example

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4">Refund Lookup</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Reservation ID (e.g. 1001)"
                    className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2 rounded-md font-semibold text-gray-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSearch(id);
                    }}
                />
                <button
                    disabled={loading || !id}
                    onClick={() => onSearch(id)}
                    className="px-6 bg-blue-600 text-white rounded-md font-bold text-xs uppercase hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            <p className="mt-3 text-[10px] font-semibold text-gray-400 uppercase">
                Note: Refunds apply to <span className="text-blue-600">PAID</span> reservations only.
            </p>
        </div>
    );
}
