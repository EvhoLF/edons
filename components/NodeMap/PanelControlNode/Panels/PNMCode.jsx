import React, { useCallback, useMemo } from 'react';
import { Icon } from '@/components/UI/Icon/Icon';
import InputText from '@/components/UI/MUI/InputText';
import InputColor from '@/components/UI/InputColor/InputColor';
import SelectBase from '@/components/UI/MUI/SelectBase';
import { data_codeTypes } from '@/data/data_codeTypes';
import { data_nodeTypesTemplate } from '@/data/data_nodeTypesTemplate';
import { icons_names } from '@/data/data_icons';
import Frame from '@/components/UI/Frame/Frame';
import useRF from '@/hooks/useRF';
import { Autocomplete, MenuItem, Stack, TextField, InputAdornment, Grid2, Typography } from '@mui/material';
import DropdownSearchMenu from '@/components/UI/MUI/DropdownSearchMenu';

const PNMCode = React.memo(({ node }) => {
  const { id, data } = node;
  const { label, color, icon, codeType } = data;
  const { updateNodeData } = useRF();

  const handleLabelChange = useCallback(
    (e) => updateNodeData(id, { label: e.target.value }),
    [id, updateNodeData]
  );

  const handleColorChange = useCallback(
    (e) => updateNodeData(id, { color: e.target.value }),
    [id, updateNodeData]
  );

  const handleIconChange = useCallback(
    (e) => updateNodeData(id, { icon: e.target.value }),
    [id, updateNodeData]
  );

  const handleCodeTypeChange = useCallback(
    (event, newValue) => {
      if (newValue?.id) updateNodeData(id, { codeType: newValue.id });
    },
    [id, updateNodeData]
  );

  // console.log(data_codeTypes);

  const codeTypeOptions = useMemo(
    () => Object.values(data_codeTypes).map((e) => ({ id: e.type, label: e.name, color: data_nodeTypesTemplate[e.type] })),
    []
  );

  const selectedCodeType = useMemo(
    () => (data_codeTypes[codeType] ? { id: codeType, label: data_codeTypes[codeType].name } : null),
    [codeType]
  );

  return (
    <Frame sx={{ padding: '.75rem', maxWidth: '250px' }}>
      <Stack spacing={1.5}>
        <Typography variant='h6'>Параметры</Typography>

        <InputText value={label} onChange={handleLabelChange} size='small' startIcon='title' placeholder='Label' />

        <Grid2 container spacing={1}>
          <Grid2 item size={8}>
            <InputText value={color} onChange={handleColorChange} size='small' placeholder='Color: #------'
              startAdornment={<InputColor color={color} onChange={(e) => updateNodeData(id, { color: e })} />}
            />
          </Grid2>
          <Grid2 item size={4}>
            <DropdownSearchMenu value={icon} onChange={handleIconChange} />
            {/* <SelectBase
              
              sx={{ maxHeight: '40px', '& .MuiInputBase-inputSizeSmall': { display: 'flex', alignItems: 'center' } }}
              sxFrom={{ width: '100%', }}
              size='small' MenuProps={{ PaperProps: { style: { maxHeight: 36 * 4.3 } } }}
            >
              {icons_names.map((e) => (<MenuItem key={`menuitem-${e}`} value={e}> <Icon icon={e} /> </MenuItem>))}
            </SelectBase> */}
          </Grid2>
        </Grid2>

        <Autocomplete
          sx={{ maxHeight: '40px', '.MuiInputBase-inputSizeSmall.MuiInputBase-input': { padding: '2.5px 8px 2.5px 4px !important' } }}
          size='small' options={codeTypeOptions} value={selectedCodeType} onChange={handleCodeTypeChange}
          // disablePortal
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='Code type'
              InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position='start' sx={{ paddingLeft: '8px', paddingRight: '14px' }}> <Icon icon='code' /> </InputAdornment>), }}
            />
          )}
          renderOption={(props, option) => {
            return (<li {...props} key={option.id}> <Stack color={option.color} direction='row' spacing={2}> <Icon icon={option.id} /> {option.label} </Stack> </li>)
          }}
        />
      </Stack>
    </Frame>
  );
});

export default PNMCode;