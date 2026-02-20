
interface CancelModalProps {
  cancel: boolean;
}


/**
 * @brief Modal component to confirm cancellation of a reservation/payment. Displays a confirmation message and options to proceed with cancellation or abort the action.
 * 
 * @param props 
 * @returns 
 */
const CancelModal = (props: CancelModalProps) => {



  return (
    <div className='h-screen w-full flex items-center justify-center'>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cancel Action</h2>
        <p>Are you sure you want to cancel this payment?</p>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={() => { props.cancel = false; }}>No</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded">Yes, Cancel</button>
        </div>
      </div>

    </div>
  )
}

export default CancelModal
