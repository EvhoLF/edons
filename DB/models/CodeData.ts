import { Schema, model, models, Document, Types } from 'mongoose';

export interface INode {
  id: string;
  data: string;
}

export interface ICodeData extends Document {
  id: string;
  nodes: Array<INode> | [];
}

const CodeDataSchema = new Schema<ICodeData>(
  {
    nodes: [
      {
        id: { type: String, required: true },
        data: { type: String, required: true },
      },
    ],
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        // delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const CodeData = models?.CodeData || model<ICodeData>('CodeData', CodeDataSchema);


