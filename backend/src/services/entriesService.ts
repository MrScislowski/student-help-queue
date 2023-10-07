import { Active } from "../models/active";
import Archived from "../models/archived";
import { ActiveEntry, ArchivedEntry, ResolutionStatus, User } from "../types";
import { hasAdminRights } from "../utils";

const getActiveEntries = async (
  user: User
): Promise<Omit<ActiveEntry, "_id">[]> => {
  const allResults: ActiveEntry[] = await Active.find({}).lean();
  const isAdmin = hasAdminRights(user);

  // leave out the id if the user doesn't have access
  const resultsToReturn = allResults.map((entry) => {
    return isAdmin || entry.request.user.email === user.email
      ? entry
      : { request: entry.request, queueName: entry.queueName };
  });

  return resultsToReturn;
};

const getArchivedEntries = async () => {
  const results = await Archived.find({});
  return results;
};

const addActiveEntry = async (
  user: User,
  queueName: string
): Promise<ActiveEntry> => {
  const hasDuplicate = await Active.findOne({
    "request.user.email": user.email,
    queueName: queueName,
  });
  if (hasDuplicate) {
    throw new Error(`User already has an entry in the ${queueName} queue. `);
  }

  const newEntry = new Active({
    request: {
      user,
      timestamp: new Date().toISOString(),
    },
    queueName: queueName,
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
