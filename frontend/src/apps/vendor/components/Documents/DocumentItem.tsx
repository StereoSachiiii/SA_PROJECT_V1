import React from 'react';
import { Download, FileText } from 'lucide-react';
import { DocumentResponse } from '@/shared/types/api';
import { Button } from '@/shared/components/Button';
import DeleteDocument from '../DeleteDocument';

interface DocumentItemProps {
    doc: DocumentResponse;
    onDownload: (doc: DocumentResponse) => void;
    onDelete: (id: number) => Promise<void>;
    isDeleting: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ doc, onDownload, onDelete, isDeleting }) => {
    return (
        <div className="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-black text-slate-800 text-sm">{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    icon={Download}
                    onClick={() => onDownload(doc)}
                    className="text-slate-400 hover:text-indigo-600"
                    title="Download"
                />
                <DeleteDocument
                    onDelete={() => onDelete(doc.id)}
                    isDeleting={isDeleting}
                />
            </div>
        </div>
    );
};

export default DocumentItem;
