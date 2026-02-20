import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    subtitle?: string;
    color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
};

export default function MetricsCard({ title, value, icon: Icon, subtitle, color = 'blue' }: MetricsCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`p-3 rounded-md border ${colorMap[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-gray-500 text-xs font-semibold uppercase">{title}</h3>
                <div className="text-2xl font-bold text-gray-900 mt-0.5">{value}</div>
                {subtitle && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{subtitle}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
