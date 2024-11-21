import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="animate-pulse flex p-4 space-x-3 bg-neutral-900 rounded-sm">
            <h1>
                <span className="text-yellow-500">ASSISTANT</span> is typing..
            </h1>
            <Loader2 className="animate-spin" />
        </div>
    );
}
