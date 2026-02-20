function VisionMission() {
    return (
        <section className="bg-secondary text-white py-12 px-8 rounded-3xl shadow-tablet relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="relative z-10 text-center mb-10">
                <h2 className="text-3xl font-bold text-primary-400 mb-3">
                    Vision, Mission & Values
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mb-4 mx-auto text-secondary font-bold text-xl shadow-glow-gold">
                        V
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Our Vision</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        To become the premier digital platform that simplifies and elevates the book fair experience for everyone.
                    </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mb-4 mx-auto text-secondary font-bold text-xl shadow-glow-gold">
                        M
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Our Mission</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        To provide a secure, transparent, and aesthetically pleasing reservation system for authors and stalls.
                    </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mb-4 mx-auto text-secondary font-bold text-xl shadow-glow-gold">
                        C
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Core Values</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Efficiency, transparency, innovation, and a relentless commitment to literary excellence.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default VisionMission;
