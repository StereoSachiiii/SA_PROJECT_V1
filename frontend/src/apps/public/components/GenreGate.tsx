
import { PUBLISHER_GENRES } from '@/shared/constants'



export const GenreGate = ({setSelectedGenre}: {setSelectedGenre: (genre: string) => void}) => {

  return (    
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-4">Step 1 of 2</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">What do you publish?</h1>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">
            Select your primary genre so we can recommend the best hall for your stall.
            <br />
            You can still browse all halls if you want to and order any stall.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {PUBLISHER_GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200
                           text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50
                           transition-all active:scale-95"
              >
                {g.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedGenre('ANY')}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors"
          >
            Skip — show me all halls
          </button>
        </div>
      </div>
   
  )
}

export default GenreGate 
   
