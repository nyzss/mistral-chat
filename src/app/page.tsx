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

    return (
        <div className="w-screen h-screen">
            <div className="max-w-3xl">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
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
            <div>
                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col divide-y">
                        <h1>role: {message.role}</h1>
                        <p>content: </p>
                        <Markdown>{message.content}</Markdown>
                    </div>
                ))}
            </div>
        </div>
    );
}
