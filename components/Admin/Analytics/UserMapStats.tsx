import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function UserMapStats({ data }) {
  if (!data) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных о картах пользователя</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Статистика по картам пользователя
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Всего карт</Typography>
            <Typography variant="h4">{data.total?.totalMaps || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Публичные</Typography>
            <Typography variant="h4">{data.total?.totalPublic || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Избранные</Typography>
            <Typography variant="h4">{data.total?.totalFavourites || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Тип карты</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Среднее узлов</TableCell>
              <TableCell align="right">Среднее связей</TableCell>
              <TableCell align="right">Публичные</TableCell>
              <TableCell align="right">Приватные</TableCell>
              <TableCell align="right">Избранные</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.byType?.map((mapType, index) => (
              <TableRow key={index}>
                <TableCell>{mapType.type}</TableCell>
                <TableCell align="right">{mapType.count}</TableCell>
                <TableCell align="right">{mapType.avgNodes}</TableCell>
                <TableCell align="right">{mapType.avgEdges}</TableCell>
                <TableCell align="right">{mapType.publicCount}</TableCell>
                <TableCell align="right">{mapType.privateCount}</TableCell>
                <TableCell align="right">{mapType.favourites}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}