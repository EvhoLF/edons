import React from 'react';
import styles from '../PanelNodeManager.module.scss';
import InputDrop from '@/components/UI/InputDrop/InputDrop';
import Button from '@/components/UI/Button/Button';
import { Icon } from '@/components/UI/Icon/Icon';
import Input from '@/components/UI/Input/Input';
import InputColor from '@/components/UI/InputColor/InputColor';
import Frame from '@/components/UI/Frame/Frame';
import { tNodeCode } from '@/data/NodeTemplates/tNodeCode';
import useRF from '@/hooks/useRF';

const IconON = <Icon icon='eyeON' color='#eeeeff' />;
const IconOFF = <Icon icon='eyeOFF' color='#9999b4' />;

const PNMShape = ({ node }) => {
  const { id, data } = node;
  let { label, color, icon, codeType } = node.data;
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
          <Button> <Icon icon='template' /></Button>
        </InputDrop>
      </div>
      <div>
        <Input Icon={<Icon icon='title' />} placeholder='Label' tooltip='Label' value={label} onChange={(e) => updateNodeData(id, { label: e.target.value })} />
      </div>
      <div>
        <Input Icon={<InputColor color={color} onChange={e => updateNodeData(id, { color: e })} />} placeholder='Color: #------' tooltip='color' value={color} onChange={e => updateNodeData(id, { color: e.target.value })} />
      </div>
    </Frame >
  );
};

export default PNMShape;