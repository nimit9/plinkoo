import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@repo/common/types';
import { AuthErrorCode, AuthErrorMessages, AuthErrorResponse } from '../types/auth-errors';

export class AuthError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: AuthErrorCode;

  constructor(errorCode: AuthErrorCode, statusCode: number = StatusCodes.BAD_REQUEST, customMessage?: string) {
    const message = customMessage || AuthErrorMessages[errorCode];
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }

  toResponse(): AuthErrorResponse {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errorCode: this.errorCode
    };
  }

  toApiResponse(): ApiResponse<any> {
    return new ApiResponse(this.statusCode, null, this.message);
  }
}

// Helper functions for common auth errors
export const createAuthError = {
  userAlreadyExists: (customMessage?: string) => 
    new AuthError(AuthErrorCode.USER_ALREADY_EXISTS, StatusCodes.CONFLICT, customMessage),
    
  invalidCredentials: (customMessage?: string) => 
    new AuthError(AuthErrorCode.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED, customMessage),
    
  emailNotVerified: (customMessage?: string) => 
    new AuthError(AuthErrorCode.EMAIL_NOT_VERIFIED, StatusCodes.FORBIDDEN, customMessage),
    
  invalidVerificationToken: (customMessage?: string) => 
    new AuthError(AuthErrorCode.INVALID_VERIFICATION_TOKEN, StatusCodes.BAD_REQUEST, customMessage),
    
  expiredVerificationToken: (customMessage?: string) => 
    new AuthError(AuthErrorCode.EXPIRED_VERIFICATION_TOKEN, StatusCodes.BAD_REQUEST, customMessage),
    
  emailAlreadyVerified: (customMessage?: string) => 
    new AuthError(AuthErrorCode.EMAIL_ALREADY_VERIFIED, StatusCodes.BAD_REQUEST, customMessage),
    
  notAuthenticated: (customMessage?: string) => 
    new AuthError(AuthErrorCode.NOT_AUTHENTICATED, StatusCodes.UNAUTHORIZED, customMessage),
    
  userNotFound: (customMessage?: string) => 
    new AuthError(AuthErrorCode.USER_NOT_FOUND, StatusCodes.NOT_FOUND, customMessage),
    
  emailRequired: (customMessage?: string) => 
    new AuthError(AuthErrorCode.EMAIL_REQUIRED, StatusCodes.BAD_REQUEST, customMessage),
    
  emailSendFailed: (customMessage?: string) => 
    new AuthError(AuthErrorCode.EMAIL_SEND_FAILED, StatusCodes.INTERNAL_SERVER_ERROR, customMessage),
    
  autoLoginFailed: (customMessage?: string) => 
    new AuthError(AuthErrorCode.AUTO_LOGIN_FAILED, StatusCodes.INTERNAL_SERVER_ERROR, customMessage)
};