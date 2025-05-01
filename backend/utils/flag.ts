import { createClient } from "@vercel/edge-config";

export const edge = createClient(process.env.EDGE_CONFIG_DEV!);

export async function isEnabled(
  key: string,
  fallback = false
): Promise<boolean> {
  const flag = await edge.get<boolean>(key);
  return flag ?? fallback;
}
