import { useParams, useNavigate } from 'react-router-dom';
import { DesignerProvider, useDesigner } from './DesignerContext';
import { DesignerHeader } from './DesignerHeader';
import { DesignerCanvas } from './DesignerCanvas';
import { DesignerSidebar } from './DesignerSidebar';
import { StallEditModal } from './StallEditModal';
import { DesignerStall, DesignerZone, DesignerInfluence } from './types';
import { useStallDesigner } from './hooks/useStallDesigner';

export default function StallDesignerPage() {
    const { hallId } = useParams();
    const navigate = useNavigate();

    const {
        loading, saving, message,
        event, hall, initialStalls, initialZones, initialInfluences,
        handleSave
    } = useStallDesigner(hallId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Designer...</p>
            </div>
        );
    }

    if (!event || !hall) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mb-4">✕</div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Required</h1>
                <p className="text-gray-500 text-sm max-w-sm mb-6">{message?.text || "This hall is not assigned to an active event venue."}</p>
                <button
                    onClick={() => navigate('/admin/halls')}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-800 transition-colors"
                >
                    Back to Halls
                </button>
            </div>
        );
    }

    return (
        <DesignerProvider event={event} hall={hall} initialStalls={initialStalls} initialZones={initialZones} initialInfluences={initialInfluences}>
            <DesignerWorkspace onSave={handleSave} saving={saving} message={message} />
        </DesignerProvider>
    );
}

// ─── Inner Workspace (Consumes Context) ──────────────────────
function DesignerWorkspace({
    onSave, saving, message
}: {
    onSave: (stalls: DesignerStall[], zones: DesignerZone[], influences: DesignerInfluence[]) => Promise<void>;
    saving: boolean;
    message: { text: string; type: 'success' | 'error' } | null;
}) {
    const { stalls, zones, influences, editingStallId } = useDesigner();

    return (
        <div className="flex h-[calc(100vh-64px)] -m-6 flex-col bg-gray-50 text-gray-900 font-sans">
            <DesignerHeader
                onSave={() => onSave(stalls, zones, influences)}
                saving={saving}
                message={message}
            />

            <div className="flex-1 flex overflow-hidden">
                <DesignerCanvas />
                <DesignerSidebar />
            </div>

            {editingStallId && <StallEditModal />}
        </div>
    );
}
