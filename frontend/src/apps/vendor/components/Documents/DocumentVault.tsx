import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentResponse } from '@/shared/types/api';
import DocumentItem from './DocumentItem';

interface DocumentVaultProps {
    documents: DocumentResponse[];
    onDownload: (doc: DocumentResponse) => void;
    onDelete: (id: number) => Promise<void>;
    isDeleting: boolean;
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ documents, onDownload, onDelete, isDeleting }) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Uploaded Files</h2>
                <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {documents.length} Total
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {documents.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">No Vault Entries</h3>
                        <p className="text-slate-400 font-medium text-sm">Your document vault is currently empty.</p>
                    </div>
                ) : (
                    documents.map(doc => (
                        <DocumentItem
                            key={doc.id}
                            doc={doc}
                            onDownload={onDownload}
                            onDelete={onDelete}
                            isDeleting={isDeleting}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentVault;
