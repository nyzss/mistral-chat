import { Message } from "@/app/api/chat/route";
import { atomWithStorage } from "jotai/utils";

export const messageAtom = atomWithStorage<Message[]>("messages", []);
