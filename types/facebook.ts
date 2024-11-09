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
