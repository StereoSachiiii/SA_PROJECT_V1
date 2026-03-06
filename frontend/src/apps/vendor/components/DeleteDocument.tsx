import React, { useState } from 'react';
import { Trash2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface DeleteDocumentProps {
    onDelete: () => Promise<void>;
    isDeleting?: boolean;
}

const DeleteDocument: React.FC<DeleteDocumentProps> = ({ onDelete, isDeleting = false }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleInitialClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsConfirming(true);
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsConfirming(false);
    };

    const handleConfirm = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await onDelete();
        } finally {
            setIsConfirming(false);
        }
    };

    if (isConfirming) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={XCircle}
                    onClick={handleCancel}
                    className="text-slate-400 hover:text-slate-600"
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    icon={AlertTriangle}
                    isLoading={isDeleting}
                    onClick={handleConfirm}
                >
                    Confirm Delete
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            icon={Trash2}
            onClick={handleInitialClick}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Document"
        />
    );
};

export default DeleteDocument;