import { nanoid } from "nanoid";

// Generate a random id
export function getUniqueId(): UniqueId {
  return nanoid();
}
