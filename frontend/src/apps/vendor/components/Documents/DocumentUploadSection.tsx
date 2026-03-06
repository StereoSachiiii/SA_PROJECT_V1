import React from 'react';
import { PlusCircle } from 'lucide-react';
import DocumentUpload from '@/shared/components/DocumentUpload';
import { DocumentResponse } from '@/shared/types/api';

interface DocumentUploadSectionProps {
    onUploadSuccess: (newDoc: DocumentResponse) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ onUploadSuccess }) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <PlusCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Add New</h2>
            </div>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">
                Upload your Trade License, ID, or other compliance documents.
                Accepted formats: <span className="font-bold text-slate-700">PDF, JPG, PNG</span>.
            </p>
            <DocumentUpload
                onUploadSuccess={onUploadSuccess}
                label="Select File"
            />
        </div>
    );
};

export default DocumentUploadSection;
