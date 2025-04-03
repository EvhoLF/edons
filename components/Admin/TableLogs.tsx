"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Stack, Typography, } from "@mui/material";
import { ruRU } from "@mui/x-data-grid/locales";
import InputButton from "../UI/MUI/InputButton";
import { LogAction } from "@/DB/actions/LogAction";
import { UserAction } from "@/DB/actions/UserAction";
import { IUser } from "@/DB/models/User";
import { enqueueSnackbar } from "notistack";
import EntityEl from "./EntityEl";

export default function TableUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>();

  const updateData = async () => {
    try {
      setLoading(true); // Начинаем загрузку
      const [data, data_users] = await Promise.all([LogAction.getAll(), UserAction.getAll()]);
      setRows(data); setUsers(data_users);
    }
    catch (error) { console.error("Error fetching data:", error); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    updateData();
  }, []);

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString("ru-RU", { hour12: false }) : "";

  const handleDeleteLogs = async () => {
    await LogAction.clear(0);
    const data = await LogAction.getAll();
    if (data) {
      enqueueSnackbar('Журнал очищен', { variant: 'success', });
      setRows(data);
    }
  };

  const StackCenter = ({ children }) => <Stack alignItems="center" justifyContent="center" width="100%" height="100%">{children}</Stack>

  const LogActions_ru = {
    user_get: 'Получение пользов.',
    user_signup: 'Регистрация пользов.',
    user_signin: 'Вход пользов.',
    user_update: 'Обновление пользов.',
    user_delete: 'Удаление пользов.',
    user_link: 'Привязка аккаунта',
    map_get: 'Получение карты',
    map_create: 'Создание карты',
    map_update: 'Обновление карты',
    map_save: 'Сохранение карты',
    map_delete: 'Удаление карты',
    map_github_import: 'Импорт с GitHub',
    other: 'Другое',
  }

  const LogStatuses_ru = {
    success: 'Успешно',
    error: 'Ошибка',
    warning: 'Предупреждение',
    info: 'Информация',
  }

  const columns = [
    {
      field: "userId", headerName: "Пользователь", headerAlign: "center", flex: 1.2, minWidth: 180,
      renderCell: ({ row }) => {
        if (!row?.userId) return <EntityEl />
        const thisUser = users.find(e => e.id == row.userId);
        if (!thisUser) return <EntityEl text='DELETE' />
        return (
          <Stack direction='row' height='100%' width='100%' alignItems='center' justifyContent='center' spacing={1}>
            {thisUser?.image && <Avatar src={thisUser.image} />}
            <Typography variant='caption'>{row.userId ?? '-'}</Typography>
          </Stack>
        )
      }
    },
    {
      field: "action", headerName: "Действие", headerAlign: "center", minWidth: 200,
      valueGetter: (params) => LogActions_ru[params] || params || "Неизвестно",
      renderCell: ({ row }) => {
        const actionText = row?.action ? LogActions_ru[row.action] : "Неизвестно";
        return <StackCenter><Typography>{actionText}</Typography></StackCenter>;
      },
    },
    {
      field: "status", headerName: "Статус", headerAlign: "center", minWidth: 180,
      valueGetter: (params) => LogStatuses_ru[params] || params || "Неизвестно",
      renderCell: ({ row }) => {
        const statusText = row?.status ? LogStatuses_ru[row.status] : "Неизвестно";
        return <StackCenter><Typography color={row?.status || 'info'}>{statusText}</Typography></StackCenter>;
      },
    },
    {
      field: "createdAt", headerName: "Дата", headerAlign: "center", minWidth: 200, sortable: false, disableColumnMenu: true,
      renderCell: ({ row }) => <StackCenter><Typography>{formatDate(row.createdAt)}</Typography></StackCenter>,
    },
    {
      field: "description", headerName: "Описание", flex: 2.5, headerAlign: "center",
      renderCell: ({ row }) =>
        <Stack height='100%' justifyContent='center'>
          <Typography sx={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflow: 'auto',
          }} variant='caption'>{row.description}</Typography>
        </Stack>,
    },
  ];

  return (
    <>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4">Журнал</Typography>
        <InputButton onClick={updateData} variant='outlined'>Обновить</InputButton>
      </Stack>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ "& .MuiDataGrid-columnHeaders>*": { backgroundColor: "#771336 !important" } }}
          loading={loading}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
        />
      </Box>
      <Stack direction='row' justifyContent='end'>
        <InputButton onClick={handleDeleteLogs} variant='contained' sx={{ mt: 2 }}>Очистить журнал</InputButton>
      </Stack >
    </>
  );
}