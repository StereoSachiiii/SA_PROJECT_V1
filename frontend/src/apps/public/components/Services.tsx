function Services() {
    return (
        <section id="services" className="py-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary-500 rounded-full"></span>
                Explore More
            </h2>
            <div className="grid md:grid-cols-2 gap-6">

                {/* Card 1 */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden flex flex-col">
                    <div className="h-40 overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800"
                            alt="Stall"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <h3 className="absolute bottom-4 left-4 font-bold text-xl text-white drop-shadow-md">Stall Reservation</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <p className="text-gray-500 text-sm mb-4">Book your perfect spot instantly.</p>
                        <a href="/stalls" className="text-primary-600 font-bold text-sm hover:text-primary-700">Book Now →</a>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden flex flex-col">
                    <div className="h-40 overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800"
                            alt="Map"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <h3 className="absolute bottom-4 left-4 font-bold text-xl text-white drop-shadow-md">Interactive Map</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <p className="text-gray-500 text-sm mb-4">View real-time floor plan availability.</p>
                        <a href="/stalls" className="text-primary-600 font-bold text-sm hover:text-primary-700">View Map →</a>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Services
