import { ChatFormValues } from "@/app/page";
import { AssistantMessage } from "@mistralai/mistralai/models/components";

export const sendMessage = async (message: ChatFormValues) => {
    const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(message),
    });
    const resp: AssistantMessage[] = await res.json();
    return resp;
};
