import { IUser } from "../models/User";

const API_BASE = "/api/user";

export const UserAction = {
  // Получить пользователя по ID
  async getAll(): Promise<IUser[] | null> {
    const res = await fetch(`${API_BASE}`);
    return await res.json();
  },

  async getById(id: string): Promise<IUser | null> {
    const res = await fetch(`${API_BASE}/${id}`);
    return await res.json();
  },

  // Получить пользователя по email
  async getByEmail(email: string): Promise<IUser | null> {
    const res = await fetch(`${API_BASE}/email/${email}`);
    return await res.json();
  },

  // Получить пользователя по login
  async getByLogin(login: string): Promise<IUser | null> {
    const res = await fetch(`${API_BASE}/login/${login}`);
    return await res.json();
  },

  // Обновить пользователя по ID
  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  // Удалить пользователя по ID
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    return await res.json();
  },

  async uploadAvatar(userId: string, avatarFile: File): Promise<IUser | null> {
    const formData = new FormData();
    formData.append("avatarFile", avatarFile);
    formData.append("userId", userId);

    const res = await fetch(`${API_BASE}/avatar`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  },
};
