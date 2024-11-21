import {
    AssistantMessage,
    SystemMessage,
    ToolMessage,
    UserMessage,
} from "@mistralai/mistralai/models/components";

export interface Block {
    type: "markdown" | "text";
    content: string;
    language?: string;
}

export type Message =
    | SystemMessage
    | UserMessage
    | AssistantMessage
    | ToolMessage;

export type ReceivedMessage = Message & { role: string };
