import { ReceivedMessage } from "@/app/types";
import { Mistral } from "@mistralai/mistralai";
import { AssistantMessage } from "@mistralai/mistralai/models/components";

export const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

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
