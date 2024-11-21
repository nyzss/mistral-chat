import { ReceivedMessage } from "@/app/types";
import { iteratorToStream, mistral, MODEL } from "../common";

export async function POST(request: Request) {
    try {
        const data: ReceivedMessage[] = await request.json();

        const stream = await mistral.chat.stream({
            model: MODEL,
            messages: data,
        });

        const readable_stream: ReadableStream<string> =
            iteratorToStream(stream);

        return new Response(readable_stream);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Invalid Request" });
    }
}
