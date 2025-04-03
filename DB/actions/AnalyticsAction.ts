const STATS_API_BASE = '/api/analytics';

export const AnalyticsActions = {
  async getGeneralStats() {
    const res = await fetch(`${STATS_API_BASE}/general`);
    if (!res.ok) throw new Error('Failed to fetch general stats');
    return await res.json();
  },

  async getUserActivityStats() {
    const res = await fetch(`${STATS_API_BASE}/user-activity`);
    if (!res.ok) throw new Error('Failed to fetch user activity stats');
    return await res.json();
  },

  async getMapStats() {
    const res = await fetch(`${STATS_API_BASE}/map-stats`);
    if (!res.ok) throw new Error('Failed to fetch map stats');
    return await res.json();
  },

  async getUserGrowthStats() {
    const res = await fetch(`${STATS_API_BASE}/user-growth`);
    if (!res.ok) throw new Error('Failed to fetch user growth stats');
    return await res.json();
  },

  async getErrorLogs() {
    const res = await fetch(`${STATS_API_BASE}/error-logs`);
    if (!res.ok) throw new Error('Failed to fetch error logs');
    return await res.json();
  },

  async getAuthProviderStats() {
    const res = await fetch(`${STATS_API_BASE}/provider-stats`);
    if (!res.ok) throw new Error('Failed to fetch auth provider stats');
    return await res.json();
  },

  async getUserMapStats(userId: string) {
    const res = await fetch(`${STATS_API_BASE}/user-maps/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user map stats');
    return await res.json();
  },
};