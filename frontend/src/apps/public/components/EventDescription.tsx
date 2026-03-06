import { Info } from 'lucide-react';

interface EventDescriptionProps {
    description: string | null | undefined;
}

export function EventDescription({ description }: EventDescriptionProps) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-600" />
                About the Event
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {description ? (
                    <p className="whitespace-pre-line">{description}</p>
                ) : (
                    <p className="italic text-slate-400">No description available for this event.</p>
                )}
            </div>
        </div>
    );
}
