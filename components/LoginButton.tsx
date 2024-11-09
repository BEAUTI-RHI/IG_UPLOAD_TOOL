// // components/LoginButton.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
// import { useEffect, useState } from "react";

// export default function LoginButton() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFBInitialized, setIsFBInitialized] = useState(false);
//   const { addAccount } = useInstagramAccounts(); // Using the context

//   useEffect(() => {
//     // Initialize Facebook SDK
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
//         cookie: true,
//         xfbml: true,
//         version: "v18.0",
//       });
//       setIsFBInitialized(true);
//     };

//     // Load the SDK
//     const loadSDK = () => {
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     };

//     loadSDK();
//   }, []);

//   const handleLogin = () => {
//     if (!isFBInitialized) {
//       console.error("Facebook SDK not initialized");
//       return;
//     }

//     setIsLoading(true);

//     window.FB.login(
//       function (loginResponse) {
//         console.log("Login response:", loginResponse);

//         if (loginResponse.authResponse) {
//           window.FB.api(
//             "/me/accounts",
//             {
//               access_token: loginResponse.authResponse.accessToken,
//               fields: "name,access_token,instagram_business_account",
//             },
//             function (pagesResponse) {
//               console.log("Pages response:", pagesResponse);

//               if (
//                 pagesResponse &&
//                 pagesResponse.data &&
//                 pagesResponse.data.length > 0
//               ) {
//                 // Find the UploaderTool page
//                 const uploaderToolPage = pagesResponse.data.find(
//                   (page: any) => page.name === "UploaderTool"
//                 );

//                 if (
//                   uploaderToolPage &&
//                   uploaderToolPage.instagram_business_account
//                 ) {
//                   // Get Instagram account details
//                   window.FB.api(
//                     `/${uploaderToolPage.instagram_business_account.id}`,
//                     {
//                       access_token: uploaderToolPage.access_token,
//                       fields: "username,profile_picture_url,name",
//                     },
//                     function (igResponse) {
//                       console.log("Instagram response:", igResponse);

//                       // Add account to context
//                       addAccount({
//                         id: uploaderToolPage.instagram_business_account.id,
//                         username: igResponse.username,
//                         name: igResponse.name || "Negus Niggas", // From your screenshot
//                         pageId: uploaderToolPage.id,
//                         pageAccessToken: uploaderToolPage.access_token,
//                         profilePicture: igResponse.profile_picture_url,
//                       });
//                     }
//                   );
//                 }
//               }
//               setIsLoading(false);
//             }
//           );
//         } else {
//           console.log("User cancelled login or did not fully authorize.");
//           setIsLoading(false);
//         }
//       },
//       {
//         scope:
//           "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,pages_manage_posts",
//         return_scopes: true,
//       }
//     );
//   };

//   return (
//     <Button onClick={handleLogin} disabled={isLoading || !isFBInitialized}>
//       {isLoading ? "Connecting..." : "Connect Instagram Account"}
//     </Button>
//   );
// }
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// "use client";

// import { Button } from "@/components/ui/button";
// import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
// import {
//   FacebookLoginResponse,
//   FacebookPagesResponse,
//   InstagramAccountDetails,
// } from "@/types/facebook";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     FB: {
//       init: (options: {
//         appId: string;
//         cookie?: boolean;
//         xfbml?: boolean;
//         version: string;
//       }) => void;
//       login: (
//         callback: (response: FacebookLoginResponse) => void,
//         options?: {
//           scope: string;
//           return_scopes?: boolean;
//         }
//       ) => void;
//       api: (
//         path: string,
//         params: {
//           access_token: string;
//           fields: string;
//         },
//         callback: (response: any) => void
//       ) => void;
//     };
//     fbAsyncInit: () => void;
//   }
// }

// export default function LoginButton({ title }: { title?: string }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFBInitialized, setIsFBInitialized] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { addAccount } = useInstagramAccounts();
//   const router = useRouter();

//   useEffect(() => {
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
//         cookie: true,
//         xfbml: true,
//         version: "v18.0",
//       });
//       setIsFBInitialized(true);
//     };

//     const loadSDK = () => {
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     };

//     loadSDK();
//   }, []);

//   const getInstagramAccountDetails = async (
//     accountId: string,
//     accessToken: string
//   ): Promise<InstagramAccountDetails> => {
//     try {
//       return new Promise((resolve, reject) => {
//         window.FB.api(
//           `/${accountId}`,
//           {
//             access_token: accessToken,
//             fields: "username,profile_picture_url,name",
//           },
//           function (response: InstagramAccountDetails & { error?: any }) {
//             if (response.error) {
//               reject(response.error);
//             } else {
//               resolve(response);
//             }
//           }
//         );
//       });
//     } catch (error) {
//       console.error("Error getting Instagram details:", error);
//       throw error;
//     }
//   };

//   const handleLogin = async () => {
//     if (!isFBInitialized) {
//       setError("Facebook SDK not initialized");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const loginResponse = await new Promise<FacebookLoginResponse>(
//         (resolve) => {
//           window.FB.login(
//             (response) => {
//               resolve(response);
//             },
//             {
//               scope:
//                 "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,pages_manage_posts",
//               return_scopes: true,
//             }
//           );
//         }
//       );

//       if (!loginResponse.authResponse) {
//         throw new Error("Login cancelled or unauthorized");
//       }

//       // Get pages
//       const pagesResponse = await new Promise<FacebookPagesResponse>(
//         (resolve, reject) => {
//           window.FB.api(
//             "/me/accounts",
//             {
//               access_token: loginResponse.authResponse.accessToken,
//               fields: "name,access_token,instagram_business_account",
//             },
//             (response) => {
//               if (response.error) {
//                 reject(response.error);
//               } else {
//                 resolve(response);
//               }
//             }
//           );
//         }
//       );

//       if (!pagesResponse.data || pagesResponse.data.length === 0) {
//         throw new Error("No Facebook Pages found");
//       }

//       // Find the UploaderTool page
//       const uploaderToolPage = pagesResponse.data.find(
//         (page) => page.name === "UploaderTool"
//       );

//       if (!uploaderToolPage?.instagram_business_account) {
//         throw new Error("UploaderTool page or Instagram account not found");
//       }

//       // Get Instagram account details
//       const igResponse = await getInstagramAccountDetails(
//         uploaderToolPage.instagram_business_account.id,
//         uploaderToolPage.access_token
//       );

//       // Add account to context
//       addAccount({
//         id: uploaderToolPage.instagram_business_account.id,
//         username: igResponse.username,
//         name: igResponse.name,
//         pageId: uploaderToolPage.id,
//         pageAccessToken: uploaderToolPage.access_token,
//         profilePicture: igResponse.profile_picture_url,
//       });

//       // Navigate to dashboard on success
//       router.push("/dashboard");
//     } catch (error: any) {
//       console.error("Login failed:", error);
//       setError(error.message || "Failed to connect Instagram account");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Button
//         onClick={handleLogin}
//         disabled={isLoading || !isFBInitialized}
//         className="w-full"
//         size="lg"
//       >
//         {isLoading ? "Connecting..." : title || "Connect with Facebook"}
//       </Button>

//       {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//     </div>
//   );
// }

// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////

// "use client";

// import { Button } from "@/components/ui/button";
// import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
// import {
//   FacebookLoginResponse,
//   FacebookPagesResponse,
//   InstagramAccountDetails,
// } from "@/types/facebook";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function LoginButton({ title }: { title?: string }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFBInitialized, setIsFBInitialized] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { addAccount } = useInstagramAccounts();
//   const router = useRouter();

//   useEffect(() => {
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
//         cookie: true,
//         xfbml: true,
//         version: "v18.0",
//       });
//       setIsFBInitialized(true);
//       console.log("Facebook SDK initialized");
//     };

//     const loadSDK = () => {
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     };

//     loadSDK();
//   }, []);

//   const getInstagramAccountDetails = async (
//     accountId: string,
//     accessToken: string
//   ): Promise<InstagramAccountDetails> => {
//     console.log("Getting Instagram details for account:", accountId);
//     try {
//       return new Promise((resolve, reject) => {
//         window.FB.api(
//           `/${accountId}`,
//           {
//             access_token: accessToken,
//             fields: "username,profile_picture_url,name",
//           },
//           function (response: InstagramAccountDetails & { error?: any }) {
//             console.log("Instagram account details response:", response);
//             if (response.error) {
//               reject(response.error);
//             } else {
//               resolve(response);
//             }
//           }
//         );
//       });
//     } catch (error) {
//       console.error("Error getting Instagram details:", error);
//       throw error;
//     }
//   };

//   const handleLogin = async () => {
//     if (!isFBInitialized) {
//       setError("Facebook SDK not initialized");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       console.log("Starting login process...");
//       const loginResponse = await new Promise<FacebookLoginResponse>(
//         (resolve) => {
//           window.FB.login(
//             (response) => {
//               console.log("FB.login response:", response);
//               resolve(response);
//             },
//             {
//               scope:
//                 "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,pages_manage_posts,business_management",
//               return_scopes: true,
//               enable_profile_selector: true,
//               auth_type: "rerequest", // Add this to force re-authentication
//             }
//           );
//         }
//       );

//       if (!loginResponse.authResponse) {
//         throw new Error("Login cancelled or unauthorized");
//       }

//       const userAccessToken = loginResponse.authResponse.accessToken;
//       console.log("Getting pages with access token:", userAccessToken);

//       // First, get all pages
//       const pagesResponse = await new Promise<FacebookPagesResponse>(
//         (resolve, reject) => {
//           window.FB.api(
//             "/me/accounts",
//             {
//               access_token: userAccessToken,
//               fields: "name,access_token,instagram_business_account",
//               limit: 100, // Increase limit to get all pages
//             },
//             (response) => {
//               console.log("Raw FB pages response:", response);
//               if (response.error) {
//                 reject(response.error);
//               } else {
//                 resolve(response);
//               }
//             }
//           );
//         }
//       );

//       console.log("Full pages response:", pagesResponse);

//       if (!pagesResponse.data || pagesResponse.data.length === 0) {
//         throw new Error(
//           "No Facebook Pages found. Please make sure you've selected pages in the dialog."
//         );
//       }

//       // Get all pages with Instagram accounts
//       const pagesWithInstagram = pagesResponse.data.filter(
//         (page) => page.instagram_business_account
//       );
//       console.log("Pages with Instagram accounts:", pagesWithInstagram);

//       if (pagesWithInstagram.length === 0) {
//         throw new Error(
//           "No Instagram Business accounts found in selected pages"
//         );
//       }

//       // Process each page with Instagram account
//       const accountPromises = pagesWithInstagram.map(async (page) => {
//         try {
//           console.log(
//             `Processing page "${page.name}" with Instagram account:`,
//             page.instagram_business_account
//           );

//           const igResponse = await getInstagramAccountDetails(
//             page.instagram_business_account!.id,
//             page.access_token
//           );

//           console.log(`Instagram details for ${page.name}:`, igResponse);

//           addAccount({
//             id: page.instagram_business_account!.id,
//             username: igResponse.username,
//             name: igResponse.name || page.name,
//             pageId: page.id,
//             pageAccessToken: page.access_token,
//             profilePicture: igResponse.profile_picture_url,
//           });

//           return {
//             success: true,
//             pageName: page.name,
//             username: igResponse.username,
//           };
//         } catch (error) {
//           console.error(`Failed to process page ${page.name}:`, error);
//           return {
//             success: false,
//             pageName: page.name,
//             error: error,
//           };
//         }
//       });

//       const results = await Promise.all(accountPromises);
//       console.log("Final processing results:", results);

//       const successfulAccounts = results.filter((r) => r.success);
//       if (successfulAccounts.length === 0) {
//         throw new Error("Failed to connect any Instagram accounts");
//       }

//       console.log("Successfully connected accounts:", successfulAccounts);
//       router.push("/dashboard");
//     } catch (error: any) {
//       console.error("Login failed:", error);
//       setError(error.message || "Failed to connect Instagram account");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Button
//         onClick={handleLogin}
//         disabled={isLoading || !isFBInitialized}
//         className="w-full"
//         size="lg"
//       >
//         {isLoading ? "Connecting..." : title || "Connect with Facebook"}
//       </Button>

//       {error && <p className="text-sm text-red-500 text-center">{error}</p>}
//     </div>
//   );
// }

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
"use client";

import { Button } from "@/components/ui/button";
import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
import {
  FacebookLoginResponse,
  FacebookMethodParams,
  FacebookPagesResponse,
  InstagramAccountDetails,
} from "@/types/facebook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Extended interface for Instagram API responses
interface InstagramApiResponse extends InstagramAccountDetails {
  error?: {
    message: string;
    code?: number;
    type?: string;
  };
}

export default function LoginButton({ title }: { title?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFBInitialized, setIsFBInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAccount } = useInstagramAccounts();
  const router = useRouter();

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      setIsFBInitialized(true);
      console.log("Facebook SDK initialized");
    };

    const loadSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadSDK();
  }, []);

  const getInstagramAccountDetails = async (
    accountId: string,
    accessToken: string
  ): Promise<InstagramAccountDetails> => {
    console.log("Getting Instagram details for account:", accountId);
    try {
      return new Promise((resolve, reject) => {
        window.FB.api(
          `/${accountId}`,
          {
            method: "get",
            access_token: accessToken,
            fields: "username,profile_picture_url,name",
          } as FacebookMethodParams,
          function (response: InstagramApiResponse) {
            console.log("Instagram account details response:", response);
            if (response.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          }
        );
      });
    } catch (error: unknown) {
      console.error("Error getting Instagram details:", error);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!isFBInitialized) {
      setError("Facebook SDK not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting login process...");
      const loginResponse = await new Promise<FacebookLoginResponse>(
        (resolve) => {
          window.FB.login(
            (response: FacebookLoginResponse) => {
              console.log("FB.login response:", response);
              resolve(response);
            },
            {
              scope:
                "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,pages_manage_posts,business_management",
              return_scopes: true,
              enable_profile_selector: true,
              auth_type: "rerequest",
            }
          );
        }
      );

      if (!loginResponse.authResponse) {
        throw new Error("Login cancelled or unauthorized");
      }

      const userAccessToken = loginResponse.authResponse.accessToken;
      console.log("Getting pages with access token:", userAccessToken);

      const pagesResponse = await new Promise<FacebookPagesResponse>(
        (resolve, reject) => {
          window.FB.api(
            "/me/accounts",
            {
              method: "get",
              access_token: userAccessToken,
              fields: "name,access_token,instagram_business_account",
              limit: 100,
            } as FacebookMethodParams,
            (response: FacebookPagesResponse) => {
              console.log("Raw FB pages response:", response);
              if (!response) {
                reject("error: fix your fucking code you donut🍩");
              } else {
                resolve(response);
              }
            }
          );
        }
      );

      console.log("Full pages response:", pagesResponse);

      if (!pagesResponse.data || pagesResponse.data.length === 0) {
        throw new Error(
          "No Facebook Pages found. Please make sure you've selected pages in the dialog."
        );
      }

      const pagesWithInstagram = pagesResponse.data.filter(
        (page) => page.instagram_business_account
      );
      console.log("Pages with Instagram accounts:", pagesWithInstagram);

      if (pagesWithInstagram.length === 0) {
        throw new Error(
          "No Instagram Business accounts found in selected pages"
        );
      }

      const accountPromises = pagesWithInstagram.map(async (page) => {
        try {
          console.log(
            `Processing page "${page.name}" with Instagram account:`,
            page.instagram_business_account
          );

          const igResponse = await getInstagramAccountDetails(
            page.instagram_business_account!.id,
            page.access_token
          );

          console.log(`Instagram details for ${page.name}:`, igResponse);

          addAccount({
            id: page.instagram_business_account!.id,
            username: igResponse.username,
            name: igResponse.name || page.name,
            pageId: page.id,
            pageAccessToken: page.access_token,
            profilePicture: igResponse.profile_picture_url,
          });

          return {
            success: true,
            pageName: page.name,
            username: igResponse.username,
          };
        } catch (error: unknown) {
          console.error(`Failed to process page ${page.name}:`, error);
          return {
            success: false,
            pageName: page.name,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      });

      const results = await Promise.all(accountPromises);
      console.log("Final processing results:", results);

      const successfulAccounts = results.filter((r) => r.success);
      if (successfulAccounts.length === 0) {
        throw new Error("Failed to connect any Instagram accounts");
      }

      console.log("Successfully connected accounts:", successfulAccounts);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to connect Instagram account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleLogin}
        disabled={isLoading || !isFBInitialized}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Connecting..." : title || "Connect with Facebook"}
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
