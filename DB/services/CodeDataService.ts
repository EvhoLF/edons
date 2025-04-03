import connectDB from "../connectDB";
import { CodeData, ICodeData } from "../models/CodeData";

export const CodeDataGetById = async (id: string) => {
  await connectDB();
  return await CodeData.findById(id);
};

export const CodeDataCreate = async (data: Partial<ICodeData>) => {
  await connectDB();
  const codeData = new CodeData(data);
  return codeData.save();
};

export const CodeDataUpdate = async (id: string, updates: ICodeData[]) => {
  await connectDB();
  return await CodeData.findByIdAndUpdate(id, updates, { new: true });
};

export const CodeDataDelete = async (id: string) => {
  await connectDB();
  return await CodeData.findByIdAndDelete(id);
};

export const CodeDataUpsert = async (id: string, nodes: ICodeData["nodes"]) => {
  await connectDB();

  let existingCodeData = await CodeData.findById(id);

  if (!existingCodeData) {
    // Если CodeData не существует, создаём его
    const newCodeData = new CodeData({ nodes });
    await newCodeData.save();
    return newCodeData;
  }

  // Обновляем существующее CodeData
  existingCodeData.nodes = nodes;
  await existingCodeData.save();
  return existingCodeData;
};