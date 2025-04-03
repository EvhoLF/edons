import connectDB from "../connectDB";
import { CodeData, ICodeData } from "../models/CodeData";
import { IMap, Map } from "../models/Map";

// Получить все карты или карты по userId
export const MapGetAll = async (userId?: string) => {
  await connectDB();
  if (userId) {
    return await Map.find({ userId }); // Фильтрация по userId
  }
  return await Map.find(); // Все карты, если userId не передан
};

// Получить карту по ID
export const MapGetById = async (id: string) => {
  try {
    await connectDB();
    return await Map.findById(id);
  }
  catch {
    return;
  }
};

// Создать новую карту
export const MapCreate = async (mapData: Partial<IMap>, codeData_nodes: ICodeData['nodes'] = []) => {
  await connectDB();
  const code_data: ICodeData = new CodeData({ nodes: codeData_nodes });
  code_data.save();
  const map = new Map({ ...mapData, codeDataId: code_data._id });
  return map.save();
};

// Обновить карту по ID
export const MapUpdate = async (id: string, updates: Partial<IMap>) => {
  await connectDB();
  return await Map.findByIdAndUpdate(id, updates, { new: true });
};

// Удалить карту по ID
export const MapDelete = async (id: string) => {
  await connectDB();
  return await Map.findByIdAndDelete(id);
};