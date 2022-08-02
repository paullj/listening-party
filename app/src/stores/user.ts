import create from "zustand";

interface UserState {
	userID: string;
	// join: (roomID: string) => void;
	// disconnect: () => void;
}

const useUserState = create<UserState>((set) => ({
	userID: crypto.randomUUID(),
}));

export { useUserState };
