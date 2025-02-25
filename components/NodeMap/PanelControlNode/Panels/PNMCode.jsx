import React from 'react';
import styles from '../PanelNodeManager.module.scss';
import InputDrop from '@/components/UI/InputDrop/InputDrop';
import Button from '@/components/UI/Button/Button';
import { Icon } from '@/components/UI/Icon/Icon';
import Input from '@/components/UI/Input/Input';
import InputColor from '@/components/UI/InputColor/InputColor';
import { data_codeTypes } from '@/data/data_codeTypes';
import Frame from '@/components/UI/Frame/Frame';
import { tNodeCode } from '@/data/NodeTemplates/tNodeCode';
import useRF from '@/hooks/useRF';
import { icons_names } from '@/data/data_icons';

const IconON = <Icon icon='eyeON' color='#eeeeff' />;
const IconOFF = <Icon icon='eyeOFF' color='#9999b4' />;

const PNMCode = ({ node }) => {
  const { id, data } = node;
  let { label, color, icon, codeType, codeData, isClose = '' } = node.data;
  const { updateNodeData } = useRF();

  return (
    <Frame className={styles.PNM}>
      <div className={styles.PNM_item}>
        <h3 className={styles.PNM_title}>Parameters</h3>
        <InputDrop className={styles.PNM_item_inputDrop}
          id="template"
          listData={Object.values(tNodeCode)}
          listDisplay={({ name, data }) => (
            <div className={styles.PNM_template_item}>
              <Icon icon={data.icon} color={data.color} />
              {name}
            </div>
          )}
          sort={(t) => t?.name}
          clickItem={({ data }) => updateNodeData(id, data)}
          cols={1}
          tooltip='Templates'
        >
          <Button square size='small' variant='outlined'> <Icon icon='template' /></Button>
        </InputDrop>
      </div>
      <div>
        <Input Icon={<Icon icon='title' />} placeholder='Label' tooltip='Label' value={label} onChange={(e) => updateNodeData(id, { label: e.target.value })} />
      </div>
      <div className={styles.PNM_item}>
        <Input Icon={<InputColor color={color} onChange={e => updateNodeData(id, { color: e })} />} placeholder='Color: #------' tooltip='color' value={color} onChange={e => updateNodeData(id, { color: e.target.value })} />
        <InputDrop
          id="icons"
          icon={<Icon className='panel_icon' icon={icon} />}
          listData={icons_names}
          listDisplay={e => <Icon icon={e} />}
          clickItem={(e) => updateNodeData(id, { icon: e })}
          cols='4'
          tooltip='Icon'
        >
          <Button square size='small' variant='outlined'> <Icon icon={icon} /></Button>
        </InputDrop>
      </div>

      <div className={styles.PNM_item}>
        <InputDrop
          id="types"
          icon={<Icon className='panel_icon' icon='code' />}
          value={codeType}
          listData={Object.values(data_codeTypes).map(e => e)}
          listDisplay={({ type, name }) => <div> {name}</div>}
          clickItem={(e) => updateNodeData(id, { codeType: e.type })}
          sort={({ name }) => name}
          cols={2}
          tooltip='Code type'
        >
          <Input Icon={<Icon icon='code' />} placeholder='Code type' tooltip='Code type' value={codeType} />
        </InputDrop>
        {/* <ButtonSwitch ItemOn={IconON} ItemOFF={IconOFF} value={visibleField.code} onClick={() => updateVisibleField(id, 'code')} /> */}
      </div>

    </Frame >
  );
};

export default PNMCode;