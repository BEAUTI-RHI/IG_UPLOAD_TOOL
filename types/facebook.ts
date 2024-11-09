export interface FacebookLoginResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain: string;
    data_access_expiration_time: number;
  };
  status: "connected" | "not_authorized" | "unknown";
}

export interface FacebookPage {
  name: string;
  id: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface InstagramAccountDetails {
  username: string;
  name: string;
  profile_picture_url: string;
  id: string;
}

export interface FacebookPagesResponse {
  data: FacebookPage[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

// interface FacebookAuthResponse {
//   userID: string;
//   expiresIn: number;
//   accessToken: string;
//   signedRequest: string;
//   graphDomain: string;
//   grantedScopes: string;
//   data_access_expiration_time: number;
// }

// interface FacebookLoginResponse {
//   authResponse: FacebookAuthResponse;
//   status: "connected" | "not_authorized" | "unknown";
// }

// types/facebook.ts - Add these interfaces to your existing types file

// New interfaces for Facebook SDK
export interface FacebookInitParams {
  appId: string;
  cookie?: boolean;
  xfbml?: boolean;
  version: string;
}

export interface FacebookLoginOptions {
  scope: string;
  return_scopes?: boolean;
  enable_profile_selector?: boolean;
  auth_type?: string;
}

export interface FacebookApiError {
  message: string;
  code: number;
  type: string;
}

// Type for API responses
export interface FacebookApiResponse<T> {
  error?: FacebookApiError;
  data?: T;
}

// Parameters for API calls
export interface FacebookApiParams {
  access_token?: string;
  fields?: string;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

// Method parameters
export interface FacebookMethodParams {
  method?: "get" | "post" | "delete";
  params?: FacebookApiParams;
}

// Static Facebook SDK interface
export interface FacebookStatic {
  init(params: FacebookInitParams): void;

  login(
    callback: (response: FacebookLoginResponse) => void,
    options?: FacebookLoginOptions
  ): void;

  api<T>(
    path: string,
    params: FacebookMethodParams,
    callback: (response: FacebookApiResponse<T>) => void
  ): void;

  api<T>(
    path: string,
    callback: (response: FacebookApiResponse<T>) => void
  ): void;

  getAuthResponse(): FacebookLoginResponse["authResponse"] | null;

  getLoginStatus(
    callback: (response: FacebookLoginResponse) => void,
    force?: boolean
  ): void;

  logout(callback?: (response: FacebookLoginResponse) => void): void;
}

// Declare global Facebook SDK
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookStatic;
  }
}
