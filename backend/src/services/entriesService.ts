import Active from "../models/active";
import Archived from "../models/archived";
import { ActiveEntry, ArchivedEntry, ResolutionStatus, User } from "../types";

const hasAdminRights = (user: User) => {
  const adminList = ["dscislowski@usd266.com", "mr.scislowski@gmail.com"];
  return adminList.includes(user.email);
};

const getActiveEntries = async (
  user: User
): Promise<Omit<ActiveEntry, "_id">[]> => {
  const allResults: ActiveEntry[] = await Active.find({}).lean();
  const isAdmin = hasAdminRights(user);

  // leave out the id if the user doesn't have access
  const resultsToReturn = allResults.map((entry) => {
    return isAdmin || entry.request.user.email === user.email
      ? entry
      : { request: entry.request };
  });

  return resultsToReturn;
};

const getArchivedEntries = async () => {
  const results = await Archived.find({});
  return results;
};

const addActiveEntry = async (user: User): Promise<ActiveEntry> => {
  const hasDuplicate = await Active.findOne({
    "request.user.email": user.email,
  });
  if (hasDuplicate) {
    throw new Error("User already has an entry in the active queue. ");
  }

  const newEntry = new Active({
    request: {
      user,
      timestamp: new Date().toISOString(),
    },
  });

  await newEntry.save();

  return newEntry;
};

const resolveActiveEntry = async (
  id: string,
  user: User,
  status: ResolutionStatus
): Promise<ArchivedEntry> => {
  const activeEntry = await Active.findById(id);
  if (!activeEntry) {
    throw new Error(`Active entry with id ${id} not found. `);
  }

  if (user.email !== activeEntry.request.user.email && !hasAdminRights(user)) {
    throw new Error(
      `Cannot resolve entry belonging to someone else, unless you have admin rights`
    );
  }

  const archivedVersion = new Archived({
    ...(activeEntry.toObject() as object),
    resolution: {
      user,
      status,
      timestamp: new Date().toISOString(),
    },
  });

  await archivedVersion.save();
  await activeEntry.deleteOne();
  return archivedVersion;
};

export default {
  getActiveEntries,
  getArchivedEntries,
  addActiveEntry,
  resolveActiveEntry,
};
