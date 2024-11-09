// components/AccountsList.tsx
"use client";

import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function AccountsList() {
  const { accounts, selectedAccounts, setSelectedAccounts } =
    useInstagramAccounts();

  if (accounts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No Instagram accounts connected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Connected Accounts</h3>
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
          <Checkbox
            checked={selectedAccounts.includes(account.id)}
            onCheckedChange={(checked) => {
              setSelectedAccounts(
                checked
                  ? [...selectedAccounts, account.id]
                  : selectedAccounts.filter((id) => id !== account.id)
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}
