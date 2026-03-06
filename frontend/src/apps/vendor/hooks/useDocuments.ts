import { useState, useEffect } from 'react';
import { documentApi } from '@/shared/api/documentApi';
import { DocumentResponse } from '@/shared/types/api';

export function useDocuments() {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
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
        setIsDeleting(true);
        try {
            await documentApi.delete(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            alert('Failed to delete document');
        } finally {
            setIsDeleting(false);
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

    return {
        documents,
        isLoading,
        isDeleting,
        error,
        handleUploadSuccess,
        handleDelete,
        handleDownload
    };
}
