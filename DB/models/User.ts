import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';

export const UserErrorMessages = {
  uncorrectName: 'Некоректное имя',

  uncorrectAuthLogin: 'Некоректный логин',
  uniqueAuthLogin: 'Этот логин уже занят',

  uncorrectEmail: 'Некоректный email',
  uniqueEmail: 'Этот email уже используется',
}


export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const UserSchemaZod = z.object({
  authLogin: z.string().trim().min(1, UserErrorMessages.uncorrectAuthLogin).optional().nullable(),
  email: z.string().trim().email(UserErrorMessages.uncorrectEmail),
  name: z.string().trim().min(1, UserErrorMessages.uncorrectName),
  password: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.enum([UserRole.USER, UserRole.ADMIN]).optional().nullable(),
  dateCreate: z.date().default(() => new Date()),
  lastLogin: z.date().default(() => new Date()),
  github: z.string().optional().nullable(),
  google: z.string().optional().nullable(),
});

export type IUserZod = z.infer<typeof UserSchemaZod>;

export interface IUser extends Document, IUserZod {
  id: string;
}

export interface IErrorResponse {
  error: Partial<Record<keyof IUser, string>>; // Ошибки по полям IUser
}

const UserSchema = new Schema<IUser>(
  {
    authLogin: { type: String, trim: true, unique: true, sparse: true },
    email: { type: String, trim: true, unique: true, required: true, },
    name: { type: String, trim: true, required: true },
    password: { type: String, select: false, default: null },
    image: { type: String, default: null },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    dateCreate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    github: { type: String, default: null },
    google: { type: String, default: null },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export const User = models?.User || model<IUser>("User", UserSchema);