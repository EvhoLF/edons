import { ICodeData } from "../models/CodeData";

const API_BASE = "/api/map/codedata";

export const CodeDataAction = {
  // Получить карту по ID
  async getById(id: string): Promise<ICodeData | null> {
    const res = await fetch(`${API_BASE}/${id}`);
    return await res.json();
  },

  // Создать новую карту
  async create(mapData: Partial<ICodeData>): Promise<ICodeData> {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapData),
    });
    return await res.json();
  },

  // Обновить карту по ID
  async update(id: string, updates: ICodeData['nodes']): Promise<ICodeData | null> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  // Удалить карту по ID
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    return await res.json();
  },
};