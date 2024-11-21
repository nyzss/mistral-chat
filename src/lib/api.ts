import { Message } from "@/app/types";

export const StreamSendMessage = async (message: Message[]) => {
    const res = await fetch("/api/stream", {
        method: "POST",
        body: JSON.stringify(message),
    });
    const resp = res.body;

    return resp;
};
