import create from "zustand";
import { useUserState } from "./user";

type MessageType = "text" | "track";

interface Message {
	from: string;
	type: MessageType;
	content: string;
}

interface MessagesState {
	messages: Message[];
	receiveMessage: (newMessage: Message) => void;
	createMessage: (content: string) => Message;
}

const useMessagesStore = create<MessagesState>((set, get) => ({
	messages: [],
	receiveMessage: (newMessage: Message) =>
		set(({ messages }) => ({
			messages: [...messages, newMessage],
		})),
	createMessage: (content: string) => {
		const newMessage: Message = {
			from: useUserState.getState().userID,
			type: "text",
			content,
		};
		get().receiveMessage(newMessage);
		return newMessage;
	},
}));

export { useMessagesStore };
