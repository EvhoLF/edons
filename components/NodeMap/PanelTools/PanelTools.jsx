import React, { useContext } from 'react'
import styles from './PanelTools.module.scss';
import { NodesContext } from '../Map/Map';
import { generateUnique } from '@/utils/generateUnique';
import DnD from '@/components/DnD/DnD';
import { tNodeCode } from '@/data/NodeTemplates/tNodeCode';
import { tNodeShape } from '@/data/NodeTemplates/tNodeShape';
import Menus, { MenusButton, MenusMenu } from '@/components/UI/Menus/Menus';
import APanel from '@/components/UI/APanel/APanel';
import { Icon } from '@/components/UI/Icon/Icon';
import Button from '@/components/UI/Button/Button';

const NODE_DEF = tNodeCode.text;
const templates = {
  node: () => ({
    id: generateUnique(),
    imports: [],
    fileName: '',
    path: '',
    position: { x: 1, y: 1 },
    type: "node",
    data: {
      node: {
        title: '',
        color: NODE_DEF.color,
        icon: NODE_DEF.icon,
        textHeader: '',
        text: '',
        image: '',
        code: { type: NODE_DEF.type, data: '' },
        visibleField: { textHeader: false, text: false, image: false, code: false, ...NODE_DEF.visibleField },
        property: { fileName: null, fileSize: null, },
      },
    },
  }),
}

const PanelAddNode = () => {
  const { setNodes } = useContext(NodesContext);

  const addNodes = (type, options) => () => {
    setNodes(prev => [...prev, templates[type](options)])
  }

  return (
    <div className={styles.PanelTools}>
      <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
        <div className={styles.tools_button}>
          <Icon icon='code' />
        </div>
      </DnD>

      <div>
        <Menus>
          <MenusButton>
            <div className={styles.tools_button}>
              <Icon icon='shape_rectangle' />
            </div>
          </MenusButton>
          <MenusMenu>
            <APanel className={styles.PanelTools}>
              {
                Object.values(tNodeShape).map(e => (
                  <div key={e.id} className={styles.tools_button}>
                    <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'shape', subType: e.id } }}>
                      <div className={styles.tools_button}>
                        <Icon icon={e.data.icon} />
                      </div>
                    </DnD>
                  </div>
                ))
              }
            </APanel>
          </MenusMenu>
        </Menus>
      </div>

      <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'table' } }}>
        <div className={styles.tools_button}>
          <Icon icon='sql' />
        </div>
      </DnD>

      <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
        <div className={styles.tools_button}>
          <Icon icon='chartPie' />
        </div>
      </DnD>

      <DnD data={{ type: 'ADD_NODE', data: { nodeType: 'code' } }}>
        <div className={styles.tools_button}>
          <Icon icon='chartLine' />
        </div>
      </DnD>

    </div>
  )
}

export default PanelAddNode