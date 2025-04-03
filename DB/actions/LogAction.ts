import { ILog } from "../models/Log";

const API_BASE = "/api/log";

export const LogAction = {
  // Получить все логи
  async getAll(): Promise<ILog[]> {
    const res = await fetch(`${API_BASE}`);
    return await res.json();
  },

  // Создать новый лог
  async create(logData: Partial<ILog>): Promise<ILog> {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    return await res.json();
  },

  // Очистить старые логи
  async clear(days: number = 0): Promise<boolean> {
    const res = await fetch(`${API_BASE}`, { method: "DELETE", body: JSON.stringify({ days }) });
    return await res.json();
  },

  // Получить лог по ID
  async getByUserId(id: string): Promise<ILog | null> {
    const res = await fetch(`${API_BASE}/${id}`);
    return await res.json();
  },

  // Удалить лог по ID
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    return await res.json();
  },
};
