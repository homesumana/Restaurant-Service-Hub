
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ServiceRequest, RequestType, RequestStatus } from '../types';

interface QueueContextType {
  requests: ServiceRequest[];
  addRequest: (tableId: number, type: RequestType, details?: any) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  const addRequest = useCallback((tableId: number, type: RequestType, details?: any) => {
    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}-${Math.random()}`,
      tableId,
      type,
      status: RequestStatus.Pending,
      timestamp: new Date(),
      details,
    };
    setRequests(prevRequests => [...prevRequests, newRequest]);
  }, []);

  const updateRequestStatus = useCallback((requestId: string, status: RequestStatus) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      ).filter(req => status !== RequestStatus.Completed || req.id !== requestId) // Remove if completed
    );
  }, []);

  return (
    <QueueContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
