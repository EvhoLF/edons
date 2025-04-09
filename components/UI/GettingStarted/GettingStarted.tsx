import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button
} from '@mui/material';

const steps = [
  {
    label: 'Авторизация',
    description: 'Зайдите через GitHub/Google или зарегистрируйтесь по email.'
  },
  {
    label: 'Создание схемы',
    description: 'Выберите «Новая карта» или импортируйте репозиторий.'
  },
  {
    label: 'Редактирование',
    description: 'Перемещайте узлы, комментируйте, вносите правки, меняйте связи.'
  },
  {
    label: 'Совместная работа',
    description: 'Пригласите коллег, наблюдайте их курсоры и правки в реальном времени.'
  }
];

const GettingStarted: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Как начать
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Следуйте простым шагам ниже, чтобы быстро приступить к работе
        </Typography>

        <Stepper orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index} active={true} completed={false}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <Box sx={{ pl: 4, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Step>
          ))}
        </Stepper>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 2, px: 5 }}
            href='/maps'
          >
            Попробовать
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GettingStarted;
