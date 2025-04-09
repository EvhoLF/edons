// pages/Documentation.jsx (или .tsx)
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack
} from "@mui/material";
import { Icon } from "@/components/UI/Icon/Icon";
import Header from "@/components/Header/Header";
import BG from "@/components/UI/BG/BG";

export default function Documentation() {
  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 13, px: 2 }}>
        <Typography variant="h3" gutterBottom>
          Документация
        </Typography>
        <Typography variant="body1" paragraph>
          Добро пожаловать на страницу документации по работе с платформой!
          Здесь вы найдёте все основные сведения о том, как пользоваться
          нашим сайтом, какими функциями обладаем и как максимально
          эффективно организовать свою работу.
        </Typography>

        {/* Аккордеон: Начало работы */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<Icon icon='arrow_down_alt' />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Icon icon='edons' /> Начало работы
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              Перед тем как начать, убедитесь, что у вас есть аккаунт.
              Вы можете авторизоваться через Google, GitHub или создать
              новую учётную запись, указав email и пароль.
              При желании можно привязать несколько OAuth-провайдеров.
            </Typography>
            <Typography variant="body2">
              После входа на сайт вы увидите меню проектов и кнопку
              «Создать новую карту» (или «Импорт GitHub»). Нажмите на
              интересующий вас вариант, чтобы перейти к редактированию
              структуры проекта.
            </Typography>
            {/* Пример вставки дополнительного скриншота */}
          </AccordionDetails>
        </Accordion>

        {/* Аккордеон: Авторизация и безопасность */}
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon='arrow_down_alt' />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Icon icon='profile' /> Авторизация и безопасность
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              Все пользовательские сессии управляются с помощью JWT-токенов.
              Мы используем надёжное шифрование паролей через bcrypt.
              OAuth-авторизация предоставляет максимально безопасный метод
              входа в систему.
            </Typography>
            <Typography variant="body2">
              Если вы захотите отвязать OAuth-аккаунт или изменить
              способ входа, обратитесь в настройки профиля или администратору.
              Пароль можно обновить в личном кабинете пользователя.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Аккордеон: Импорт проектов из GitHub */}
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon='arrow_down_alt' />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Icon icon='github' /> Импорт из GitHub
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              Наша платформа умеет автоматически импортировать структуру
              репозиториев GitHub и строить архитектурную карту исходных файлов.
              Достаточно указать URL репозитория, выбрать ветку и подтвердить
              импорт. Система выполнит парсинг кода, создаст интерактивную
              схему и даст возможность сразу её редактировать.
            </Typography>
            <Typography variant="body2">
              При необходимости можно выбрать приватный репозиторий,
              авторизовавшись через ваш GitHub-аккаунт с нужными правами
              доступа. Импорт больших репозиториев может занять время,
              но вы получите готовую карту с информацией о файлах и зависимостях.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Аккордеон: Совместная работа */}
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon='arrow_down_alt' />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Icon icon='users' /> Совместная работа
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              Платформа поддерживает реальный режим коллаборации. Несколько
              участников могут одновременно редактировать карту, видеть курсоры,
              перемещение элементов, и тут же обсуждать правки.
            </Typography>
            <Typography variant="body2" paragraph>
              Для организации совестной работы достаточно включить общий доступ
              к карте и передать ссылку коллегам. Можно указать права участников:
              просмотр, редактирование, комментарии.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Аккордеон: Редактирование кода */}
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon='arrow_down_alt' />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Icon icon='code' /> Редактирование кода
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              Каждый узел на диаграмме может содержать фрагмент исходного кода.
              При двойном клике на узел открывается редактор с подсветкой
              синтаксиса (CodeMirror). Поддерживаются языки: HTML, CSS, JS, TS,
              Python, C++, Java, и другие.
            </Typography>
            <Typography variant="body2">
              Редактор кода позволяет быстро вносить мелкие исправления
              или комментировать логику конкретного блока прямо внутри
              архитектурной схемы, что упрощает понимание структуры
              и взаимосвязей проекта.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Заключение */}
        <Box mt={4}>
          <Typography variant="h6" align='center'>Заключение</Typography>
          <Typography variant="body1" align='center'>
            Мы постоянно улучшаем и расширяем возможности платформы EDONs,
            делая её ещё более удобной и функциональной. Следите за обновлениями,
            изучайте новые возможности и не стесняйтесь обращаться в службу
            поддержки или к администратору системы при возникновении вопросов.
            Успешной работы!
          </Typography>
        </Box>

        <footer>
          <Stack alignItems='center' p={2} mt={10}>
            <Typography>
              © 2025. All rights reserved - by Chistoedov Maxim
            </Typography>
          </Stack>
        </footer>
      </Box >
      <BG />
    </>
  );
}
