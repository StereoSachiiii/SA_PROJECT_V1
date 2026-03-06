import { useState, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { StallTemplate, Hall, StallSize, StallCategory } from '@/shared/types/api';

export function useStallInventory(hallId: string | undefined) {
    const [stalls, setStalls] = useState<StallTemplate[]>([]);
    const [hall, setHall] = useState<Hall | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sizeFilter, setSizeFilter] = useState('ALL');
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [bulkPercentage, setBulkPercentage] = useState('');
    const [bulkForm, setBulkForm] = useState<{
        count: string;
        size: StallSize;
        category: StallCategory;
        basePriceCents: string;
    }>({
        count: '10',
        size: 'MEDIUM',
        category: 'RETAIL',
        basePriceCents: '100000'
    });
    const [generating, setGenerating] = useState(false);
    const [adjusting, setAdjusting] = useState(false);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStall, setEditingStall] = useState<StallTemplate | null>(null);
    const [editForm, setEditForm] = useState<Partial<StallTemplate>>({});
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        if (hallId) loadData();
    }, [hallId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [halls, stallData] = await Promise.all([
                adminApi.getAllHalls(),
                adminApi.getStallsByHall(Number(hallId))
            ]);
            const currentHall = halls.find((h) => h.id === Number(hallId));
            setHall(currentHall || null);
            setStalls(stallData);
        } catch (err) {
            setError('Failed to load inventory.');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkGenerate = async () => {
        if (!bulkForm.count || !bulkForm.basePriceCents) { setError('Count and price are required.'); return; }
        setGenerating(true);
        setError('');
        try {
            await adminApi.bulkGenerateStalls(Number(hallId), {
                count: parseInt(bulkForm.count),
                size: bulkForm.size,
                category: bulkForm.category,
                basePriceCents: parseInt(bulkForm.basePriceCents),
            });
            setSuccess(`Generated ${bulkForm.count} stalls successfully!`);
            setShowBulkModal(false);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Bulk generate failed.');
        } finally {
            setGenerating(false);
        }
    };

    const handleBulkPriceAdjust = async () => {
        const pct = parseFloat(bulkPercentage);
        if (isNaN(pct)) { setError('Enter a valid percentage.'); return; }
        setAdjusting(true);
        setError('');
        try {
            await adminApi.bulkPriceAdjust(Number(hallId), pct);
            setSuccess(`All stall prices adjusted by ${pct}%.`);
            setShowPriceModal(false);
            setBulkPercentage('');
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Price adjustment failed.');
        } finally {
            setAdjusting(false);
        }
    };

    const handleOpenEdit = (stall: StallTemplate) => {
        setEditingStall(stall);
        setEditForm({
            name: stall.name,
            category: stall.category,
            size: stall.size,
            sqFt: stall.sqFt,
            basePriceCents: stall.basePriceCents,
            imageUrl: stall.imageUrl || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editingStall) return;
        setSavingEdit(true);
        setError('');
        try {
            const updated = await adminApi.updateStallTemplate(Number(hallId), editingStall.id, editForm);
            setStalls(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s));
            setSuccess(`Stall ${updated.name} updated successfully.`);
            setShowEditModal(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update stall.');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleToggleBlock = async (stall: StallTemplate) => {
        setError('');
        try {
            const updated = await adminApi.setStallBlocked(Number(hallId), stall.id, stall.isAvailable);
            setStalls(prev => prev.map(s => s.id === stall.id ? { ...s, isAvailable: updated.isAvailable } : s));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update stall status.');
        }
    };

    const handleExportCsv = async () => {
        try {
            await adminApi.exportStallsCsv(Number(hallId));
        } catch (err: any) {
            setError('Failed to export CSV.');
        }
    };

    const filteredStalls = stalls.filter(s => {
        const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL'
            || (statusFilter === 'AVAILABLE' && s.isAvailable)
            || (statusFilter === 'BLOCKED' && !s.isAvailable);
        const matchesSize = sizeFilter === 'ALL' || s.size === sizeFilter;
        return matchesSearch && matchesStatus && matchesSize;
    });

    return {
        stalls, hall, loading, error, setError, success, setSuccess,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        sizeFilter, setSizeFilter,
        showBulkModal, setShowBulkModal,
        showPriceModal, setShowPriceModal,
        bulkPercentage, setBulkPercentage,
        bulkForm, setBulkForm,
        generating, adjusting,
        showEditModal, setShowEditModal,
        editingStall, setEditingStall,
        editForm, setEditForm,
        savingEdit,
        filteredStalls,
        handleBulkGenerate,
        handleBulkPriceAdjust,
        handleOpenEdit,
        handleSaveEdit,
        handleToggleBlock,
        handleExportCsv
    };
}
