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
    (e) => updateNodeData(id, { icon: e }),
    [id, updateNodeData]
  );

  const handleCodeTypeChange = (e) => { if (e) updateNodeData(id, { codeType: e }); }

  const codeTypeOptions = useMemo(
    () => Object.values(data_codeTypes).map((e) => ({ id: e.type, name: e.name, icon: e.type, color: data_nodeTypesTemplate[e.type] })),
    []
  );

  const iconItems = useMemo(() => icons_names.map((name) => ({ id: name, icon: name, name, color: "#eef", })), []);
  const nodeTypesArray = useMemo(() => Object.values(data_nodeTypesTemplate), []);

  const selectedTemplate = (e) => {
    const { color, icon, codeType } = data_nodeTypesTemplate[e];
    updateNodeData(id, { color, icon, codeType })
  };

  return (
    <Frame sx={{ padding: '.75rem', maxWidth: '250px' }}>
      <Stack spacing={1.5}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h6'>Параметры</Typography>
          <DropdownSearchMenu
            onChange={selectedTemplate}
            data={nodeTypesArray}
            getLabel={(item) => item.name}
            getIcon={(item) => item.icon}
            getColor={(item) => item.color}
          >
            <Icon icon='template' color='ui' />
          </DropdownSearchMenu>
        </Stack>

        <InputText value={label} onChange={handleLabelChange} size='small' startIcon='title' placeholder='Label' />

        <Grid2 container spacing={1}>
          <Grid2 item size={9}>
            <InputText value={color} onChange={handleColorChange} size='small' placeholder='Color: #------'
              startAdornment={<InputColor color={color} onChange={(e) => updateNodeData(id, { color: e })} />}
            />
          </Grid2>
          <Grid2 item size={3}>
            <DropdownSearchMenu
              value={icon}
              onChange={(id) => handleIconChange(id)}
              data={iconItems}
              getLabel={(item) => item.name}
              getIcon={(item) => item.icon}
            />
          </Grid2>
        </Grid2>

        <DropdownSearchMenu
          value={codeType}
          onChange={(id) => handleCodeTypeChange(id)}
          data={codeTypeOptions}
          getLabel={(item) => item.name}
          getIcon={(item) => item.icon}
          getColor={(item) => item.color}
          isInputText
        />
      </Stack>
    </Frame>
  );
});

export default PNMCode;