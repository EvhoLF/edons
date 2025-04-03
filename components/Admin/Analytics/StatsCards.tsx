import { Icon } from '@/components/UI/Icon/Icon';
import { Card, CardContent, Grid2, Typography, Box } from '@mui/material';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Пользователи',
      value: stats.userCount,
      icon: <Icon fontSize='large' color='primary' />,
      color: 'primary.main'
    },
    {
      title: 'Карты',
      value: stats.mapCount,
      icon: <Icon fontSize='large' color='secondary' />,
      color: 'secondary.main'
    },
    {
      title: 'Успешные операции',
      value: stats.successLogs,
      icon: <Icon fontSize='large' color='success' />,
      color: 'success.main'
    },
    {
      title: 'Ошибки',
      value: stats.errorLogs,
      icon: <Icon fontSize='large' color='error' />,
      color: 'error.main'
    }
  ];

  return (
    <Grid2 container spacing={3}>
      {cards.map((card, index) => (
        <Grid2 size={{ xs: 16, sm: 6, lg: 3 }} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: card.color }}>
                    {card.value}
                  </Typography>
                </Box>
                {/* {card.icon} */}
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      ))
      }
    </Grid2 >
  );
}