import React, { useCallback } from 'react';
import InputColor from '@/components/UI/InputColor/InputColor';
import Frame from '@/components/UI/Frame/Frame';
import useRF from '@/hooks/useRF';
import { Stack, Typography } from '@mui/material';
import InputText from '@/components/UI/MUI/InputText';

const PNMShape = ({ node }) => {
  const { id, data } = node;
  let { label, color, icon, codeType } = node.data;
  const { updateNodeData } = useRF();

  const handleLabelChange = useCallback(
    (e) => updateNodeData(id, { label: e.target.value }),
    [id, updateNodeData]
  );

  const handleColorChange = useCallback(
    (e) => updateNodeData(id, { color: e.target.value }),
    [id, updateNodeData]
  );

  return (
    <Frame sx={{ padding: '.75rem', maxWidth: '250px' }}>
      <Stack spacing={1.5}>
        <Typography variant='h6'>Параметры</Typography>
        <InputText value={label} onChange={handleLabelChange} size='small' startIcon='title' placeholder='Label' />
        <InputText value={color} onChange={handleColorChange} size='small' placeholder='Color: #------'
          startAdornment={<InputColor color={color} onChange={(e) => updateNodeData(id, { color: e })} />}
        />
      </Stack>
    </Frame >
  );
};

export default PNMShape;