import { Mistral } from "@mistralai/mistralai";

export const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

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
