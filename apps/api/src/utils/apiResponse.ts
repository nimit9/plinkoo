import { ApiResponse } from '@repo/common/types';

// Extended ApiResponse that includes error codes for better frontend handling
export class ExtendedApiResponse<T> extends ApiResponse<T> {
  errorCode?: string;
  
  constructor(statusCode: number, data: T, message = 'Success', errorCode?: string) {
    super(statusCode, data, message);
    this.errorCode = errorCode;
  }
}

// Helper to create error responses with codes
export const createErrorResponse = <T>(
  statusCode: number, 
  data: T, 
  message: string, 
  errorCode: string
): ExtendedApiResponse<T> => {
  return new ExtendedApiResponse(statusCode, data, message, errorCode);
};

// Helper to create success responses
export const createSuccessResponse = <T>(
  statusCode: number, 
  data: T, 
  message: string = 'Success'
): ExtendedApiResponse<T> => {
  return new ExtendedApiResponse(statusCode, data, message);
};