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

export default {
  getAccountInfo,
};
