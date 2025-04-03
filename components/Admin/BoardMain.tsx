"use client";

import { Box, CircularProgress, Container, Grid2, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AnalyticsActions } from "@/DB/actions/AnalyticsAction";
import StatsCards from "./Analytics/StatsCards";
import ActivityChart from "./Analytics/ActivityChart";
import UserGrowthChart from "./Analytics/UserGrowthChart";
import MapStatsChart from "./Analytics/MapStatsChart";
import AuthProviderPieChart from "./Analytics/AuthProviderPieChart";
import UserMapStats from "./Analytics/UserMapStats";
import ErrorLogsTable from "./Analytics/ErrorLogsTable";


const BoardMain = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    generalStats: null,
    userActivityStats: null,
    userGrowthStats: null,
    mapStats: null,
    authProviderStats: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [generalStats, authProviderStats, errorLogs, mapStats, userActivityStats, userGrowthStats] =
          await Promise.all([
            AnalyticsActions.getGeneralStats(),
            AnalyticsActions.getAuthProviderStats(),
            AnalyticsActions.getErrorLogs(),
            AnalyticsActions.getMapStats(),
            AnalyticsActions.getUserActivityStats(),
            AnalyticsActions.getUserGrowthStats(),
            // AnalyticsActions.getUserMapStats('67c9caae1a01dc6b451a2984') // Пример ID пользователя
          ]);
        console.log({ generalStats, userActivityStats, userGrowthStats, mapStats, authProviderStats, });

        setStats({ generalStats, userActivityStats, userGrowthStats, mapStats, authProviderStats, });
      }
      catch (error) { console.error('Error fetching admin stats:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Container maxWidth="xl">
      <Stack spacing={2} py={2}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
          Административная панель
        </Typography>
        {/* Основные статистические карточки */}
        <StatsCards stats={stats.generalStats} />
        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          {/* График активности пользователей */}
          <Grid2 size={{ xs: 12, md: 6 }}><ActivityChart data={stats.userActivityStats} /></Grid2>
          {/* График роста пользователей */}
          <Grid2 size={{ xs: 12, md: 6 }}><UserGrowthChart data={stats.userGrowthStats} /></Grid2>
          {/* Статистика по картам */}
          <Grid2 size={{ xs: 12, md: 6 }}><MapStatsChart data={stats.mapStats} /></Grid2>
          {/* Распределение провайдеров аутентификации */}
          <Grid2 size={{ xs: 12, md: 6 }}><AuthProviderPieChart data={stats.authProviderStats} /></Grid2>
          {/* Статистика по картам пользователя */}
          {/* <Grid2 size={{ xs: 12, md: 6 }}><UserMapStats data={stats.userMapStats} /></Grid2> */}
          {/* Таблица ошибок */}
          {/* <Grid2 size={{ xs: 12, md: 6 }}><ErrorLogsTable data={stats.errorLogs} /></Grid2> */}
        </Grid2>
      </Stack>
    </Container >
  );
}

export default BoardMain