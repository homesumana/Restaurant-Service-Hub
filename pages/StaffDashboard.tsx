
import React, { useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { ServiceRequest, RequestStatus, RequestType, OrderItem } from '../types';
import { BillIcon, FoodIcon, ServiceIcon } from '../components/icons/Icons';

const requestTypeDetails = {
  [RequestType.Order]: {
    icon: FoodIcon,
    label: 'Food Order',
    color: 'bg-blue-500',
  },
  [RequestType.Bill]: {
    icon: BillIcon,
    label: 'Bill Request',
    color: 'bg-yellow-500',
  },
  [RequestType.Service]: {
    icon: ServiceIcon,
    label: 'Service Call',
    color: 'bg-red-500',
  },
};

const statusDetails = {
  [RequestStatus.Pending]: {
    label: 'Pending',
    color: 'border-red-500',
    actions: [RequestStatus.InProgress],
  },
  [RequestStatus.InProgress]: {
    label: 'In Progress',
    color: 'border-yellow-500',
    actions: [RequestStatus.Completed],
  },
    [RequestStatus.Completed]: {
    label: 'Completed',
    color: 'border-green-500',
    actions: [],
  },
};

const RequestCard: React.FC<{ request: ServiceRequest }> = ({ request }) => {
    const { updateRequestStatus } = useQueue();
    const { icon: Icon, label, color } = requestTypeDetails[request.type];
    const { label: statusLabel, color: statusColor, actions } = statusDetails[request.status];

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${statusColor} transform hover:scale-105 transition-transform duration-200`}>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Table {request.tableId}</h3>
                        <p className={`text-sm font-semibold text-white px-2 py-0.5 rounded-full inline-block mt-1 ${color}`}>{label}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(request.timestamp)}</p>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">{statusLabel}</p>
                    </div>
                </div>

                {request.type === RequestType.Order && request.details?.items && (
                    <div className="mt-4 border-t dark:border-gray-600 pt-3">
                        <h4 className="font-semibold mb-2">Order Details:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-300">
                            {request.details.items.map((orderItem: OrderItem) => (
                                <li key={orderItem.item.name}>
                                    {orderItem.quantity}x {orderItem.item.name}
                                </li>
                            ))}
                        </ul>
                        <p className="text-right font-bold mt-2">Total: ${request.details.total.toFixed(2)}</p>
                    </div>
                )}
                 {request.type === RequestType.Service && request.details?.message && (
                     <p className="mt-4 text-gray-700 dark:text-gray-300 italic">"{request.details.message}"</p>
                 )}

                <div className="mt-4 pt-4 border-t dark:border-gray-600 flex gap-2">
                    {actions.includes(RequestStatus.InProgress) && (
                        <button 
                            onClick={() => updateRequestStatus(request.id, RequestStatus.InProgress)}
                            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm font-semibold"
                        >
                            Start
                        </button>
                    )}
                    {actions.includes(RequestStatus.Completed) && (
                        <button 
                            onClick={() => updateRequestStatus(request.id, RequestStatus.Completed)}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                        >
                            Complete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const StaffDashboard: React.FC = () => {
  const { requests } = useQueue();

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [requests]);

  const pendingRequests = sortedRequests.filter(r => r.status === RequestStatus.Pending);
  const inProgressRequests = sortedRequests.filter(r => r.status === RequestStatus.InProgress);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Staff Dashboard</h1>
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">All Clear!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">No active service requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Pending ({pendingRequests.length})</h2>
                <div className="space-y-6">
                    {pendingRequests.map(req => <RequestCard key={req.id} request={req} />)}
                    {pendingRequests.length === 0 && <p className="text-gray-500 dark:text-gray-400">No pending requests.</p>}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">In Progress ({inProgressRequests.length})</h2>
                 <div className="space-y-6">
                    {inProgressRequests.map(req => <RequestCard key={req.id} request={req} />)}
                    {inProgressRequests.length === 0 && <p className="text-gray-500 dark:text-gray-400">No requests in progress.</p>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
