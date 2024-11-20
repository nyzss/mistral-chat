"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/api";
import { useAtom } from "jotai/react";
import { messageAtom } from "@/lib/atoms";
import { UserMessage } from "@mistralai/mistralai/models/components";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const chatFormSchema = z.object({
    message: z.string().min(1).max(1000),
});

export type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function Home() {
    const [messages, setMessages] = useAtom(messageAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesBox = useRef<HTMLDivElement>(null);

    const form = useForm<ChatFormValues>({
        resolver: zodResolver(chatFormSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = async (values: ChatFormValues) => {
        setLoading(true);
        const user_message: UserMessage = {
            role: "user",
            content: values.message,
        };
        const updated_messages = [...messages, user_message];
        setMessages(updated_messages);
        sendMessage(updated_messages).then((res) => {
            setMessages([...updated_messages, ...res]);
            setLoading(false);
        });

        form.reset();
    };

    useEffect(() => {
        messagesBox.current?.scrollTo({
            top: messagesBox.current?.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    interface Block {
        type: "markdown" | "text";
        content: string;
        language?: string;
    }

    const parseIntoBlocks = (message: string): Block[] => {
        const regex = /```([\w]*)\n([\s\S]*?)```/g;

        const result: Block[] = [];

        let lastIndex = 0;

        let match;
        while ((match = regex.exec(message)) !== null) {
            if (match.index > lastIndex) {
                result.push({
                    type: "text",
                    content: message.slice(lastIndex, match.index),
                });
            }

            result.push({
                type: "markdown",
                language: match[1],
                content: match[2],
            });

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < message.length) {
            result.push({
                type: "text",
                content: message.slice(lastIndex),
            });
        }

        return result;
    };

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
                        <div
                            key={index}
                            className="flex flex-col bg-neutral-900 rounded-sm p-3"
                        >
                            <h1
                                className={`font-bold text-lg ${
                                    message.role === "assistant"
                                        ? "text-yellow-500"
                                        : "text-neutral-200"
                                }`}
                            >
                                {message.role?.toUpperCase()}
                            </h1>
                            {parseIntoBlocks(
                                typeof message.content === "string"
                                    ? message.content
                                    : ""
                            ).map((block, index) => {
                                if (block.type === "text") {
                                    return (
                                        <Markdown
                                            key={index}
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeKatex]}
                                            className="dark:prose-invert prose"
                                        >
                                            {block.content}
                                        </Markdown>
                                    );
                                }

                                return (
                                    <Markdown
                                        key={index}
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeKatex]}
                                        className="dark:prose-invert prose"
                                    >
                                        {block.content}
                                    </Markdown>
                                );
                            })}
                        </div>
                    ))}
                    {loading && (
                        <div className="animate-pulse flex p-4 space-x-3 bg-neutral-900 rounded-sm">
                            <h1>
                                <span className="text-yellow-500">
                                    ASSISTANT
                                </span>{" "}
                                is typing..
                            </h1>
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        // className="space-y-8"
                        className="p-4 space-y-8 fixed bottom-0 mb-6 w-full flex space-x-3"
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="max-w-md w-full">
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tell me about the socioeconomic state of the world.."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is the prompt you will send to the
                                        chat.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Send</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
