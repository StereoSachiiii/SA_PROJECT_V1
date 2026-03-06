import { DesignerStall, DesignerZone, DesignerInfluence } from '../types';
import { useDesignerLoading } from './useDesignerLoading';
import { useDesignerPersistence } from './useDesignerPersistence';

export function useStallDesigner(hallId: string | undefined) {
    const {
        loading,
        event,
        hall,
        initialStalls,
        initialZones,
        initialInfluences,
        rawMapData,
        error: loadingError,
        setRawMapData
    } = useDesignerLoading(hallId);

    const {
        saving,
        message: persistenceMessage,
        handleSave: performSave
    } = useDesignerPersistence();

    const handleSave = async (currentStalls: DesignerStall[], currentZones: DesignerZone[], currentInfluences: DesignerInfluence[]) => {
        if (!event || !hall || !rawMapData) return;
        await performSave(
            event,
            hall,
            rawMapData,
            currentStalls,
            currentZones,
            currentInfluences,
            (freshMapData) => {
                setRawMapData(freshMapData);
            }
        );
    };

    const message = loadingError
        ? { text: 'Failed to load designer: ' + loadingError, type: 'error' as const }
        : persistenceMessage;

    return {
        loading,
        saving,
        message,
        event,
        hall,
        initialStalls,
        initialZones,
        initialInfluences,
        handleSave
    };
}

