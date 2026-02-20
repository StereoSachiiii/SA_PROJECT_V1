

interface ConfirmModalProps {
    confirm: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ confirm }) => { 
    return (        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${confirm ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
                <p>Are you sure you want to confirm this payment?</p>
                <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded">Confirm</button>
                </div>
            </div>
        </div>);



}
