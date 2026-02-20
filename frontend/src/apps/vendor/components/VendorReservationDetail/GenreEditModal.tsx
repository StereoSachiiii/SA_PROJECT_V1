interface Category {
    id: string;
    label: string;
}

interface GenreEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    onSave: () => void;
    isPending: boolean;
    categories: Category[];
}

export const GenreEditModal = ({
    isOpen,
    onClose,
    selectedCategories,
    onCategoriesChange,
    onSave,
    isPending,
    categories
}: GenreEditModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Update Stall Genre</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
                    Select the primary categories for this stall.
                </p>

                <div className="text-left mb-6 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map(cat => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                            <label key={cat.id} className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-100 hover:border-indigo-200 text-slate-600 font-medium'}`}>
                                <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-indigo-600' : 'bg-slate-200 group-hover:bg-indigo-200'}`}>
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => {
                                        if (isSelected) {
                                            onCategoriesChange(selectedCategories.filter(id => id !== cat.id));
                                        } else {
                                            onCategoriesChange([...selectedCategories, cat.id]);
                                        }
                                    }}
                                />
                                <span className="text-sm">{cat.label}</span>
                            </label>
                        );
                    })}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isPending || selectedCategories.length === 0}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
