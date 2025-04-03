import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { palette } from '@/styles/variables';
import Frame from '@/components/UI/Frame/Frame';

export default function AuthProviderPieChart({ data }) {
  if (!data) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных о провайдерах аутентификации</Typography>
      </Box>
    );
  }

  const seriesData = [
    {
      color: palette.сhart[5], id: 'github', value: data.github.users, label: `GitHub (${data.github.users})`
    },
    {
      color: palette.сhart[0], id: 'google', value: data.google.users, label: `Google (${data.google.users})`
    },
    {
      color: palette.сhart[3], id: 'email', value: data.email.users, label: `Без пров. (${data.email.users})`
    }
  ];

  return (
    <Frame sx={{ height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Распределение провайдеров аутентификации
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Всего пользователей: {data.totalUsers}
      </Typography>

      <PieChart
        series={[
          {
            data: seriesData,
            innerRadius: 50,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 50, left: 10, right: 10 }}
        slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: 12 }, }, }}
      />
    </Frame>
  );
}