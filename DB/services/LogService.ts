import connectDB from "../connectDB";
import { Types } from "mongoose";
import { Log, LogActions, LogStatuses } from "../models/Log";
import toReadableText from "@/utils/toReadableText";

interface LogCreate {
  userId: string | null, action: LogActions, status: LogStatuses, description: any
}
export const LogCreate = async ({ userId, status, action, description }: LogCreate) => {
  await connectDB();
  const objectIdUserId = userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null;
  const logEntry = new Log({
    userId: objectIdUserId,
    action,
    description: toReadableText(description),
    status,
  });
  return await logEntry.save();
};

export const LogGetAll = async () => {
  await connectDB();
  return await Log.find();
};

export const LogGetByUser = async (userId: string) => {
  await connectDB();
  return await Log.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
};

export const LogDelete = async (id: string) => {
  await connectDB();
  return await Log.findByIdAndDelete(id);
};

export const LogClear = async (days: number = 0) => {
  await connectDB();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - days);
  return await Log.deleteMany({ createdAt: { $lt: oneWeekAgo } });
};
