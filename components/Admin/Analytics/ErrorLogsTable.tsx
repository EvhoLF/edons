import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Box } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function ErrorLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography>Нет данных об ошибках</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ошибки и предупреждения
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Действие</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Последнее появление</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={getStatusColor(log.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.count}</TableCell>
                <TableCell>
                  {format(new Date(log.lastOccurred), 'dd MMM yyyy HH:mm', { locale: ru })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}