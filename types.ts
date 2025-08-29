
export interface MenuItem {
  name: string;
  description: string;
  price: number;
}

export enum RequestType {
  Order = 'ORDER',
  Bill = 'BILL',
  Service = 'SERVICE',
}

export enum RequestStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
}

export interface ServiceRequest {
  id: string;
  tableId: number;
  type: RequestType;
  status: RequestStatus;
  timestamp: Date;
  details?: any; // For order items, etc.
}

export interface OrderItem {
    item: MenuItem;
    quantity: number;
}
