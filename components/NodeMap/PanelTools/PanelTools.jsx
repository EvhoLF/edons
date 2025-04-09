import React, { useContext, useCallback, useMemo, useState } from 'react';
import { NodesContext } from '../Map/Map';
import { generateUnique } from '@/utils/generateUnique';
import DnD from '@/components/DnD/DnD';
import { tNodeCode } from '@/data/NodeTemplates/tNodeCode';
import { tNodeShape } from '@/data/NodeTemplates/tNodeShape';
import { IconButton, MenuItem, Box, Stack, Popover, Tooltip, Button } from '@mui/material';
import { Icon } from '@/components/UI/Icon/Icon';
import Frame from '@/components/UI/Frame/Frame';
import PopoverMenu from '@/components/UI/MUI/PopoverMenu';
import InputButton from '@/components/UI/MUI/InputButton';


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
          <Tooltip title='Узел код'>
            <Button sx={{ minWidth: 0, aspectRatio: '1/1' }} color='primary'>
              <Icon icon='code' color='ui' />
            </Button>
          </Tooltip>
        </DnD>


        <PopoverMenu
          openButton={({ handleOpen, isOpen }) => (
            <Stack spacing='2px' alignItems='center'>
              <Tooltip title='Узел квадрат'>
                <Box>
                  <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'shape', subType: 'rectangle' } }}>
                    <Button sx={{ minWidth: 0, scale: '1 !important', }} color='primary'>
                      <Icon icon='shape_rectangle' color='ui' />
                    </Button>
                  </DnD>
                </Box>
              </Tooltip>
              <Tooltip title='Узлы фигур'>
                <Button
                  onClick={handleOpen}
                  sx={{
                    display: 'flex',
                    width: 40, height: 12, p: 0, m: 0, minWidth: 0, minHeight: 0,
                    fontSize: '24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    scale: '1 !important',
                  }}
                >
                  <Icon fontSize='medium' icon='arrow_down_alt' color='ui' sx={{ transition: '.2s', rotate: isOpen ? '180deg' : '' }} />
                </Button>
              </Tooltip>
            </Stack>
          )}
          sx={{ marginLeft: 2 }}
          stack={{ spacing: 1 }}
        >
          {menuItems}
        </PopoverMenu>

        <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'table' } }}>
          <Tooltip title='Узел таблица'>
            <IconButton color='primary'>
              <Icon icon='sql' color='ui' />
            </IconButton>
          </Tooltip>
        </DnD>
        {/* <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
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
        </DnD> */}
      </Stack >
    </Frame >
  );
};

export default React.memo(PanelAddNode);