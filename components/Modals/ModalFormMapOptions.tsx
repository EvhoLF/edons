import { IMap } from '@/DB/models/Map';
import { Button, FormControlLabel, IconButton, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import InputText from '../UI/MUI/InputText';
import { MapAction } from '@/DB/actions/MapAction';
import { Icon } from '../UI/Icon/Icon';
import { enqueueSnackbar } from 'notistack';
import { useModal } from '@/hooks/useModal';
import ModalConfirm from './ModalConfirm';

const ModalFormMapOptions = ({ idMap = '', data, setMaps, closeModal }: { idMap: string, data: IMap, setMaps: React.Dispatch<React.SetStateAction<IMap[]>>, closeModal: () => void }) => {
  const [error, setError] = useState<null | string>(null);
  const [map, setMap] = useState<Partial<IMap>>(data);

  const { showModal: showModal2, closeModal: closeModal2 } = useModal();

  const onChangeLabel = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMap((pre) => ({ ...pre, label: e.target.value }));
  };

  const onToggleField = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setMap((pre) => ({ ...pre, [field]: e.target.checked }));
  };

  const deleteHandler = async () => {
    showModal2({
      content: <ModalConfirm title='Удаление карты' text='Вы уверены, что хотите удалить эту карту? Это действие нельзя отменить'
        onConfirm={async () => {
          try {
            const res = await MapAction.delete(idMap);
            if (res) {
              setMaps(pre => pre.filter(e => e.id !== idMap));
              setError(null);
              closeModal();
              closeModal2();
              enqueueSnackbar('Карта успешно удалена', { variant: 'success', });
            }
          }
          catch { }
        }}
        closeModal={closeModal2} />
    })
  }

  const handler = async () => {
    if (!map.label) {
      enqueueSnackbar('Вы не ввели название карты', { variant: 'error', });
      return setError('Введите название карты');
    }
    const res = await MapAction.update(idMap, map);
    if (res) {
      setMaps(pre => pre.map(pre_map => pre_map.id !== idMap ? pre_map : res as IMap));
      setError(null);
      closeModal();
      enqueueSnackbar('Карта успешно обновлена', { variant: 'success', });
    }
  };


  return (
    <Stack p={2} spacing={3}>
      <Typography variant='h4'>Настройка карты</Typography>
      <InputText error={error !== null && !!error} helperText={error} value={map.label} onChange={onChangeLabel} label='Название карты' placeholder='Название' labelActive />
      <Stack>
        <FormControlLabel control={<Switch checked={map?.isFavourite} onChange={onToggleField('isFavourite')} />} label='Избранная карта' />
        <Tooltip title={'После активации карта будет доступна всем пользователям по ссылке'}>
          <FormControlLabel control={<Switch checked={map?.isPublicAccess} onChange={onToggleField('isPublicAccess')} />} label="Открытый доступ" />
        </Tooltip>
      </Stack>
      <InputText disabled={!map.isPublicAccess} value={`http://localhost:3000/map/${map.id}`} label='Ссылка на карту' size='small' endAdornment={<IconButton disabled={!map.isPublicAccess}><Icon icon='copy' /></IconButton>} />
      <Stack justifyContent='space-between' direction='row' spacing={2}>
        <Button onClick={deleteHandler} color='error'>Удалить</Button>
        <Stack direction='row' spacing={2}>
          <Button onClick={closeModal} color='primary'>Отмена</Button>
          <Button onClick={() => { handler(); console.log('Форма отправлена!'); }} color="primary" variant="contained">
            Сохранить
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ModalFormMapOptions;