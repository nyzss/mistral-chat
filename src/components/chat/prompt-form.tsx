import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const chatFormSchema = z.object({
    message: z.string().min(1).max(1000),
});

export type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function PromptForm({
    callback,
}: {
    callback: (values: ChatFormValues) => void;
}) {
    const form = useForm<ChatFormValues>({
        resolver: zodResolver(chatFormSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = async (values: ChatFormValues) => {
        callback(values);
        form.reset();
    };

    return (
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
                                This is the prompt you will send to the chat.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Send</Button>
            </form>
        </Form>
    );
}
