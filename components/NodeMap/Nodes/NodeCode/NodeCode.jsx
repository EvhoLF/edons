'use client'
import { Handle } from '@xyflow/react';
import styles from './NodeCode.module.scss'
import { Icon } from "@/components/UI/Icon/Icon";
import { memo, useContext } from 'react';
import CodePad from '@/components/CodePad/CodePad';
import useRF from '@/hooks/useRF';
import { NodesContext } from '../../Map/Map';

const initHandle = [
  { type: "target", position: "top" },
  { type: "source", position: "bottom" },
];

const handleFlipRule = { left: "top", top: "left", right: "bottom", bottom: "right" };

const NodeCode = ({ id, data }) => {

  const { orientation } = useContext(NodesContext);

  const { updateNodeData } = useRF();

  const handlerCodePadChange = (e) => {
    updateNodeData(id, { codeData: e });
  }

  let { isHorizontal, handles } = data;
  let { label, color, icon, codeType, codeData, isClose = '' } = data;

  // if (!isHorizontal) isHorizontal = false;
  if (!handles) handles = initHandle;

  const handles_items = handles.map((el, i) => {
    const origin = orientation == 'LR' ? handleFlipRule[el.position] : el.position;
    // const shadow = { left: '-1px 0px', top: '0px -1px', right: '1px 0px', bottom: '0px 1px' }[origin];
    return <Handle id={`${id}_${el.type}`} key={`${id}_${i}`} className={`${styles.handle} ${styles[origin]}`} style={{ background: color }} type={el.type} position={origin} />
  })

  return (
    <div className={styles.Node} style={{ borderColor: color }}>
      {isHorizontal && handles_items}
      <div className={styles.titleBlock}>
        <Icon className={styles.titleBlock_icon} icon={icon} color={color} />
        <div className={styles.titleBlock_title}>{label}</div>
      </div>
      <div className={styles.controls}>
        <div className={styles.controls_codeType}>
          {codeType}
        </div>
      </div>
      {!isHorizontal && handles_items}
    </div >
  );
};

// Кастомное сравнение пропсов
// const isNoEqual = (prevProps, nextProps) => {
//   // Сравниваем id и data
//   if (prevProps.id === nextProps.id) return false;
//   return true
// };

export default memo(NodeCode);

// export default NodeCode