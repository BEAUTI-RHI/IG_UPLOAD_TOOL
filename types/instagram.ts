// types/instagram.ts
export interface InstagramAccount {
  id: string;
  username: string; // @anegus96
  pageId: string;
  pageAccessToken: string;
  profilePicture?: string;
  name?: string; // "Negus Niggas"
}

export interface InstagramAccountsContextType {
  accounts: InstagramAccount[];
  selectedAccounts: string[];
  addAccount: (account: InstagramAccount) => void;
  removeAccount: (id: string) => void;
  setSelectedAccounts: (ids: string[]) => void;
  isLoading: boolean;
}
