import { Active } from "../models/active";
import Archived from "../models/archived";
import {
  ActiveEntry,
  ArchivedEntry,
  ResolutionStatus,
  Session,
} from "../types";
import { hasAdminRights } from "../utils";

const getActiveEntries = async (
  session: Session
): Promise<Omit<ActiveEntry, "_id">[]> => {
  const allResults: ActiveEntry[] = await Active.find({}).lean();
  const isAdmin = hasAdminRights(session.user);

  // leave out the id if the user doesn't have access
  const resultsToReturn = allResults.map((entry) => {
    const { _id, ...entrySansId } = entry;
    return isAdmin || entry.user.email === session.user.email
      ? entry
      : entrySansId;
  });

  return resultsToReturn;
};

const getArchivedEntries = async () => {
  const results = await Archived.find({});
  return results;
};

const addActiveEntry = async (
  session: Session,
  queueName: string
): Promise<ActiveEntry> => {
  const hasDuplicate = await Active.findOne({
    "request.user.email": session.user.email,
    queueName: queueName,
  });
  if (hasDuplicate) {
    throw new Error(`User already has an entry in the ${queueName} queue. `);
  }

  const newEntry = new Active({
    user: session.user,
    timestamp: new Date().toISOString(),
    queueName: queueName,
  });

  await newEntry.save();

  return newEntry;
};

const resolveActiveEntry = async (
  id: string,
  session: Session,
  status: ResolutionStatus
): Promise<ArchivedEntry> => {
  const activeEntry = await Active.findById(id).select("-__v");
  if (!activeEntry) {
    throw new Error(`Active entry with id ${id} not found. `);
  }

  if (
    session.user.email !== activeEntry.user.email &&
    !hasAdminRights(session.user)
  ) {
    throw new Error(
      `Cannot resolve entry belonging to someone else, unless you have admin rights`
    );
  }

  const { _id, ...activeEntrySansId } = activeEntry;

  const archivedVersion = new Archived({
    _id: activeEntry._id,
    request: activeEntrySansId,
    resolution: {
      user: session.user,
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
