import { Activity, Database, CreditCard, Mail, Clock } from 'lucide-react';

interface HealthPreviewProps {
    health: {
        database: string;
        paymentGateway: string;
        mailService: string;
        uptimeSeconds: number;
    } | null;
    onRefresh?: () => void;
}

export default function HealthPreview({ health, onRefresh }: HealthPreviewProps) {
    const isUp = (status: string) => status === 'UP';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase">
                    <Activity size={16} className="text-blue-600" />
                    System Status
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                    >
                        Refresh
                    </button>
                )}
            </div>

            <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                        <Database size={16} className={isUp(health?.database || '') ? 'text-green-500' : 'text-red-500'} />
                        Database
                    </div>
                    <StatusBadge status={health?.database || 'UNKNOWN'} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                        <CreditCard size={16} className={isUp(health?.paymentGateway || '') ? 'text-green-500' : 'text-red-500'} />
                        Payments
                    </div>
                    <StatusBadge status={health?.paymentGateway || 'UNKNOWN'} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                        <Mail size={16} className={isUp(health?.mailService || '') ? 'text-green-500' : 'text-red-500'} />
                        Mail Server
                    </div>
                    <StatusBadge status={health?.mailService || 'UNKNOWN'} />
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                        <Clock size={12} />
                        Uptime
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600">
                        {health ? (health.uptimeSeconds / 3600).toFixed(2) : '0.00'}h
                    </span>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isUp = status === 'UP';
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {status}
        </span>
    );
}
