"use client";

import Script from "next/script";
import { useEffect } from "react";
import { FacebookInitParams, FacebookStatic } from "@/types/facebook";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookStatic;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      const initParams: FacebookInitParams = {
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      };

      if (!initParams.appId) {
        console.error(
          "Facebook App ID is not defined in environment variables"
        );
        return;
      }

      window.FB.init(initParams);
    };

    // Load Facebook SDK
    const loadSDK = () => {
      if (document.getElementById("facebook-jssdk")) {
        return;
      }

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    loadSDK();

    // Cleanup
    return () => {
      const script = document.getElementById("facebook-jssdk");
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <Script
      id="facebook-jssdk"
      strategy="lazyOnload"
      src="https://connect.facebook.net/en_US/sdk.js"
    />
  );
}
