"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { ruRU } from "@mui/x-data-grid/locales";
import { Icon } from "../UI/Icon/Icon";
import { MapAction } from "@/DB/actions/MapAction";
import { UserAction } from "@/DB/actions/UserAction";
import { IUser } from "@/DB/models/User";
import { enqueueSnackbar } from "notistack";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import InputButton from "../UI/MUI/InputButton";

export default function TableMaps() {
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ValidationError>({});
  const [users, setUsers] = useState<IUser[]>();

  const updateData = async () => {
    try {
      setLoading(true); // Начинаем загрузку
      const [data, data_users] = await Promise.all([MapAction.getAll(), UserAction.getAll()]);
      setRows(data); setUsers(data_users);
    }
    catch (error) { console.error("Error fetching data:", error); }
    finally { setLoading(false); }
  }

  useEffect(() => { updateData(); }, []);

  const handleEdit = (row) => {
    setEditRow(row);
    setFormData(row);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData || !formData?.label) {
      enqueueSnackbar('Введите название карты', { variant: 'error', });
      return setError({ label: 'Введите название карты' })
    }
    const updatedMap = await MapAction.update(editRow.id, formData);
    if (!updatedMap || updatedMap.errors) {
      enqueueSnackbar('Произошла ошибка обновления базы данных', { variant: 'error', });
      return
    }
    setRows((prev) => prev.map((row) => (row.id === editRow.id ? { ...row, ...formData } : row)));
    setOpen(false);
    enqueueSnackbar('База данных успешно обновлена', { variant: 'success', });
    setError(null);
  };

  const handleDelete = async (id) => {
    await MapAction.delete(id);
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("ru-RU") : "";
  const StackCenter = ({ children }) => <Stack alignItems="center" justifyContent="center" width="100%" height="100%">{children}</Stack>

  const columns = [
    { field: "label", headerName: "Название", flex: 1 },
    {
      field: "user", headerName: "Пользователь", flex: 1, renderCell: ({ row }) => {
        const thisUser = row.userId ? users.find(e => e.id == row.userId) : null;
        return (
          <Stack direction='row' height='100%' width='100%' alignItems='center' justifyContent='start' spacing={2}>
            <Avatar src={thisUser.image} />
            <Typography>{thisUser.name}</Typography>
          </Stack>
        )
      }
    },
    // { field: "type", headerName: "Тип", headerAlign: "center", minWidth: 120, renderCell: ({ row }) => <StackCenter><Typography>{row.type}</Typography></StackCenter> },
    { field: "nodes", headerName: "Кол. узлов", headerAlign: "center", minWidth: 120, renderCell: ({ row }) => <StackCenter><Typography>{row.nodes.length}</Typography></StackCenter> },
    { field: "isFavourite", headerName: <Icon fontSize='small' icon='stars' />, headerAlign: "center", minWidth: 100, renderCell: ({ row }) => <StackCenter><Icon color={row.isFavourite ? 'uiColor_yellow' : 'disabled'} fontSize='small' icon="stars" /></StackCenter>, },
    { field: "isPublicAccess", headerName: <Icon fontSize='small' icon='link' />, headerAlign: "center", minWidth: 100, renderCell: ({ row }) => <StackCenter><Icon color={row.isPublicAccess ? 'uiColor_blue' : 'disabled'} fontSize='small' icon="link" /></StackCenter> },
    { field: "dateCreate", headerName: "Создана", headerAlign: "center", minWidth: 120, renderCell: ({ row }) => <StackCenter>{formatDate(row.dateCreate)}</StackCenter>, },
    { field: "lastUpdate", headerName: "Обнавлена", headerAlign: "center", minWidth: 120, renderCell: ({ row }) => <StackCenter>{formatDate(row.dateCreate)}</StackCenter>, },
    {
      field: "actions", headerName: "Действия", headerAlign: "center", sortable: false, disableColumnMenu: true, minWidth: 120,
      renderCell: ({ row }) => (
        <Stack direction='row' alignItems="center" justifyContent="center" width="100%" height="100%">
          <Tooltip title='Редактировать'>
            <IconButton onClick={() => handleEdit(row)} size="small">
              <Icon fontSize="small" icon="pen" />
            </IconButton>
          </Tooltip>
          <Tooltip title='Удалить'>
            <IconButton onClick={() => handleDelete(row.id)} size="small">
              <Icon color="error" fontSize="small" icon="delete" />
            </IconButton>
          </Tooltip>
          <Tooltip title='Просмотр'>
            <IconButton href={`/maps/${row.id}`} size="small">
              <Icon fontSize="small" icon='eyeON' />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    }
  ];

  return (
    <>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4">Карты</Typography>
        <InputButton onClick={updateData} variant='outlined'>Обновить</InputButton>
      </Stack>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ "& .MuiDataGrid-columnHeaders>*": { backgroundColor: "#771336 !important" } }}
          loading={loading}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
        />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Редактировать карту</DialogTitle>
          <DialogContent>
            <Stack minWidth='300px' spacing={1}>
              <TextField error={error?.label} helperText={error?.label} label="Название" fullWidth margin="dense" value={formData.label || ""} onChange={(e) => setFormData(pre => ({ ...pre, label: e.target.value }))} />
              <TextField error={error?.userId} helperText={error?.userId} label="ID Пользователя" fullWidth margin="dense" value={formData.userId || ""} onChange={(e) => setFormData(pre => ({ ...pre, userId: e.target.value }))} />
              <FormControlLabel control={<Switch checked={formData?.isFavourite} onChange={e => setFormData(pre => ({ ...pre, isFavourite: e.target.checked }))} />} label='Избранная карта' />
              <FormControlLabel control={<Switch checked={formData?.isPublicAccess} onChange={e => setFormData(pre => ({ ...pre, isPublicAccess: e.target.checked }))} />} label="Открытый доступ" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleSave} color="primary">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}