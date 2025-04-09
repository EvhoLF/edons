import { Schema, Document, Types, model, models } from 'mongoose';

export enum AuthProviders {
  CREDENTIALS = 'credentials',
  GITHUB = 'github',
  GOOGLE = 'google',
}

export interface IAccount extends Document {
  provider: string;
  providerAccountId: string;
  access_token: string;
  type?: string;
  token_type?: string;
  scope?: string;
  expires_at?: number;
  id_token?: string;
  userId: Types.ObjectId;
}

const AccountSchema = new Schema<IAccount>(
  {
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: { type: String, required: true },
    type: { type: String },
    token_type: { type: String },
    scope: { type: String },
    expires_at: { type: Number },
    id_token: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  }
);

// Правильное использование существующей модели, если она уже создана
export const Account = models?.accounts || model<IAccount>('accounts', AccountSchema);
