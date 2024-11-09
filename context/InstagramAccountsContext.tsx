// context/InstagramAccountsContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  InstagramAccount,
  InstagramAccountsContextType,
} from "@/types/instagram";

const InstagramAccountsContext = createContext<
  InstagramAccountsContextType | undefined
>(undefined);

export function InstagramAccountsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addAccount = (account: InstagramAccount) => {
    setAccounts((prev) => {
      // Don't add if already exists
      if (prev.some((acc) => acc.id === account.id)) {
        return prev;
      }
      return [...prev, account];
    });
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
    setSelectedAccounts((prev) => prev.filter((accId) => accId !== id));
  };

  return (
    <InstagramAccountsContext.Provider
      value={{
        accounts,
        selectedAccounts,
        addAccount,
        removeAccount,
        setSelectedAccounts,
        isLoading,
      }}
    >
      {children}
    </InstagramAccountsContext.Provider>
  );
}

export function useInstagramAccounts() {
  const context = useContext(InstagramAccountsContext);
  if (context === undefined) {
    throw new Error(
      "useInstagramAccounts must be used within an InstagramAccountsProvider"
    );
  }
  return context;
}
