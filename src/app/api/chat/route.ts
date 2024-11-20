import { Mistral } from "@mistralai/mistralai";
import {
    AssistantMessage,
    SystemMessage,
    ToolMessage,
    UserMessage,
} from "@mistralai/mistralai/models/components";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export type Message =
    | SystemMessage
    | UserMessage
    | AssistantMessage
    | ToolMessage;

export type ReceivedMessage = Message & { role: string };

export async function POST(request: Request) {
    try {
        const data: ReceivedMessage[] = await request.json();

        const completion = await mistral.chat.complete({
            model: "mistral-small-latest",
            messages: data,
        });

        const messages: AssistantMessage[] | undefined =
            completion.choices?.map((choice) => choice.message);

        return Response.json(messages);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Invalid Request" });
    }
}
