// app/(dashboard)/dashboard/page.tsx
"use client";

import LoginButton from "@/components/LoginButton";
import AccountsList from "@/components/AccountsList";
import UploadReel from "@/components/UploadReel";
import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
import Image from "next/image";

export default function DashboardPage() {
  const { accounts } = useInstagramAccounts();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LoginButton title="add more accounts " />
        </div>

        {/* Connected Accounts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
          <AccountsList />
        </div>

        {/* Upload Section - Only show if accounts are connected */}
        {accounts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Reel</h2>
            <UploadReel />
          </div>
        )}

        {/* Status Section - Show when accounts are connected */}
        {accounts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Status</h2>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {account.profilePicture && (
                    <Image
                      src={account.profilePicture}
                      alt={account.username}
                      className="w-12 h-12 rounded-full"
                      width={48}
                      height={48}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-gray-500">@{account.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Accounts Connected State */}
        {accounts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No Instagram Accounts Connected
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Connect your Instagram Business account to start uploading reels
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
