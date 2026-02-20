import React, { useEffect, useState } from 'react';
import { documentApi } from '@/shared/api/documentApi';
import { DocumentResponse } from '@/shared/types/api';

const VendorDocuments: React.FC = () => {
    // Note: In a real app, you'd fetch by vendorId. 
    // For now, let's assume we fetch all or the API supports filtering.
    // The current documentApi.getDocuments() returns the logged-in user's docs.
    // For Admin to see vendor docs, we might need a separate endpoint or param.
    // Based on BACKEND_FUNCTIONALITY_AUDIT.md 2.6, GET /api/v1/documents lists user's files.
    // We might need GET /api/v1/admin/documents/{vendorId} but it's not in the audit.
    // Let's implement the UI assuming we'll list/download what the API provides.

    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docs = await documentApi.getDocuments();
                setDocuments(docs);
            } catch (err) {
                setError('Failed to fetch vendor documents');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, []);

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

    if (isLoading) return <div className="p-8">Loading documents...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Vendor Document Review</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">File Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Size</th>
                            <th className="px-6 py-3">Uploaded On</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                    No documents found for this vendor.
                                </td>
                            </tr>
                        ) : (
                            documents.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{doc.fileName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{doc.fileType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className="text-blue-600 hover:text-blue-900 font-medium text-sm flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>
    );
};

export default VendorDocuments;
