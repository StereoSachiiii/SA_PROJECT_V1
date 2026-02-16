import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { genreApi, reservationApi } from '../api'
import type { GenreRequest } from '../types'
import slide1 from '../assets/photo1.jpg'
import slide2 from '../assets/photo2.jpg'
import slide3 from '../assets/photo3.jpg'


/**
 * Home Page (after reservation)
 * 
 * TODO [FRONTEND DEV 3]:
 * - Display user's reservations with stall info
 * - Show QR codes for each reservation
 * - Add genre selection with common genres list
 * - Add better styling
 */
function HomePage() {
    const queryClient = useQueryClient()
    const userId = Number(localStorage.getItem('userId'))
    const [newGenre, setNewGenre] = useState('')

    const { data: reservations } = useQuery({
        queryKey: ['reservations', userId],
        queryFn: () => reservationApi.getByUser(userId),
        enabled: !!userId,
    })

    const { data: genres } = useQuery({
        queryKey: ['genres', userId],
        queryFn: () => genreApi.getByUser(userId),
        enabled: !!userId,
    })

    const addGenreMutation = useMutation({
        mutationFn: (data: GenreRequest) => genreApi.add(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres', userId] })
            setNewGenre('')
        },
    })

    const handleAddGenre = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGenre.trim()) return
        addGenreMutation.mutate({ userId, name: newGenre })
    }

    // TODO: Add common genres as quick-select buttons
    const commonGenres = ['Fiction', 'Non-Fiction', 'Children', 'Educational', 'Comics', 'Poetry']

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Reservations Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Reservations</h2>
                <div className="grid grid-cols-3 gap-4">
                    {reservations?.map((res) => (
                        <div key={res.id} className="bg-white p-4 rounded shadow">
                            <div className="font-bold text-lg">{res.stall.name}</div>
                            <div className="text-sm text-gray-600">{res.stall.size}</div>
                            {/* TODO: Generate actual QR code display */}
                            <div className="mt-2 text-xs text-gray-400">QR: {res.qrCode.slice(0, 8)}...</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Genres Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Literary Genres You'll Display</h2>

                {/* Current genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {genres?.map((genre) => (
                        <span key={genre.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {genre.name}
                        </span>
                    ))}
                </div>

                {/* Add genre form */}
                <form onSubmit={handleAddGenre} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        placeholder="Add a genre..."
                        className="border rounded px-3 py-2 flex-1"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Add
                    </button>
                </form>

                {/* Quick add buttons */}
                <div className="flex flex-wrap gap-2">
                    {commonGenres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => addGenreMutation.mutate({ userId, name: genre })}
                            className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                        >
                            + {genre}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HomePage
