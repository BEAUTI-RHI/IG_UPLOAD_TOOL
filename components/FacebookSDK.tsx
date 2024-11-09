// components/FacebookSDK.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookSDK;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
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
