// facebook.ts

// Existing interfaces that should not be changed
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

// Update FacebookApiResponse to be more flexible
export interface FacebookApiResponse<T> {
  error?: FacebookApiError;
  data?: T;
  // Add other common Facebook API response fields
  id?: string;
  name?: string;
  username?: string;
  profile_picture_url?: string;
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
  access_token?: string;
  fields?: string;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

// Update FacebookStatic interface to include specific method signatures
export interface FacebookStatic {
  init(params: FacebookInitParams): void;

  login(
    callback: (response: FacebookLoginResponse) => void,
    options?: FacebookLoginOptions
  ): void;

  // Generic API method
  api<T>(
    path: string,
    params: FacebookMethodParams,
    callback: (response: FacebookApiResponse<T>) => void
  ): void;

  // Specific method for Instagram account details
  api(
    path: string,
    params: FacebookMethodParams,
    callback: (
      response: InstagramAccountDetails & { error?: FacebookApiError }
    ) => void
  ): void;

  // Method for pages
  api(
    path: string,
    params: FacebookMethodParams,
    callback: (response: FacebookPagesResponse) => void
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
