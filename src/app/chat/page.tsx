"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StreamSendMessage } from "@/lib/api";
import { CompletionEvent } from "@mistralai/mistralai/models/components";
import { useState } from "react";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        console.log("submitting", prompt);

        const stream = await StreamSendMessage([
            { content: prompt, role: "user" },
        ]);
        setPrompt("");

        if (!stream) return;

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let buffer = "";

        const flushBuffer = () => {
            if (buffer) {
                setContent((prev) => prev + buffer);
                buffer = "";
            }
        };

        const interval = setInterval(flushBuffer, 100);

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const decoded = decoder.decode(value).slice(0, -1);

                const result: CompletionEvent[] = JSON.parse(
                    "[" + decoded + "]"
                ).flat();

                console.log("RESULT: ", result);

                const s = result
                    .map((el) => el.data.choices[0].delta.content)
                    .join("");
                buffer += s;
            }
        } finally {
            clearInterval(interval);
            flushBuffer();
        }
    };
    return (
        <div>
            <h1>hello wolrd</h1>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button onClick={handleSubmit}>submit</Button>

            <p>{content}</p>
        </div>
    );
}
