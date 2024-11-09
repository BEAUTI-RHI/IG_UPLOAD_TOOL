// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
import { useEffect } from "react";
import LoginButton from "@/components/LoginButton";
import { Instagram } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { accounts } = useInstagramAccounts();

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (accounts.length > 0) {
      router.push("/dashboard");
    }
  }, [accounts, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Instagram className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Connect your accounts
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Instagram business accounts to start managing your
            reels
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-white shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                Required Permissions:
              </h3>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Access profile and posts</li>
                <li>• Upload media and create posts</li>
                <li>• Create and manage content</li>
                <li>• Read content posted on the Page</li>
              </ul>
            </div>

            <div className="pt-4">
              <LoginButton />
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            By connecting, you agree to grant access to manage your Instagram
            content. You can disconnect at any time.
          </div>
        </div>
      </div>
    </div>
  );
}
