import { useNavigate } from 'react-router-dom';

export const CheckoutExpired = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-12 rounded-[2rem] shadow-2xl text-center max-w-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Reservation Expired</h2>
                <p className="text-slate-500 mb-8 font-medium">This checkout link is no longer active.</p>
                <button onClick={() => navigate('/home')} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl">Back Home</button>
            </div>
        </div>
    );
};
