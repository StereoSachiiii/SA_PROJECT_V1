import { Reservation } from '../types/api';

interface ReservationTimelineProps {
  reservation: Reservation;
}

export const ReservationTimeline = ({ reservation }: ReservationTimelineProps) => {
  const timeline = [
    {
      label: 'Created',
      date: reservation.created_at,
      completed: true,
      icon: '✓'
    },
    {
      label: 'Payment Pending',
      date: reservation.paid_at || null,
      completed: reservation.status === 'PAID' || reservation.status === 'CHECKED_IN',
      icon: reservation.status === 'PENDING_PAYMENT' ? '⏳' : '✓'
    },
    {
      label: 'Paid',
      date: reservation.paid_at,
      completed: reservation.status === 'PAID' || reservation.status === 'CHECKED_IN',
      icon: reservation.paid_at ? '✓' : '○'
    },
    {
      label: 'Checked In',
      date: null,
      completed: reservation.status === 'CHECKED_IN',
      icon: reservation.status === 'CHECKED_IN' ? '✓' : '○'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Timeline</h3>
      <div className="relative">
        {timeline.map((step, idx) => (
          <div key={idx} className="flex items-start mb-4 last:mb-0">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              step.completed ? 'bg-green-500' : step.completed === false ? 'bg-gray-300' : 'bg-blue-400'
            }`}>
              {step.icon}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium text-gray-800">{step.label}</p>
              {step.date && (
                <p className="text-sm text-gray-500">
                  {new Date(step.date).toLocaleString()}
                </p>
              )}
            </div>
            {idx < timeline.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
