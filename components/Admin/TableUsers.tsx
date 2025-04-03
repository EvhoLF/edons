"use client";

import { Children, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, Avatar, Typography, Tooltip, } from "@mui/material";
import { ruRU } from "@mui/x-data-grid/locales";
import { Icon } from "../UI/Icon/Icon";
import SelectBase from "../UI/MUI/SelectBase";
import InputButton from "../UI/MUI/InputButton";
import { UserAction } from "@/DB/actions/UserAction";
import { enqueueSnackbar } from "notistack";
import { ValidationError } from "next/dist/compiled/amphtml-validator";

export default function TableUsers() {
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState<ValidationError>({});

  const updateData = async () => { const data = await UserAction.getAll(); setRows(data); setLoading(false); }

  useEffect(() => { updateData(); }, []);

  const handleEdit = (row) => { setEditRow(row); setFormData(row); setOpen(true); };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("ru-RU") : "";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageData(file);
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    const { dateCreate, lastLogin, ...newData } = formData;
    let new_errors = null

    const findUser = await UserAction.getByLogin(newData.authLogin);
    console.log(findUser);

    if (!findUser) {
      enqueueSnackbar('Этот логин уже занят', { variant: 'error', });
      return new_errors = { ...new_errors, authLogin: 'Этот логин уже занят' }
    }

    const updatedUser = await UserAction.update(editRow.id, newData);
    if (updatedUser?.errors) {
      enqueueSnackbar('Произошла ошибка обновления базы данных', { variant: 'error', });
      new_errors = { ...new_errors, ...updatedUser.errors }
    }

    if (imageData) {
      const resImg = await UserAction.uploadAvatar(editRow.id, imageData);
      if (!resImg || resImg.errors) {
        enqueueSnackbar('Произошла ошибка обновления изображения аватара', { variant: 'error', });
        new_errors = { ...new_errors, ...resImg.errors }
      }
    }
    if (new_errors) return setError(new_errors);
    setRows((prev) => prev.map((row) => row.id === editRow.id ? { ...row, ...newData, image: editRow.image } : row));
    setError(null); setOpen(false); setImageData(null);
    enqueueSnackbar('База данных успешно обновлена', { variant: 'success', });
  };

  const handleDelete = async (id) => {
    await UserAction.delete(id);
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const StackCenter = ({ children }) => <Stack alignItems="center" justifyContent="center" width="100%" height="100%">{children}</Stack>

  const columns = [
    {
      field: "image", headerName: "Аватар", headerAlign: "center", disableColumnMenu: true,
      sortComparator: (v1, v2) => (v1 && !v2 ? -1 : !v1 && v2 ? 1 : 0),
      renderCell: ({ row }) => <StackCenter><Avatar src={row.image} /></StackCenter>,
    },
    { field: "name", headerName: "Имя", flex: 1 },
    { field: "authLogin", headerName: "Логин", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Роль" },
    {
      field: "github", headerName: "Github", headerAlign: "center", disableColumnMenu: true,
      renderCell: ({ row }) => <StackCenter><Icon icon="github" color={row.github ? "primary" : "disabled"} /></StackCenter>,
    },
    {
      field: "google", headerName: "Google", headerAlign: "center", disableColumnMenu: true,
      renderCell: ({ row }) => <StackCenter><Icon icon="google" color={row.google ? "primary" : "disabled"} /></StackCenter>,
    },
    {
      field: "dateCreate", headerName: "Регистрация", headerAlign: "center", minWidth: 120, sortable: false, disableColumnMenu: true,
      renderCell: ({ row }) => <StackCenter><Typography>{formatDate(row.dateCreate)}</Typography></StackCenter>,
    },
    {
      field: "lastLogin", headerName: "Активность", headerAlign: "center", minWidth: 120, disableColumnMenu: true,
      renderCell: ({ row }) => <StackCenter> <Typography>{formatDate(row.lastLogin)}</Typography></StackCenter>,
    },
    {
      field: "actions", headerName: "Действия", headerAlign: "center", sortable: false, disableColumnMenu: true,
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
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4">Пользователи</Typography>
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
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogContent>
            <Stack alignItems="center" justifyContent="center" width="100%" height="100%" minWidth='300px' spacing={2}>
              <input hidden id="fileInput" type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
              <label htmlFor="fileInput">
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ width: 100, height: 100 }} alt="Remy Sharp" src={formData.image} />
                  <Stack sx={{ opacity: '0', transition: '.3s', '&:hover': { opacity: '.75' }, '&:active': { opacity: '1' }, position: 'absolute', inset: '0', background: '#11111190', borderRadius: '999999px' }} alignItems='center' justifyContent='center'>
                    <Icon icon='pen' />
                  </Stack>
                </Box>
              </label>
              <Typography variant='caption' textAlign='center'>{formData.id}</Typography>
              <TextField error={error?.name} helperText={error?.name} label="Имя" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth />
              <TextField error={error?.authLogin} helperText={error?.authLogin} label="Логин" value={formData.authLogin || ""} onChange={(e) => setFormData({ ...formData, authLogin: e.target.value })} fullWidth />
              <TextField error={error?.email} helperText={error?.email} label="Email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} fullWidth />
              <SelectBase value={formData.role || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} fullWidth>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </SelectBase>
            </Stack>
          </DialogContent>
          <DialogActions>
            <InputButton onClick={() => setOpen(false)}>Отмена</InputButton>
            <Button onClick={handleSave} color="primary">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
