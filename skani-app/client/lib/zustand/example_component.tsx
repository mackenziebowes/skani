import { useBearStore } from "./example_store";

export function BearCounter() {
  const bears = useBearStore((s) => s.bears);
  return <h1>{bears} bears around</h1>;
}
