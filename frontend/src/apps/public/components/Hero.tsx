import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Book Fair"
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-32 text-center flex flex-col items-center">

                {/* Glass Badge */}
                <span className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 
                    rounded-full text-sm font-semibold tracking-wide
                    bg-white/10 backdrop-blur-lg 
                    border border-white/20 text-primary-300">
                    ✨ The Literary Event of 2026
                </span>

                {/* Heading */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8">
                    Book Fair <span className="text-primary-400">2026</span>
                </h1>

                {/* Subtext */}
                <p className="mt-8 max-w-3xl text-xl sm:text-2xl text-gray-200 leading-relaxed font-medium">
                    Secure your spot at the city's premier literary event.
                    Reserve stalls, manage inventory, and connect with thousands of readers.
                </p>

                {/* Buttons */}
                <div className="mt-16 flex flex-col sm:flex-row gap-6">

                    {/* Primary */}
                    <Link
                        to="/events"
                        className="group relative inline-flex items-center justify-center 
                        px-10 py-5 rounded-2xl text-lg font-bold 
                        text-white bg-primary-500
                        shadow-xl shadow-primary-500/30
                        transition-all duration-300
                        hover:bg-primary-400 hover:shadow-primary-400/40
                        hover:-translate-y-1 hover:scale-[1.02]"
                    >
                        Reserve a Stall
                        <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2 text-xl">
                            →
                        </span>
                    </Link>

                    {/* Secondary */}
                    <a
                        href="#services"
                        className="inline-flex items-center justify-center
                        px-10 py-5 rounded-2xl text-lg font-bold
                        text-white bg-white/10 backdrop-blur-md
                        border border-white/20
                        transition-all duration-300
                        hover:bg-white/20 hover:-translate-y-1 hover:scale-[1.02]"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    )
}
