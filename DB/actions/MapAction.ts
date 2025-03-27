import { IMap } from "../models/Map";

const API_BASE = "/api/map";

export const MapAction = {
  // Получить все карты или карты по userId
  async getAll(userId?: string): Promise<IMap[]> {
    const url = userId ? `${API_BASE}?userId=${userId}` : `${API_BASE}`;
    const res = await fetch(url);
    return await res.json();
  },

  // Получить карту по ID
  async getById(id: string): Promise<IMap | null> {
    const res = await fetch(`${API_BASE}/${id}`);
    return await res.json();
  },

  // Создать новую карту
  async create(mapData: Partial<IMap>): Promise<IMap> {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapData),
    });
    return await res.json();
  },

  // Обновить карту по ID
  async update(id: string, updates: Partial<IMap>): Promise<IMap | null> {
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

  async updateImage(mapId: string, image: string): Promise<IMap | null> {
    const formData = new FormData();
    formData.append("mapId", mapId);
    formData.append("image", image);
    const res = await fetch(`${API_BASE}/image`, { method: "POST", body: formData, });
    return await res.json();
  },
};