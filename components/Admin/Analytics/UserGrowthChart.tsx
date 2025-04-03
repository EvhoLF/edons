import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { palette } from '@/styles/variables';
import Frame from '@/components/UI/Frame/Frame';

export default function UserGrowthChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных о росте пользователей</Typography>
      </Box>
    );
  }

  const dates = data.map(item => format(new Date(item.date), 'dd MMM yyyy', { locale: ru }));
  const cumulative = data.map(item => item.cumulative);
  const daily = data.map(item => item.count);

  return (
    <Frame sx={{ height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Рост пользователей
      </Typography>
      <LineChart
        height={300}
        series={[
          { color: palette.сhart[0], data: cumulative, label: 'Всего пользователей', id: 'cumulative', showMark: true, },
          { color: palette.сhart[3], data: daily, label: 'Новые пользователи', id: 'daily', showMark: true, },
        ]}
        xAxis={[{ data: dates, scaleType: 'band', label: 'Дата', }]}
        yAxis={[{ label: 'Количество пользователей' }]}
        margin={{ top: 100, bottom: 50, left: 50, right: 10 }}
        slotProps={{ legend: { direction: 'row', position: { vertical: 'top', horizontal: 'left' }, labelStyle: { fontSize: 12 }, }, }}
      />
    </Frame>
  );
}