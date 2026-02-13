import { create } from "zustand";
import z from "zod";

export const bearStateSchema = z.object({
  bears: z.number(),
  food: z.string(),
  feed: z.function({
    input: [z.string()],
    output: z.void(),
  }),
});

type BearState = z.infer<typeof bearStateSchema>;

export const useBearStore = create<BearState>()((set) => ({
  bears: 2,
  food: "honey",
  feed: (food) => set(() => ({ food })),
}));
