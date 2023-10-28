export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: {
    path: string | number;
    message: string;
  }[];
}

export interface IGenericFilterOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
