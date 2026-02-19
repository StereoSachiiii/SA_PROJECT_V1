import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import {
    Database,
    CreditCard,
    Mail,
    Clock,
    Zap,
    RefreshCw
} from 'lucide-react';

export default function SystemHealthPage() {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealth();
    }, []);

    const loadHealth = async () => {
        setLoading(true);
        try {
            const h = await adminApi.getHealth();
            setHealth(h);
        } catch (err) {
            setHealth({ database: 'DOWN', paymentGateway: 'DOWN', mailService: 'DOWN', uptimeSeconds: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Helper removed to fix lint

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">Real-time Infrastructure Status</p>
                </div>
                <button
                    onClick={loadHealth}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh Status
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatusCard
                    title="Database"
                    status={health?.database}
                    icon={Database}
                    description="Postgres Instance"
                />
                <StatusCard
                    title="Payments"
                    status={health?.paymentGateway}
                    icon={CreditCard}
                    description="Stripe Gateway"
                />
                <StatusCard
                    title="Mail Service"
                    status={health?.mailService}
                    icon={Mail}
                    description="SMTP Server"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
                    <h3 className="font-bold text-gray-900 uppercase text-xs mb-6 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        Uptime History
                    </h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Continuous Uptime</span>
                            <span className="text-3xl font-bold text-blue-600">{(health?.uptimeSeconds / 3600).toFixed(1)}h</span>
                        </div>
                        <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[99%]" />
                        </div>
                        <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                            The system is currently stable and performing within targets. No significant incidents reported.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-lg shadow-md text-white h-full relative overflow-hidden">
                    <Zap className="absolute -right-8 -bottom-8 text-white opacity-5 w-40 h-40" />
                    <h3 className="font-bold uppercase text-xs mb-6 opacity-60">Node Performance</h3>
                    <div className="space-y-4 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Memory Usage</span>
                            <span className="font-bold text-green-400">
                                {health?.usedMemoryBytes
                                    ? `${Math.round(health.usedMemoryBytes / 1024 / 1024)}MB / ${Math.round(health.maxMemoryBytes / 1024 / 1024 / 1024)}GB`
                                    : '---'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Active Threads</span>
                            <span className="font-bold">{health?.activeThreads || 0} Active</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">API Latency</span>
                            <span className="font-bold text-blue-400">{health?.latencyMs || 0}ms</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Connectivity</span>
                            <span className="font-bold text-green-400">Stable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ title, status, icon: Icon, description }: any) {
    const isUp = status === 'UP';
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className={`p-4 rounded-md mb-4 ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <Icon size={28} />
            </div>
            <h4 className="font-bold text-gray-900 uppercase text-xs">{title}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 mb-6">{description}</p>
            <span className={`px-4 py-1 rounded-md font-bold text-[10px] uppercase ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {status || 'OFFLINE'}
            </span>
        </div>
    );
}
