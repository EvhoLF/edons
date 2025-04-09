import { Schema, Document, Types, model, models, Model } from 'mongoose';

export enum LogActions {
  USER_GET = 'user_get',
  USER_SIGNUP = 'user_signup',
  USER_SIGNIN = 'user_signin',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  USER_LINK = 'user_link',
  MAP_GET = 'map_get',
  MAP_CREATE = 'map_create',
  MAP_UPDATE = 'map_update',
  MAP_SAVE = 'map_save',
  MAP_DELETE = 'map_delete',
  MAP_GITHUB_IMPORT = 'map_github_import',
  OTHER = 'other',
}

export enum LogStatuses {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface ILog extends Document {
  userId: Types.ObjectId;
  action: LogActions;
  status: LogStatuses;
  createdAt: Date;
  description: string;
}

const LogSchema = new Schema<ILog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    action: { type: String, enum: Object.values(LogActions), required: true, default: LogActions.OTHER },
    status: { type: String, enum: Object.values(LogStatuses), required: true, default: LogStatuses.INFO },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
    description: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId ? ret.userId.toString() : null; // Преобразуем userId в строку для API
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const LogModel = (models?.Log as Model<ILog>) || model<ILog>('Log', LogSchema);
export { LogModel as Log };