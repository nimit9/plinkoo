// Auth-specific error codes for frontend handling
export enum AuthErrorCode {
  // Registration errors
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_REGISTRATION_DATA = 'INVALID_REGISTRATION_DATA',
  
  // Login errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  
  // Email verification errors
  INVALID_VERIFICATION_TOKEN = 'INVALID_VERIFICATION_TOKEN',
  EXPIRED_VERIFICATION_TOKEN = 'EXPIRED_VERIFICATION_TOKEN',
  EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED',
  
  // General auth errors
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  
  // Server errors
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  AUTO_LOGIN_FAILED = 'AUTO_LOGIN_FAILED'
}

// Error messages that correspond to error codes
export const AuthErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.USER_ALREADY_EXISTS]: 'An account with this email already exists',
  [AuthErrorCode.INVALID_REGISTRATION_DATA]: 'Please check your registration information',
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Please verify your email before logging in',
  [AuthErrorCode.INVALID_VERIFICATION_TOKEN]: 'Invalid verification link',
  [AuthErrorCode.EXPIRED_VERIFICATION_TOKEN]: 'This verification link has expired. Please request a new one',
  [AuthErrorCode.EMAIL_ALREADY_VERIFIED]: 'Your email is already verified',
  [AuthErrorCode.NOT_AUTHENTICATED]: 'Please log in to continue',
  [AuthErrorCode.USER_NOT_FOUND]: 'No account found with this email',
  [AuthErrorCode.EMAIL_REQUIRED]: 'Email address is required',
  [AuthErrorCode.EMAIL_SEND_FAILED]: 'Failed to send verification email. Please try again',
  [AuthErrorCode.AUTO_LOGIN_FAILED]: 'Email verified, but automatic login failed. Please log in manually'
};

// Auth-specific error response interface
export interface AuthErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode: AuthErrorCode;
  data?: any;
}