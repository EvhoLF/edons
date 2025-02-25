'use client'
import { ChangeEvent, memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import styles from './NodeTable.module.scss'
import { preventSelfLink } from '@/utils/Nodes/preventSelfLink';
import Button from '@/components/UI/Button/Button';
import { Icon } from '@/components/UI/Icon/Icon';
import useRF from '@/hooks/useRF';
import useNodeTransfer from '@/hooks/useNodeTransfer';
import clsx from 'clsx';

interface TableField { idx: number, isKey: boolean, name: string, type: string, }

interface NodeTable {
  id: string,
  data: { table: TableField[] },
  selected?: boolean
}

const NodeTable = ({ id, data }: NodeTable) => {

  const { updateNodeData } = useRF();

  const { getSourceData } = useNodeTransfer();

  // console.log(getSourceData());


  // const { label = '', table = [] } = data

  // const table = [
  //   {
  //     isKey: false,
  //     name: 'Id',
  //     type: 'string',
  //   },
  //   {
  //     isKey: false,
  //     name: 'Name',
  //     type: 'string',
  //   },
  //   {
  //     isKey: false,
  //     name: 'Age',
  //     type: 'string',
  //   }
  // ]

  const addTableField = () => {
    updateNodeData(id, (pre) => {
      console.log(pre);
      const table_nextIdx = pre.data.table_nextIdx as number;
      const newField = { idx: table_nextIdx, isKey: true, name: 'Field', type: 'string', }
      return { ...pre.data, table: [...pre.data.table as TableField[], newField], table_nextIdx: table_nextIdx + 1 }
    })
  }

  const changeField = (idx: number, field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, (pre) => {
      const table = pre.data.table as TableField[]
      return ({
        ...pre.data,
        table: table.map(item => item.idx === idx ? { ...item, [field]: e.target.value } : item)
      })
    })
  }

  // <Handle id={`${id}_${el_i}_t`}
  return (
    <>
      {/* <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      /> */}
      <NodeToolbar position={Position.Bottom}>
        <Button onClick={addTableField}><Icon icon='plus' /></Button>
      </NodeToolbar>
      <div className={styles.NodeTable}>
        <div className={styles.NodeTable_label}>Table</div>
        <div className={styles.NodeTable_body}>
          {
            data.table.map((el, el_i: number) => (
              <div key={`${id}_${el_i}`} className={styles.NodeTable_field}>
                <Handle id={`${el_i}_t`} className={`${styles.handle} ${styles.left}`} type="target" position={Position.Left} isValidConnection={preventSelfLink} isConnectable />
                <input type="text" className={clsx(styles.NodeTable_field_name, styles.NodeTable_field_props)} value={el.name} onChange={changeField(el.idx, 'name')} />
                <input type="text" className={clsx(styles.NodeTable_field_type, styles.NodeTable_field_props)} value={el.type} onChange={changeField(el.idx, 'type')} />
                <Handle id={`${el_i}_s`} className={`${styles.handle} ${styles.right}`} type="source" position={Position.Right} isValidConnection={preventSelfLink} isConnectable />
              </div>
            ))
          }
        </div>

      </div>
    </>
  );
};

export default memo(NodeTable);