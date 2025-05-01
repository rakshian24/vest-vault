import { useEffect, useState } from "react";
import { createClient } from "@vercel/edge-config";

const edge = createClient(
  process.env.REACT_APP_EDGE_CONFIG_DEV!,
  { cache: "force-cache" }
);

export function useFlag<T = boolean>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let alive = true;
    edge.get<T>(key).then((v) => {
      if (alive && v !== undefined) setValue(v);
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return value;
}
