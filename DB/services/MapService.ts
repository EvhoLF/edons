import connectDB from "../connectDB";
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
  await connectDB();
  return await Map.findById(id);
};

// Создать новую карту
export const MapCreate = async (mapData: Partial<IMap>) => {
  await connectDB();
  const map = new Map(mapData);
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