import { MessageList } from "@/app/api/chat/route";
import { ChatFormValues } from "@/app/page";

export const sendMessage = async (message: ChatFormValues) => {
    const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(message),
    });
    const resp: MessageList[] = await res.json();
    return resp;
};
