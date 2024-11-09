// types/facebook.d.ts
interface FacebookLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    reauthorize_required_in: string;
    signedRequest: string;
    userID: string;
  };
}

interface FacebookSDK {
  init(options: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }): void;
  login(
    callback: (response: FacebookLoginResponse) => void,
    options?: { scope: string; return_scopes: boolean }
  ): void;
  api(
    path: string,
    params: { [key: string]: any },
    callback: (response: any) => void
  ): void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
    fbAsyncInit: () => void;
  }
}

export {};
