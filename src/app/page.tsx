"use client";
import { Button } from "@/components/ui/button";
import { StreamSendMessage } from "@/lib/api";
import { useAtom } from "jotai/react";
import { messageAtom } from "@/lib/atoms";
import {
    AssistantMessage,
    CompletionEvent,
    UserMessage,
} from "@mistralai/mistralai/models/components";
import { useCallback, useEffect, useRef, useState } from "react";
import Message from "@/components/chat/message";
import PromptForm, { ChatFormValues } from "@/components/chat/prompt-form";

export default function Home() {
    const messagesBox = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useAtom(messageAtom);
    const [generating, setGenerating] = useState<boolean>(false);
    const [content, setContent] = useState<AssistantMessage>({
        role: "assistant",
        content: "Thinking...",
    });

    const submitCallback = useCallback(
        async (values: ChatFormValues) => {
            setGenerating(true);
            const user_message: UserMessage = {
                role: "user",
                content: values.message,
            };
            const updated_messages = [...messages, user_message];
            setMessages(updated_messages);
            const stream = await StreamSendMessage(updated_messages);

            if (!stream) return; // can print that an error has occured maybe
            const reader = stream.getReader();
            const decoder = new TextDecoder();

            let buffer = "";
            const flushBuffer = () => {
                if (buffer) {
                    setContent({
                        role: "assistant",
                        content: buffer,
                    });
                }
            };
            const interval = setInterval(flushBuffer, 50);
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const decoded = decoder.decode(value).slice(0, -1); // to remove the last comma in the json
                    const result: CompletionEvent[] = JSON.parse(
                        "[" + decoded + "]"
                    ).flat();
                    const s = result
                        .map((el) => el.data.choices[0].delta.content)
                        .join("");
                    buffer += s;
                }
            } finally {
                clearInterval(interval);
                flushBuffer();
                const assistant_message: AssistantMessage = {
                    content: buffer,
                    role: "assistant",
                };
                setMessages(() => {
                    setGenerating(false);
                    return [...updated_messages, assistant_message];
                });
                setContent({ role: "assistant", content: "Thinking..." });
            }
        },
        [messages, setMessages]
    );

    useEffect(() => {
        messagesBox.current?.scrollTo({
            top: messagesBox.current?.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, content]);

    return (
        <div className="w-screen h-screen">
            <Button
                onClick={() => setMessages([])}
                className="fixed m-4 font-medium text-xl border-yellow-500"
                variant={"outline"}
            >
                Clear Chat
            </Button>
            <div className="flex flex-col w-full max-w-xl py-20 mx-auto items-stretch">
                <div
                    className="p-4 flex-grow overflow-y-auto max-h-[calc(100vh-250px)] space-y-4"
                    ref={messagesBox}
                >
                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                    {generating && <Message message={content} />}
                </div>
                <PromptForm callback={submitCallback} />
            </div>
        </div>
    );
}

// Abstraction layer i didnt need, so its commented out
// const decoder = new TextDecoder();

// async function* read_buffer(
//     reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>
// ) {
//     while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         const decoded = decoder.decode(value).slice(0, -1); // to remove the last comma in the json
//         const result: CompletionEvent[] = JSON.parse(
//             "[" + decoded + "]"
//         ).flat();
//         const s = result.map((el) => el.data.choices[0].delta.content).join("");
//         yield s;
//     }
// }
