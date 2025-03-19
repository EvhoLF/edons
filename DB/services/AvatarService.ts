import connectDB from "../connectDB";
import { Avatar } from "../models/Avatar";

export const AvatarUpload = async (userId: string, file: { buffer: Buffer, mimetype: string }) => {
  await connectDB();
  const avatar = new Avatar({
    data: file.buffer,
    contentType: file.mimetype,
    userId,
  });
  return avatar.save();
};

export const AvatarGetByUserId = async (userId: string) => {
  await connectDB();
  return await Avatar.findOne({ userId });
};

export const AvatarDeleteByUserId = async (userId: string) => {
  await connectDB();
  return await Avatar.findOneAndDelete({ userId });
};