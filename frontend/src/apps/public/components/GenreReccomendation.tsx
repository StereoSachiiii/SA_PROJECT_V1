import React from 'react'

interface GenreReccomendationProps {
  genre: string
}

/**
 * A small floating badge that confirms the user's current genre preference
 * and explains why some halls are glowing.
 */
const GenreReccomendation: React.FC<GenreReccomendationProps> = ({ genre }) => {
  if (!genre || genre === 'SKIP') return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 
                    rounded-full shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full shadow-sm">
        <span className="text-[10px] text-white">★</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-emerald-800 font-black leading-none uppercase tracking-tighter">
          Tailored for you
        </span>
        <span className="text-[9px] text-emerald-600 font-bold leading-tight">
          {genre.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

export default GenreReccomendation