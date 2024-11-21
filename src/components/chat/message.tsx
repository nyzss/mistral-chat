import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { Block, Message as IMessage } from "@/app/types";
import Loading from "./loading";

export default function Message({
    message,
    showLoad,
}: {
    message: IMessage;
    showLoad?: boolean;
}) {
    const parseIntoBlocks = (message: string): Block[] => {
        const regex = /```([\w]*)\n([\s\S]*?)```/g;

        const result: Block[] = [];

        let lastIndex = 0;
        let match;
        while ((match = regex.exec(message)) !== null) {
            if (match.index > lastIndex) {
                result.push({
                    type: "text",
                    content: message.slice(lastIndex, match.index),
                });
            }
            result.push({
                type: "markdown",
                language: match[1],
                content: match[2],
            });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < message.length) {
            result.push({
                type: "text",
                content: message.slice(lastIndex),
            });
        }

        return result;
    };

    if (showLoad && message.content?.length === 0) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col bg-neutral-900 rounded-sm p-3">
            <h1
                className={`font-bold text-lg ${
                    message.role === "assistant"
                        ? "text-yellow-500"
                        : "text-neutral-200"
                }`}
            >
                {message.role?.toUpperCase()}
            </h1>
            {parseIntoBlocks(
                typeof message.content === "string" ? message.content : ""
            ).map((block, index) => {
                if (block.type === "text") {
                    return (
                        <Markdown
                            key={index}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            className="dark:prose-invert prose"
                        >
                            {block.content}
                        </Markdown>
                    );
                }

                return (
                    <Markdown
                        key={index}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        className="dark:prose-invert prose"
                    >
                        {block.content}
                    </Markdown>
                );
            })}
        </div>
    );
}
