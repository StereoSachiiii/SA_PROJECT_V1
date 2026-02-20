import React, { useEffect, useState } from 'react';
import { documentApi } from '@/shared/api/documentApi';
import { DocumentResponse } from '@/shared/types/api';
import DocumentUpload from '@/shared/components/DocumentUpload';

const DocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const docs = await documentApi.getDocuments();
            setDocuments(docs);
        } catch (err) {
            setError('Failed to load documents');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUploadSuccess = (newDoc: DocumentResponse) => {
        setDocuments(prev => [...prev, newDoc]);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await documentApi.delete(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            alert('Failed to delete document');
        }
    };

    const handleDownload = async (doc: DocumentResponse) => {
        try {
            const blob = await documentApi.download(doc.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download document');
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Business Documents</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Upload New Document</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Upload your Trade License, ID, or other compliance documents.
                    Accepted formats: PDF, JPG, PNG.
                </p>
                <DocumentUpload
                    onUploadSuccess={handleUploadSuccess}
                    label="Select File"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Your Uploaded Documents</h2>
                {documents.length === 0 ? (
                    <p className="text-gray-500 italic bg-gray-50 p-4 rounded text-center border-2 border-dashed border-gray-200">
                        No documents uploaded yet.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {documents.map(doc => (
                            <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{doc.fileName}</p>
                                        <p className="text-xs text-gray-500">
                                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Download"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
        </div>
    );
};

export default DocumentsPage;
