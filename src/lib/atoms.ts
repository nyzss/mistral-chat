import { Message } from "@/app/types";
import { atomWithStorage } from "jotai/utils";

export const messageAtom = atomWithStorage<Message[]>("messages", []);
