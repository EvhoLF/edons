'use client'
import { IMap } from '@/DB/models/Map';
import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import InputText from '../UI/MUI/InputText';
import { MapAction } from '@/DB/actions/MapAction';
import { Types } from 'mongoose';
import { enqueueSnackbar } from 'notistack';

const ModalFormMapCreate = ({ userId = '', setMaps, closeModal }: { userId: string, setMaps: React.Dispatch<React.SetStateAction<IMap[]>>, closeModal: () => void }) => {
  const [error, setError] = useState<null | string>(null);
  const [label, setValue] = useState('');

  const handler = async () => {
    if (!label) {
      enqueueSnackbar('Вы не ввели название карты', { variant: 'error', });
      return setError('Введите название карты');
    }
    const map = await MapAction.create({ label, userId: new Types.ObjectId(userId) });
    if (map) {
      setMaps((pre: IMap[]) => [...pre, map]);
      setError(null);
      closeModal();
      enqueueSnackbar('Карта создана успешно', { variant: 'success', });
    }
  };
  return (
    <Stack p={2} spacing={3}>
      <Typography variant='h4'>Создание карты</Typography>
      <InputText error={error !== null && !!error} helperText={error} value={label} onChange={e => setValue(e.target.value)} label='Название карты' placeholder='Название' labelActive />
      <Stack justifyContent='end' direction='row' spacing={2}>
        <Button onClick={closeModal} color="error">Отмена</Button>
        <Button onClick={() => { handler(); console.log('Форма отправлена!'); }} color="primary" variant="contained">
          Создать
        </Button>
      </Stack>
    </Stack>
  );
};

export default ModalFormMapCreate;