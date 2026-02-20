import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '@/shared/api/adminApi';
import { StallTemplate, Hall, StallSize, StallCategory } from '@/shared/types/api';
import {
    Plus,
    ArrowLeft,
    Download,
    AlertCircle,
    TrendingUp,
    X,
    CheckCircle2
} from 'lucide-react';

import { LoadingState } from '@/shared/components/LoadingState';
import { StallFilters } from '../components/StallInventory/StallFilters';
import { StallTable } from '../components/StallInventory/StallTable';
import { BulkGenerateModal } from '../components/StallInventory/BulkGenerateModal';
import { BulkPriceModal } from '../components/StallInventory/BulkPriceModal';
import { StallEditModal } from '../components/StallInventory/StallEditModal';

const STALL_SIZES = ['SMALL', 'MEDIUM', 'LARGE'];
const STALL_CATEGORIES = ['RETAIL', 'FOOD', 'SPONSOR', 'ANCHOR'];
const STATUS_FILTERS = ['ALL', 'AVAILABLE', 'BLOCKED'];

export default function StallInventory() {
    const { id: hallId } = useParams<{ id: string }>();
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

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'FOOD': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'SPONSOR': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'ANCHOR': return 'text-purple-600 bg-purple-50 border-purple-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
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

    if (loading) return <LoadingState message="Loading Inventory..." fullPage />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Link to="/admin/halls" className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase hover:text-gray-700 transition-colors mb-3">
                        <ArrowLeft size={12} /> Back to Halls
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {hall?.name || 'Hall'} <span className="text-gray-400">— Stall Inventory</span>
                    </h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">
                        {stalls.length} Stalls Total
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                    <button
                        onClick={() => setShowPriceModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-indigo-600 font-bold text-[10px] uppercase hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        <TrendingUp size={14} /> Bulk Price %
                    </button>
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <Plus size={14} /> Bulk Generate
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={14} /> {success}
                    <button onClick={() => setSuccess('')} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: stalls.length, color: 'text-gray-900' },
                    { label: 'Available', value: stalls.filter(s => s.isAvailable).length, color: 'text-green-600' },
                    { label: 'Blocked', value: stalls.filter(s => !s.isAvailable).length, color: 'text-rose-600' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <StallFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sizeFilter={sizeFilter}
                onSizeChange={setSizeFilter}
                statusOptions={STATUS_FILTERS}
                sizeOptions={STALL_SIZES}
            />

            <StallTable
                stalls={filteredStalls}
                onEdit={handleOpenEdit}
                onToggleBlock={handleToggleBlock}
                getCategoryColor={getCategoryColor}
            />

            <BulkGenerateModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                bulkForm={bulkForm}
                onFormChange={setBulkForm}
                onConfirm={handleBulkGenerate}
                isLoading={generating}
                sizeOptions={STALL_SIZES}
                categoryOptions={STALL_CATEGORIES}
            />

            <BulkPriceModal
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                percentage={bulkPercentage}
                onPercentageChange={setBulkPercentage}
                onConfirm={handleBulkPriceAdjust}
                isLoading={adjusting}
            />

            <StallEditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                stall={editingStall}
                form={editForm}
                onFormChange={setEditForm}
                onSave={handleSaveEdit}
                isLoading={savingEdit}
                sizeOptions={STALL_SIZES}
                categoryOptions={STALL_CATEGORIES}
            />
        </div>
    );
}
