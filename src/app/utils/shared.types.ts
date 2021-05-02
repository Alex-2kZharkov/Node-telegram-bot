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


