import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { palette } from '@/styles/variables';
import Frame from '@/components/UI/Frame/Frame';

export default function ActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных об активности пользователей</Typography>
      </Box>
    );
  }

  // Преобразуем данные для графика
  const dates = data.map(item => format(new Date(item._id), 'dd MMM', { locale: ru }));
  const seriesData = {
    signup: Array(data.length).fill(0),
    signin: Array(data.length).fill(0),
    mapCreate: Array(data.length).fill(0),
    mapUpdate: Array(data.length).fill(0),
  };

  data.forEach((day, dayIndex) => {
    day.actions.forEach(action => {
      switch (action.action) {
        case 'user_signup':
          seriesData.signup[dayIndex] = action.count;
          break;
        case 'user_signin':
          seriesData.signin[dayIndex] = action.count;
          break;
        case 'map_create':
          seriesData.mapCreate[dayIndex] = action.count;
          break;
        case 'map_update':
          seriesData.mapUpdate[dayIndex] = action.count;
          break;
      }
    });
  });

  return (
    <Frame sx={{ height: '100%', p: 2, }}>
      <Typography variant="h6" gutterBottom>
        Активность пользователей за последние 7 дней
      </Typography>
      <BarChart
        height={300}
        series={[
          { color: palette.сhart[3], data: seriesData.signup, label: 'Регистрации', id: 'signup' },
          // { color: palette.сhart[2], data: seriesData.signin, label: 'Входы', id: 'signin' },
          { color: palette.сhart[5], data: seriesData.mapCreate, label: 'Создание карт', id: 'mapCreate' },
          { color: palette.сhart[0], data: seriesData.mapUpdate, label: 'Обновление карт', id: 'mapUpdate' },
        ]}
        xAxis={[{ data: dates, scaleType: 'band' }]}
        margin={{ top: 100, bottom: 50, left: 50, right: 10 }}
        slotProps={{ legend: { direction: 'row', position: { vertical: 'top', horizontal: 'left' }, labelStyle: { fontSize: 12 }, } }}
      />
    </Frame>
  );
}