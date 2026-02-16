function VisionMission() {
    return (
        <section className="bg-gray-100 py-16 px-6 text-center">
            <h2 className="text-3xl font-bold text-blue-800">
                Vision, Mission and Values
            </h2>

            <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded"></div>

            <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-6xl mx-auto">
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                    <p className="text-gray-600">
                        To become a reliable and innovative digital platform 
                        that simplifies stall reservations for book fairs.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                        To provide a user-friendly and secure stall reservation 
                        system that improves transparency and ensures smooth management.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Our Core Values</h3>
                    <p className="text-gray-600">
                        Efficiency, transparency, reliability, innovation, and 
                        customer satisfaction.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default VisionMission;
