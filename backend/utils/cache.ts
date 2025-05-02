import NodeCache from "node-cache";

// TTL = 60 seconds
export const cache = new NodeCache({ stdTTL: 60 });
