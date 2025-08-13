import { customAlphabet } from "nanoid";

export const getId = (): string => {
  const nanoid = customAlphabet("ABCEFGHIJKLMNOPQRTUVWXYZ0123456789");
  return nanoid(5);
};
