'use client'
import { Box, Button, Grid2, IconButton, MenuItem, SelectChangeEvent, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import InputText from '../UI/MUI/InputText'
import CardMap from './CardMap/CardMap'
import { Icon } from '../UI/Icon/Icon'
import { useSession } from 'next-auth/react'
import { IMap } from '@/DB/models/Map'
import { MapAction } from '@/DB/actions/MapAction'
import { useModal } from '@/hooks/useModal'
import ModalFormMapCreate from '../Modals/ModalFormMapCreate'
import ModalFormMapOptions from '../Modals/ModalFormMapOptions'
import SelectBase from '../UI/MUI/SelectBase'

const sortOptions = {
  NAME_ASC: { label: 'Название (A-Z)', compare: (a: IMap, b: IMap) => a.label.localeCompare(b.label) },
  NAME_DESC: { label: 'Название (Z-A)', compare: (a: IMap, b: IMap) => b.label.localeCompare(a.label) },
  DATE_CREATE_NEW: { label: 'Дата создания (новые)', compare: (a: IMap, b: IMap) => +new Date(b.dateCreate) - +new Date(a.dateCreate) },
  DATE_CREATE_OLD: { label: 'Дата создания (старые)', compare: (a: IMap, b: IMap) => +new Date(a.dateCreate) - +new Date(b.dateCreate) },
  LAST_UPDATE_NEW: { label: 'Дата обновления (новые)', compare: (a: IMap, b: IMap) => +new Date(b.lastUpdate) - +new Date(a.lastUpdate) },
  LAST_UPDATE_OLD: { label: 'Дата обновления (старые)', compare: (a: IMap, b: IMap) => +new Date(a.lastUpdate) - +new Date(b.lastUpdate) },
  FAVOURITES: { label: 'Избранные', compare: (a: IMap, b: IMap) => Number(b.isFavourite) - Number(a.isFavourite) },
  PUBLIC: { label: 'Публичные', compare: (a: IMap, b: IMap) => Number(b.isPublicAccess) - Number(a.isPublicAccess) },
}

const Maps = () => {
  const { showModal, closeModal } = useModal();
  const { data: session, update: setSession } = useSession();
  const [maps, setMaps] = useState<IMap[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<keyof typeof sortOptions>('FAVOURITES');
  const [filterType, setFilterType] = useState<'ALL' | 'FAVOURITES' | 'PUBLIC'>('ALL');

  useEffect(() => {
    const updateForm = async () => {
      if (session?.user?.id) {
        const data = await MapAction.getAll(session?.user?.id);
        if (data.length) {
          const sortedMaps = data.sort((a, b) => Number(b.isFavourite) - Number(a.isFavourite));
          setMaps(sortedMaps);
        }
      }
    }
    updateForm();
  }, [session?.user?.id]);


  const updateMapProperty = async (id: string, updateData: Partial<IMap>) => {
    setMaps(pre => pre.map(map => map.id !== id ? map : { ...map, ...updateData } as IMap));
    await MapAction.update(id, updateData);
  }

  const showModalFormMapCreate = () => {
    showModal({ content: <ModalFormMapCreate userId={session?.user?.id as string} setMaps={setMaps} closeModal={closeModal} /> });
  };

  const showModalFormMapOptions = (idMap: string) => {
    const mapData = maps.find(e => e.id == idMap);
    if (mapData) showModal({ content: <ModalFormMapOptions idMap={idMap} data={mapData} setMaps={setMaps} closeModal={closeModal} /> });
  };

  const handleSortChange = (event: SelectChangeEvent<unknown>) => {
    const newSortType = event.target.value as keyof typeof sortOptions;
    setSortType(newSortType);
    setMaps(prevMaps => [...prevMaps].sort(sortOptions[newSortType].compare));
  };
  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: 'ALL' | 'FAVOURITES' | 'PUBLIC') => {
    if (newFilter) setFilterType(newFilter);
  };
  const filteredMaps = maps
    .filter(map => map.label.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(map => {
      if (filterType === 'FAVOURITES') return map.isFavourite;
      if (filterType === 'PUBLIC') return map.isPublicAccess;
      return true;
    });

  return (
    <Stack>
      <Grid2 container spacing={2} py={2}>
        <Grid2 size={5} component="div">
          <InputText fullWidth placeholder="Поиск" startIcon='search' onChange={(e) => setSearchQuery(e.target.value)} />
        </Grid2>
        <Grid2 size={3} component="div">
          <SelectBase fullWidth value={sortType} onChange={handleSortChange} startAdornment={<Icon icon='sortDown' />}>
            {Object.entries(sortOptions).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </SelectBase>
        </Grid2>
        <Grid2 size={2} component="div">
          <ToggleButtonGroup sx={{ width: '100%' }} color='primary' fullWidth value={filterType} exclusive onChange={handleFilterChange}>
            <Tooltip title="Показать все карты">
              <ToggleButton value="ALL"><Typography fontWeight='700'>все</Typography></ToggleButton>
            </Tooltip>
            <Tooltip title="Показать только избранные карты">
              <ToggleButton value="FAVOURITES"><Icon icon='stars' /></ToggleButton>
            </Tooltip>
            <Tooltip title="Показать только карты с открытым доступом">
              <ToggleButton value="PUBLIC"><Icon icon='link' /></ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid2>
        <Grid2 size={2} component="div">
          <Button onClick={showModalFormMapCreate} fullWidth sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }} size='large' variant='outlined' color='primary'>
            <Box>
              Создать карту
            </Box>
          </Button>
        </Grid2>
      </Grid2>
      <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent={maps.length ? 'flex-start' : 'center'} alignItems='center'>
        {!!filteredMaps?.length && filteredMaps?.map(el => <CardMap key={el.id} updateMapProperty={updateMapProperty} showModalFormMapOptions={showModalFormMapOptions} {...el} />)}
        <Stack sx={{ aspectRatio: maps.length ? '16 / 9' : undefined }} width={maps.length ? '230px' : '100%'} alignItems='center' justifyContent='center' spacing={2}>
          {maps.length ? '' : <Typography variant="h6">Карт нет. Исправь это!</Typography>}
          <Tooltip title="Создать карту">
            <IconButton onClick={showModalFormMapCreate} color='primary' size='large' sx={{ background: '#25142270', width: 'fit-content', height: 'fit-content' }}>
              <Icon icon='plus' color='ui' />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Maps