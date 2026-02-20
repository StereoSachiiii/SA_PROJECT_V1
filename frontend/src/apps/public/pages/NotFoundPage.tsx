import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <AlertTriangle size={48} />
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">PAGE NOT FOUND</h1>
            <p className="text-gray-500 max-w-md mb-10 font-medium">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>

            <Link
                to="/"
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
            >
                <Home size={16} />
                Back to Safety
            </Link>

            <div className="mt-20 opacity-10">
                <p className="font-black italic text-8xl select-none">404</p>
            </div>
        </div>
    );
};

export default NotFoundPage;
