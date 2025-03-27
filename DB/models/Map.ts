import { Schema, model, models, Document, Types } from 'mongoose';

export enum IMapTypes {
  ALL = 'all',
  CODE_RELATION = 'code_relation',
  DATABASE = 'database',
}

export interface IMap extends Document {
  id: string;
  label: string;
  type: IMapTypes;
  userId: Types.ObjectId;
  image?: string;
  isFavourite: boolean;
  isPublicAccess: boolean;
  dateCreate: Date;
  lastUpdate: Date;
  nodes: unknown[];
  edges: unknown[];
}

const MapSchema = new Schema<IMap>(
  {
    label: { type: String, required: true }, // Новое поле: название карты
    type: { type: String, enum: Object.values(IMapTypes), default: IMapTypes.ALL, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, default: null },
    isFavourite: { type: Boolean, default: false }, // Булевое значение
    isPublicAccess: { type: Boolean, default: false }, // Булевое значение
    dateCreate: { type: Date, default: Date.now },
    lastUpdate: { type: Date, default: Date.now },
    nodes: { type: Schema.Types.Mixed, default: [] }, // Поддержка произвольных структур
    edges: { type: Schema.Types.Mixed, default: [] },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString(); // Преобразуем userId в строку для API
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Map = models.Map || model<IMap>('Map', MapSchema);
