import connectDB from "../connectDB";
import { IUser, User, UserErrorMessages, UserSchemaZod } from "../models/User";

export const UserGetAll = async () => {
  await connectDB();
  return await User.find().select("-password");
};

export const UserGetById = async (id: string) => {
  await connectDB();
  return await User.findById(id).select("-password");
};

export const UserGetByLogin = async (login: string) => {
  await connectDB();
  return await User.findById(login).select("-password");
};

export const UserGetByEmail = async (email: string) => {
  await connectDB();
  return await User.findOne({ email }).select("-password");
};

export const UserCreate = async (userData: Partial<IUser>) => {
  await connectDB();
  const user = new User(userData);
  return user.save();
};

export const UserUpdate = async (id: string, updates: Partial<IUser>) => {
  await connectDB();
  return await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
};

export const UserDelete = async (id: string) => {
  await connectDB();
  return await User.findByIdAndDelete(id);
};

export const UserValidation = async (userData: Partial<IUser>, thisUserId?: string) => {
  await connectDB();

  let validationErrors: Record<string, string> = {};

  const result = UserSchemaZod.safeParse(userData);
  if (!result.success) {
    validationErrors = result.error.errors.reduce<Record<string, string>>((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
  }

  const { authLogin, email } = userData;

  if (authLogin || email) {
    const existingUsers = await User.find({
      $or: [{ authLogin }, { email }],
    });

    for (const user of existingUsers) {
      if (!thisUserId || user._id.toString() !== thisUserId) {
        if (user.authLogin === authLogin) {
          validationErrors.authLogin = UserErrorMessages.uniqueAuthLogin;
        }
        if (user.email === email) {
          validationErrors.email = UserErrorMessages.uniqueEmail;
        }
      }
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    throw { validationErrors };
  }
};
