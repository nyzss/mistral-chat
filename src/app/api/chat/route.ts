import { ChatFormValues } from "@/app/page";

const API_KEY = process.env.LLM_API_KEY;
const URL: string =
    process.env.LLM_URL || "https://api.mistral.ai/v1/chat/completions";

export async function POST(request: Request) {
    try {
        const data: ChatFormValues = await request.json();

        const req = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "mistral-large-latest",
                messages: [
                    {
                        role: "user",
                        content: data.message,
                    },
                ],
            }),
        });

        const res: Response = await req.json();

        const messages: MessageList[] = res.choices.map((choice) => ({
            role: choice.message.role,
            content: choice.message.content,
        }));

        return Response.json(messages);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Invalid Request" });
    }
}

export interface Response {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
}

export interface Choice {
    index: number;
    message: Message;
    finish_reason: string;
}

export interface Message {
    role: string;
    content: string;
    tool_calls: unknown;
}

export interface Usage {
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens: number;
}

export interface MessageList {
    role: string;
    content: string;
}
