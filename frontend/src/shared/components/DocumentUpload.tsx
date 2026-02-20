import React, { useState, useRef } from 'react';
import { documentApi } from '../api/documentApi';
import { DocumentResponse } from '../types/api';

interface DocumentUploadProps {
    onUploadSuccess?: (doc: DocumentResponse) => void;
    label?: string;
    accept?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUploadSuccess,
    label = "Upload Document",
    accept = ".pdf,.jpg,.jpeg,.png"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const uploadedDoc = await documentApi.upload(file);
            if (onUploadSuccess) {
                onUploadSuccess(uploadedDoc);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload document');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isUploading && (
                    <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Uploading...</span>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

export default DocumentUpload;
