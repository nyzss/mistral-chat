// import { EventStream } from "@mistralai/mistralai/lib/event-streams";
import { mistral, ReceivedMessage } from "../chat/route";
// import { CompletionEvent } from "@mistralai/mistralai/models/components";

export const iteratorToStream = <T>(
    iterator: AsyncIterable<T>
): ReadableStream<string> => {
    return new ReadableStream<string>({
        async pull(controller) {
            for await (const chunk of iterator) {
                controller.enqueue(JSON.stringify([chunk]) + ",");
            }
            controller.close();
        },
    });
};

export async function POST(request: Request) {
    try {
        const data: ReceivedMessage[] = await request.json();

        const stream = await mistral.chat.stream({
            model: "mistral-small-latest",
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
