// src/pages/HomePage.tsx

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { genreApi, reservationApi } from '../api'
import type { GenreRequest } from '../types'

function HomePage() {
    const queryClient = useQueryClient()
    const publisherId = Number(localStorage.getItem('publisherId'))

    const [newGenre, setNewGenre] = useState('')

    // ===============================
    // Fetch Reservations
    // ===============================
    const {
        data: reservations,
        isLoading: reservationsLoading,
        isError: reservationsError
    } = useQuery({
        queryKey: ['reservations', publisherId],
        queryFn: () => reservationApi.getByPublisher(publisherId),
        enabled: !!publisherId,
    })

    // ===============================
    // Fetch Genres
    // ===============================
    const {
        data: genres,
        isLoading: genresLoading,
        isError: genresError
    } = useQuery({
        queryKey: ['genres', publisherId],
        queryFn: () => genreApi.getByPublisher(publisherId),
        enabled: !!publisherId,
    })

    // ===============================
    // Add Genre Mutation
    // ===============================
    const addGenreMutation = useMutation({
        mutationFn: (data: GenreRequest) => genreApi.add(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['genres', publisherId]
            })
            setNewGenre('')
        },
    })

    const handleAddGenre = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGenre.trim()) return

        addGenreMutation.mutate({
            publisherId,
            name: newGenre
        })
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
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-5xl mx-auto">

                {/* ===============================
                    Page Title
                =============================== */}
                <h1 className="text-3xl font-bold text-blue-900 mb-8">
                    Publisher Dashboard
                </h1>

                {/* ===============================
                    Reservations Section
                =============================== */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Your Stall Reservations
                    </h2>

                    {reservationsLoading && (
                        <p className="text-gray-500">Loading reservations...</p>
                    )}

                    {reservationsError && (
                        <p className="text-red-500">Failed to load reservations.</p>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                        {reservations?.map((res: any) => (
                            <div
                                key={res.id}
                                className="bg-white rounded-xl shadow-md p-5 border"
                            >
                                <h3 className="text-lg font-bold text-blue-900">
                                    {res.stall?.name}
                                </h3>

                                <p className="text-sm text-gray-600 mb-2">
                                    Size: {res.stall?.size}
                                </p>

                                <div className="mt-3 text-xs text-gray-400">
                                    QR Code: {res.qrCode?.slice(0, 10)}...
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===============================
                    Genres Section
                =============================== */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Literary Genres You'll Display
                    </h2>

                    {genresLoading && (
                        <p className="text-gray-500">Loading genres...</p>
                    )}

                    {genresError && (
                        <p className="text-red-500">Failed to load genres.</p>
                    )}

                    {/* Existing Genres */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {genres?.map((genre: any) => (
                            <span
                                key={genre.id}
                                className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    {/* Add Genre Form */}
                    <form
                        onSubmit={handleAddGenre}
                        className="flex gap-3 mb-6"
                    >
                        <input
                            type="text"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                            placeholder="Add a genre..."
                            className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            type="submit"
                            disabled={addGenreMutation.isPending}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {addGenreMutation.isPending ? 'Adding...' : 'Add'}
                        </button>
                    </form>

                    {/* Quick Add Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {commonGenres.map((genre) => (
                            <button
                                key={genre}
                                onClick={() =>
                                    addGenreMutation.mutate({
                                        publisherId,
                                        name: genre
                                    })
                                }
                                className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100"
                            >
                                + {genre}
                            </button>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default HomePage
