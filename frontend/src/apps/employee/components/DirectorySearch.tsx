import React from 'react';

interface DirectorySearchProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    searchResults: any;
    handleSearch: (e: React.FormEvent) => void;
}

export const DirectorySearch: React.FC<DirectorySearchProps> = ({ searchQuery, setSearchQuery, searchResults, handleSearch }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Business Name or ID..."
                    className="flex-1 p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all font-bold"
                />
                <button type="submit" className="px-8 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
                    SEARCH
                </button>
            </form>

            <div className="space-y-4">
                {searchResults?.content.map((res: any) => (
                    <div key={res.id} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all group">
                        <div>
                            <div className="font-black text-slate-800">#{res.id} • {res.vendor}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{res.stalls.join(', ')}</div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${res.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {res.status}
                        </div>
                    </div>
                ))}
                {searchResults?.content.length === 0 && (
                    <div className="text-center py-12 text-slate-400 font-bold italic">
                        Enter a query to browse reservations.
                    </div>
                )}
            </div>
        </div>
    );
};
