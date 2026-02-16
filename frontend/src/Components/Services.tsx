function Services() {
    return (
        <section className="py-16 px-6 text-center">
            <h2 className="text-3xl font-bold text-red-600">
                Our Services
            </h2>

            <div className="w-20 h-1 bg-orange-500 mx-auto mt-2 rounded"></div>

            <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

                {/* Card 1 */}
                <div className="bg-white rounded shadow hover:shadow-lg transition">
                    <img
                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                        alt="Stall"
                        className="rounded-t w-full h-56 object-cover"
                    />
                    <div className="p-6 text-left">
                        <h3 className="font-semibold text-lg mb-2">
                            Online Stall Reservation
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Book stalls easily without manual paperwork.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline">
                            Read More
                        </a>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded shadow hover:shadow-lg transition">
                    <img
                        src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                        alt="Layout"
                        className="rounded-t w-full h-56 object-cover"
                    />
                    <div className="p-6 text-left">
                        <h3 className="font-semibold text-lg mb-2">
                            Interactive Stall Layout View
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            View available and booked stalls in real-time.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline">
                            Read More
                        </a>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded shadow hover:shadow-lg transition">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                        alt="Payment"
                        className="rounded-t w-full h-56 object-cover"
                    />
                    <div className="p-6 text-left">
                        <h3 className="font-semibold text-lg mb-2">
                            Secure Online Payment System
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Safe and reliable online payments.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline">
                            Read More
                        </a>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Services
