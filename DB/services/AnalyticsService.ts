import { Types } from "mongoose";
import { Map } from "../models/Map";
import { Account } from "../models/Account";
import { User } from "../models/User";
import { Log } from "../models/Log";
import connectDB from "../connectDB";

export async function getGeneralStats() {
  await connectDB();
  const [userCount, mapCount, successLogs, errorLogs] = await Promise.all([
    User.countDocuments(),
    Map.countDocuments(),
    Log.countDocuments({ status: 'success' }),
    Log.countDocuments({ status: 'error' }),
  ]);
  return { userCount, mapCount, successLogs, errorLogs, };
}
// 2. Статистика активности пользователей
export async function getUserActivityStats() {
  await connectDB();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return await Log.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, action: { $in: ['user_signin', 'user_signup', 'map_create', 'map_update'] }, }, },
    { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, action: '$action', }, count: { $sum: 1 }, }, },
    { $group: { _id: '$_id.date', actions: { $push: { action: '$_id.action', count: '$count', }, }, total: { $sum: '$count' }, }, },
    { $sort: { _id: 1 } },
  ]);
}
// 3. Статистика по картам
export async function getMapStats() {
  await connectDB();
  return await Map.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, avgNodes: { $avg: { $size: '$nodes' } }, avgEdges: { $avg: { $size: '$edges' } }, publicCount: { $sum: { $cond: [{ $eq: ['$isPublicAccess', true] }, 1, 0] }, }, privateCount: { $sum: { $cond: [{ $eq: ['$isPublicAccess', false] }, 1, 0] }, }, favourites: { $sum: { $cond: [{ $eq: ['$isFavourite', true] }, 1, 0] }, }, }, },
    { $project: { type: '$_id', count: 1, avgNodes: { $round: ['$avgNodes', 2] }, avgEdges: { $round: ['$avgEdges', 2] }, publicCount: 1, privateCount: 1, favourites: 1, _id: 0, }, },
  ]);
}
// 4. Статистика роста пользователей
export async function getUserGrowthStats() {
  await connectDB();
  const userGrowth = await User.aggregate([
    { $group: { _id: { year: { $year: '$dateCreate' }, month: { $month: '$dateCreate' }, day: { $dayOfMonth: '$dateCreate' }, }, count: { $sum: 1 }, }, },
    { $project: { date: { $dateFromParts: { year: '$_id.year', month: '$_id.month', day: '$_id.day', }, }, count: 1, _id: 0, }, },
    { $sort: { date: 1 } },
  ]);
  let cumulative = 0; // Вычисляем кумулятивную сумму
  return userGrowth.map((item) => { cumulative += item.count; return { ...item, cumulative, }; });
}
// 5. Ошибки и предупреждения из логов
export async function getErrorLogs() {
  await connectDB();
  return await Log.aggregate([
    { $match: { status: { $in: ['error', 'warning'] }, }, },
    { $group: { _id: { action: '$action', status: '$status', description: '$description', }, count: { $sum: 1 }, lastOccurred: { $max: '$createdAt' }, }, },
    { $project: { action: '$_id.action', status: '$_id.status', description: '$_id.description', count: 1, lastOccurred: 1, _id: 0, }, },
    { $sort: { count: -1 } },
    { $limit: 50 },
  ]);
}
// 6. Статистика по провайдерам аутентификации
export async function getAuthProviderStats() {
  await connectDB();
  const providersStats = await Account.aggregate([
    { $group: { _id: '$provider', count: { $sum: 1 }, uniqueUsers: { $addToSet: '$userId' } } },
    { $project: { provider: '$_id', count: 1, uniqueUsersCount: { $size: '$uniqueUsers' }, _id: 0 } }
  ]);
  const usersWithProviders = await Account.distinct('userId');
  const totalUsers = await User.countDocuments();
  const usersWithoutProvider = totalUsers - usersWithProviders.length;
  const result = {
    github: {
      accounts: providersStats.find(p => p.provider === 'github')?.count || 0,
      users: providersStats.find(p => p.provider === 'github')?.uniqueUsersCount || 0
    },
    google: {
      accounts: providersStats.find(p => p.provider === 'google')?.count || 0,
      users: providersStats.find(p => p.provider === 'google')?.uniqueUsersCount || 0
    },
    email: {
      users: usersWithoutProvider
    },
    totalUsers
  };
  return result;
}
// 7. Статистика по картам конкретного пользователя
export async function getUserMapStats(userId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(userId)) return null;
  const userMaps = await Map.aggregate([
    { $match: { userId: new Types.ObjectId(userId), }, },
    { $group: { _id: '$type', count: { $sum: 1 }, totalNodes: { $sum: { $size: '$nodes' } }, totalEdges: { $sum: { $size: '$edges' } }, publicCount: { $sum: { $cond: [{ $eq: ['$isPublicAccess', true] }, 1, 0] }, }, favourites: { $sum: { $cond: [{ $eq: ['$isFavourite', true] }, 1, 0] }, }, }, },
    { $project: { type: '$_id', count: 1, avgNodes: { $round: [{ $divide: ['$totalNodes', '$count'] }, 2] }, avgEdges: { $round: [{ $divide: ['$totalEdges', '$count'] }, 2] }, publicCount: 1, privateCount: { $subtract: ['$count', '$publicCount'] }, favourites: 1, _id: 0, }, },
  ]);
  const totalStats = {
    totalMaps: userMaps.reduce((acc, curr) => acc + curr.count, 0),
    totalPublic: userMaps.reduce((acc, curr) => acc + curr.publicCount, 0),
    totalFavourites: userMaps.reduce((acc, curr) => acc + curr.favourites, 0),
  };
  return { byType: userMaps, total: totalStats, }
}