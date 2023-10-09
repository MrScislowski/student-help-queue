import { AccountModel } from "../models/account";
import { Account, User } from "../types";

const getAccountInfo = async (user: User): Promise<Account> => {
  const accountInfo = await AccountModel.findOne({
    "user.email": user.email,
  }).lean();

  if (!accountInfo) {
    throw new Error(`account for email ${user.email} not found`);
  }

  return accountInfo;
};

const addQueue = async (user: User, queueName: string): Promise<Account> => {
  const accountInfo = await AccountModel.findOne({
    "user.email": user.email,
  });

  if (!accountInfo) {
    throw new Error(`account for email ${user.email} not found`);
  }

  if (accountInfo.activeQueues.includes(queueName)) {
    throw new Error(`${queueName} is already an active queue`);
  }

  if (accountInfo.archivedQueues.includes(queueName)) {
    throw new Error(
      `${queueName} is an archived queue. Un-archive it instead of re-creating a queue with the same name`
    );
  }

  const updatedAccountInfo = await AccountModel.findOneAndUpdate(
    { _id: accountInfo._id },
    { $push: { activeQueues: queueName } }
  );

  if (!updatedAccountInfo) {
    throw new Error(`unable to update the queue`);
  }

  return updatedAccountInfo;
};

export default {
  getAccountInfo,
  addQueue,
};
