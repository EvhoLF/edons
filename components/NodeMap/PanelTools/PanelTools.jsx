import React, { useContext, useCallback, useMemo, useState } from 'react';
import { NodesContext } from '../Map/Map';
import { generateUnique } from '@/utils/generateUnique';
import DnD from '@/components/DnD/DnD';
import { tNodeCode } from '@/data/NodeTemplates/tNodeCode';
import { tNodeShape } from '@/data/NodeTemplates/tNodeShape';
import { IconButton, MenuItem, Box, Stack, Popover, Tooltip } from '@mui/material';
import { Icon } from '@/components/UI/Icon/Icon';
import Frame from '@/components/UI/Frame/Frame';
import PopoverMenu from '@/components/UI/MUI/PopoverMenu';


const PanelAddNode = () => {

  const menuItems = useMemo(() => Object.values(tNodeShape).map(e => (
    <DnD key={e.id} data={{ type: 'ADD_NODE', data: { nodeType: 'shape', subType: e.id } }}>
      <IconButton color='primary'>
        <Icon icon={e.data.icon} color='ui' />
      </IconButton>
    </DnD>
  )), []);

  return (
    <Frame sx={{ width: 'fit-content' }} p={.5}>
      <Stack spacing={1}>
        <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
          <Tooltip title='Блок узел'>
            <IconButton color='primary'>
              <Icon icon='code' color='ui' />
            </IconButton>
          </Tooltip>
        </DnD>

        <PopoverMenu
          openButton={({ handleOpen }) => (
            <Box>
              <Tooltip title='Блоки фигуры'>
                <IconButton onClick={handleOpen} color='primary'>
                  <Icon icon='shape_rectangle' color='ui' />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          sx={{ marginLeft: 2 }}
          stack={{ spacing: 1 }}
        >
          {menuItems}
        </PopoverMenu>

        <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'table' } }}>
          <Tooltip title='Блок базы данных'>
            <IconButton color='primary'>
              <Icon icon='sql' color='ui' />
            </IconButton>
          </Tooltip>
        </DnD>
        <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
          <Tooltip title='Блок диаграмма'>
            <IconButton color='primary'>
              <Icon icon='chartPie' color='ui' />
            </IconButton>
          </Tooltip>
        </DnD>
        <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
          <Tooltip title='Блок диаграмма'>
            <IconButton color='primary'>
              <Icon icon='chartLine' color='ui' />
            </IconButton>
          </Tooltip>
        </DnD>
      </Stack>
    </Frame >
  );
};

export default React.memo(PanelAddNode);