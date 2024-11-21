import { Message } from "@/app/types";
import { AssistantMessage } from "@mistralai/mistralai/models/components";

export const sendMessage = async (message: Message[]) => {
    const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(message),
    });
    const resp: AssistantMessage[] = await res.json();
    return resp;
};

export const StreamSendMessage = async (message: Message[]) => {
    const res = await fetch("/api/stream", {
        method: "POST",
        body: JSON.stringify(message),
    });
    const resp = res.body;

    return resp;
};
