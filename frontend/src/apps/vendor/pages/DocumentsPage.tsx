import React from 'react';
import { useDocuments } from '../hooks/useDocuments';
import DocumentVault from '../components/Documents/DocumentVault';
import DocumentUploadSection from '../components/Documents/DocumentUploadSection';

const DocumentsPage: React.FC = () => {
    const {
        documents,
        isLoading,
        isDeleting,
        error,
        handleUploadSuccess,
        handleDelete,
        handleDownload
    } = useDocuments();

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Documents</p>
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Business Documents</h1>
                <p className="text-slate-500 font-medium italic">Manage your vendor compliance and trade licenses</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-6">
                    <DocumentUploadSection onUploadSuccess={handleUploadSuccess} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <DocumentVault
                        documents={documents}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center border border-rose-100">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
