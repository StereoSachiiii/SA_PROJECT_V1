import type { Hall } from "../../../shared/types/api"
import { Layers, Maximize2, Users, Wind, Thermometer, Volume2, MapPin, Sparkles } from 'lucide-react'

export const HallInfo = ({ currentHall }: { currentHall: Hall }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 pt-10 pb-16 bg-white border-t border-slate-50">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-50/50 px-6 py-8 md:p-10 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentHall.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Hall Specification</p>
                {(() => {
                  const cat = currentHall.mainCategory;
                  if (!cat) return null;
                  return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white text-blue-600 border border-blue-100 shadow-sm">
                      {String(cat).replace('_', ' ')}
                    </span>
                  );
                })()}
              </div>
            </div>
            <div className={`inline-flex px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 ${currentHall.tier === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-sm shadow-amber-100' :
              currentHall.tier === 'PREMIUM' ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm shadow-purple-100' :
                'bg-white text-slate-500 border-slate-100 shadow-sm shadow-slate-100'
              }`}>
              {currentHall.tier || 'Standard'} Tier
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Row 1: The Basics */}
            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Layers className="w-3.5 h-3.5 group-hover:text-blue-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Floor Level</p>
              </div>
              <p className="text-xl font-bold text-slate-900">Level {currentHall.floorLevel !== undefined ? currentHall.floorLevel : 'G'}</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Maximize2 className="w-3.5 h-3.5 group-hover:text-emerald-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Total Area</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {currentHall.totalSqFt ? `${currentHall.totalSqFt.toLocaleString()} sqft` : '—'}
              </p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5 group-hover:text-violet-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Capacity</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{currentHall.capacity ? `${currentHall.capacity.toLocaleString()}` : '—'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Publishers</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Wind className="w-3.5 h-3.5 group-hover:text-cyan-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Climate</p>
              </div>
              <div className="flex items-center gap-2">
                {currentHall.isAirConditioned ? (
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase rounded-lg border border-cyan-100 shadow-sm shadow-cyan-50">
                    A/C Controlled
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold text-sm">Natural</span>
                )}
              </div>
            </div>

            {/* Row 2: Secondary Metadata */}
            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Thermometer className="w-3.5 h-3.5 group-hover:text-rose-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Footfall</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{currentHall.expectedFootfall ? `${currentHall.expectedFootfall.toLocaleString()}` : '—'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Estimated / Day</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Maximize2 className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors rotate-90" />
                <p className="text-[10px] font-black uppercase tracking-widest">Ceiling</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{currentHall.ceilingHeight ? `${currentHall.ceilingHeight} ft` : '—'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Max Clearance</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Volume2 className="w-3.5 h-3.5 group-hover:text-amber-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Acoustics</p>
              </div>
              <p className="text-xl font-bold text-slate-900 capitalize">{currentHall.noiseLevel ? currentHall.noiseLevel.toLowerCase() : 'Managed'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Noise Level</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <MapPin className="w-3.5 h-3.5 group-hover:text-red-500 transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-widest">Location</p>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight block truncate group-hover:text-clip group-hover:whitespace-normal transition-all" title={currentHall.nearbyFacilities}>
                {currentHall.nearbyFacilities || 'Prime Venue Area'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}