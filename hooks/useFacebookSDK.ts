// hooks/useFacebookSDK.ts
"use client";

import { useState, useEffect } from "react";

export function useFacebookSDK() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if FB is already initialized
    if (window.FB) {
      setIsInitialized(true);
      return;
    }

    // Initialize the Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });

      setIsInitialized(true);
    };

    // Load the SDK
    const loadSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    loadSDK();
  }, []);

  return isInitialized;
}
