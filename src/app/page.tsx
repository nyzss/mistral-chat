"use client";
import { useState } from "react";
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
import { MessageList } from "./api/chat/route";
import Markdown from "react-markdown";

const chatFormSchema = z.object({
    message: z.string().min(1).max(1000),
});

export type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function Home() {
    const [messages, setMessages] = useState<MessageList[]>([]);

    const form = useForm<ChatFormValues>({
        resolver: zodResolver(chatFormSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = async (values: ChatFormValues) => {
        sendMessage(values).then((res) => {
            setMessages(res);
        });
    };
    // <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    //     {messages.map((m) => (
    //         <div key={m.id} className="whitespace-pre-wrap">
    //             {m.role === "user" ? "User: " : "AI: "}
    //             {m.content}
    //         </div>
    //     ))}

    //     <form onSubmit={handleSubmit}>
    //         <input
    //             className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
    //             value={input}
    //             placeholder="Say something..."
    //             onChange={handleInputChange}
    //         />
    //     </form>
    // </div>;

    return (
        <div className="w-screen h-screen">
            <div>
                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col divide-y">
                        <h1>role: {message.role}</h1>
                        <Markdown>{message.content}</Markdown>
                    </div>
                ))}
            </div>
            <div className="flex flex-col w-full max-w-md py-24 mx-auto items-stretch">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        // className="space-y-8"
                        className="space-y-8 fixed bottom-0 mb-6 w-full flex space-x-3"
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
