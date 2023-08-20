import {
  ActiveEntryStub,
  ArchivedEntryStub,
  ResolutionStatus,
  User,
  LoginPayload,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (arg: unknown): string => {
  if (!arg || !isString(arg)) {
    throw new Error("expected a string");
  }

  return arg;
};

export const parseLoginPayload = (data: unknown): LoginPayload => {
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

export const parseResolutionStatus = (arg: unknown): ResolutionStatus => {
  if (!arg || !isString(arg)) {
    throw new Error("expected a string");
  }

  if (arg !== "cancel" && arg !== "resolve") {
    throw new Error("available resolution statuses are 'cancel' and 'resolve'");
  }

  return arg;
};

export const parseUser = (user: unknown): User => {
  if (!user || typeof user !== "object") {
    throw new Error("request user must be an object");
  }

  if ("displayName" in user && "id" in user) {
    return {
      displayName: parseString(user.displayName),
      id: parseString(user.id),
    };
  }

  throw new Error("missing request data");
};

export const parseActiveEntry = (body: unknown): ActiveEntryStub => {
  if (!body || typeof body !== "object") {
    throw new Error("request body must be an object to add to queue");
  }

  if (!("user" in body)) {
    throw new Error("Must specify user to add to queue. ");
  }

  return {
    requestor: parseUser(body.user),
  };
};

export const parseArchivedEntry = (body: unknown): ArchivedEntryStub => {
  if (!body || typeof body !== "object") {
    throw new Error("request body must be an object to add to queue");
  }

  if (!("user" in body && "resolutionStatus" in body)) {
    throw new Error(
      "Must specify user and resolutionStatus to mark entry resolved. "
    );
  }

  return {
    resolver: parseUser(body.user),
    resolutionStatus: parseResolutionStatus(body.resolutionStatus),
  };
};
