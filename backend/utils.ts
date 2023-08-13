import { ActiveEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (arg: unknown): string => {
  if (!arg || !isString(arg)) {
    throw new Error("expected a string");
  }

  return arg;
};

export const parseActiveEntry = (body: unknown): Omit<ActiveEntry, "_id"> => {
  if (!body || typeof body !== "object") {
    throw new Error("request body must be an object");
  }

  if ("requestorDisplayName" in body && "requestorId" in body) {
    return {
      requestorDisplayName: parseString(body.requestorDisplayName),
      requestorId: parseString(body.requestorId),
      requestTimestamp: new Date().toISOString(),
    };
  }

  throw new Error("missing request data");
};
