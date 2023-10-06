import { ResolutionStatus, User } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const parseString = (arg: unknown): string => {
  if (!arg || !isString(arg)) {
    throw new Error("expected a string");
  }

  return arg;
};

export const parseLoginPayload = (data: unknown): User => {
  if (!data || typeof data !== "object") {
    throw new Error("login payload needs to be an object");
  }

  if ("email" in data && "given_name" in data && "family_name" in data) {
    return {
      email: parseString(data.email),
      givenName: parseString(data.given_name),
      familyName: parseString(data.family_name),
    };
  } else {
    throw new Error("missing one or more required properties");
  }
};

export const parseUser = (data: unknown): User => {
  if (!data || typeof data !== "object") {
    throw new Error("login payload needs to be an object");
  }

  if ("email" in data && "givenName" in data && "familyName" in data) {
    return {
      email: parseString(data.email),
      givenName: parseString(data.givenName),
      familyName: parseString(data.familyName),
    };
  } else {
    throw new Error("missing one or more required properties");
  }
};

export const parseResolutionStatus = (arg: unknown): ResolutionStatus => {
  if (!arg || !isString(arg)) {
    throw new Error("expected a string");
  }

  if (arg !== "cancel" && arg !== "resolve") {
    throw new Error("available resolution statuses are 'cancel' and 'resolve'");
  }

  return arg;
};

// TODO: have to make sure there's a queuetype also
export const parseArchivedEntry = (body: unknown): ResolutionStatus => {
  if (!body || typeof body !== "object") {
    throw new Error("request body must be an object to add to queue");
  }

  if (!("resolutionStatus" in body)) {
    throw new Error("Must specify resolutionStatus to mark entry resolved. ");
  }

  return parseResolutionStatus(body.resolutionStatus);
};

const administratorsList = [
  "dscislowski@usd266.com",
  "mr.scislowski@gmail.com",
];

export const hasAdminRights = (user: User): boolean => {
  return administratorsList.includes(user.email);
};
