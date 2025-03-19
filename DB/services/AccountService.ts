import connectDB from "../connectDB";
import { IAccount, Account } from "../models/Account";

export const AccountGetAll = async () => {
  await connectDB();
  return Account.find();
};

export const AccountGetById = async (id: string) => {
  await connectDB();
  return Account.findById(id);
};

export const AccountGetByPAId = async (providerAccountId: string) => {
  await connectDB();
  return Account.findOne({ providerAccountId });
};

export const AccountGetByProviderPAID = async (provider: string, providerAccountId: string) => {
  await connectDB();
  return Account.findOne({ provider, providerAccountId });
};

export const AccountGetByEmail = async (email: string) => {
  await connectDB();
  return Account.findOne({ email });
};

export const AccountCreate = async (AccountData: Partial<IAccount>) => {
  await connectDB();
  const account = new Account(AccountData);
  return account.save();
};

export const AccountUpdate = async (id: string, updates: Partial<IAccount>) => {
  await connectDB();
  return Account.findByIdAndUpdate(id, updates, { new: true });
};

export const AccountDelete = async (id: string) => {
  await connectDB();
  return Account.findByIdAndDelete(id);
};
