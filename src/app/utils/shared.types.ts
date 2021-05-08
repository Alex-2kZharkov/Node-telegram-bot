export interface AppResponse<T = any> {
  message?: string;
  status?: number;
  data?: T;
  total?: number;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface BaseSortingFields {
  createdAt?: SortDirection;
  updatedAt?: SortDirection;
}

export enum RoleCodes {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  ANONYME = 'ANONYME',
}

export enum OrderStatuses {
  UNCONFIRMED= 'UNCONFIRMED',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED'
}

export interface OrderFields {
  createdAt: Date,
  id: string,
  customerName: string,
  catalog: string,
  stuff: string,
  orderQuantity: number,
  orderAmount: number,
  stuffQuantity: number,
  stuffAmount: number,
  status: OrderStatuses,
}