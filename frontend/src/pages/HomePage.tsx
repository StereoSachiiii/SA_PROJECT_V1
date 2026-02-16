import Slider from '../Components/Slider'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { genreApi, reservationApi } from '../api'
import type { GenreRequest } from '../types'

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

    const commonGenres = [
        'Fiction',
        'Non-Fiction',
        'Children',
        'Educational',
        'Comics',
        'Poetry'
    ]

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Slider */}
            <Slider />

            {/* Reservations Section */}
            <section className="mb-8 mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Reservations</h2>
                <div className="grid grid-cols-3 gap-4">
                    {reservations?.map((res) => (
                        <div key={res.id} className="bg-white p-4 rounded shadow">
                            <div className="font-bold text-lg">{res.stall.name}</div>
                            <div className="text-sm text-gray-600">{res.stall.size}</div>
                            <div className="mt-2 text-xs text-gray-400">
                                QR: {res.qrCode.slice(0, 8)}...
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Genres Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">
                    Literary Genres You'll Display
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                    {genres?.map((genre) => (
                        <span
                            key={genre.id}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>

                <form onSubmit={handleAddGenre} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        placeholder="Add a genre..."
                        className="border rounded px-3 py-2 flex-1"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {commonGenres.map((genre) => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() =>
                                addGenreMutation.mutate({ userId, name: genre })
                            }
                            className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                        >
                            + {genre}
                        </button>
                    ))}
                </div>
            </section>

            {/* Our Website Section */}
            <section className="text-center mt-12 px-6">
                <h2 className="text-3xl font-bold text-blue-800">
                    Our Website
                </h2>

                {/* Stylish Blue Underline */}
                <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded"></div>

                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6">
                    Welcome to our Book Fair Stall Reservation System, a simple and
                    efficient platform designed to make stall booking easier for vendors
                    and organizers. This website allows book sellers, publishers, and
                    exhibitors to reserve stalls online without any hassle. Users can
                    view available stalls, select their preferred locations, and confirm
                    reservations quickly and securely. Our system helps reduce manual
                    paperwork, saves time, and ensures a smooth management process for
                    book fair events.
                </p>

                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow">
                    Read More
                </button>
            </section>
        </div>
    )
}

export default HomePage
