import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { palette } from '@/styles/variables';
import Frame from '@/components/UI/Frame/Frame';

export default function MapStatsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных о картах</Typography>
      </Box>
    );
  }

  const types = data.map(item => item.type);
  const counts = data.map(item => item.count);
  const publicCounts = data.map(item => item.publicCount);
  const privateCounts = data.map(item => item.privateCount);
  const favourites = data.map(item => item.favourites);

  return (
    <Frame sx={{ height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Статистика по картам
      </Typography>
      <BarChart
        height={300}
        series={[
          { color: palette.сhart[0], data: counts, label: 'Всего карт', id: 'total' },
          { color: palette.сhart[1], data: privateCounts, label: 'Приватные', id: 'private' },
          { color: palette.сhart[3], data: publicCounts, label: 'Публичные', id: 'public' },
          { color: palette.сhart[6], data: favourites, label: 'Избранные', id: 'favourites' },
        ]}
        xAxis={[{ data: types, scaleType: 'band' }]}
        margin={{ top: 100, bottom: 50, left: 50, right: 10 }}
        slotProps={{ legend: { direction: 'row', position: { vertical: 'top', horizontal: 'left' }, labelStyle: { fontSize: 12 }, }, }}
      />
    </Frame>
  );
}