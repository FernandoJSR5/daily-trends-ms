export interface ApiError {
  status: 'error';
  code: number;
  description?: string;
}
