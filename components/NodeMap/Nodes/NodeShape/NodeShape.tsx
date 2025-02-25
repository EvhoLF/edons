'use client'
import { NodeResizer, type NodeProps, useStore, Handle, Position, useKeyPress, } from '@xyflow/react';
import { ChangeEvent, memo, useEffect, useRef } from 'react';
import { ShapeNode } from './Shape/types/_index';
import Shape from './Shape';
import styles from './NodeShape.module.scss'
import useRF from '@/hooks/useRF';
import { preventSelfLink } from '@/utils/Nodes/preventSelfLink';

function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  return { width: node?.measured?.width || 0, height: node?.measured?.height || 0, };
}

function NodeShape({ id, selected = false, data }: NodeProps<ShapeNode>) {
  const { label, color, shapeType } = data;
  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress('Shift');
  const { updateNodeData } = useRF();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Указываем правильный тип

  useEffect(() => {
    const textarea: HTMLElement | null = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px"; // Сброс высоты
      textarea.style.height = textarea.scrollHeight + "px"; // Авто-расширение по высоте

      textarea.style.width = "auto"; // Сброс ширины
      textarea.style.width = textarea.scrollWidth + "px"; // Авто-расширение по ширине
    }
  }, [label]); // Пересчитываем высоту при изменении value

  const handleChangeLabel = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { label: e.target.value });
  }

  return (
    <>
      <NodeResizer color={color} keepAspectRatio={shiftKeyPressed} isVisible={selected} minWidth={50} minHeight={50} />
      <div className={styles.NodeShape}>
        <Shape shapeType={shapeType} width={width} height={height} fill={color} strokeWidth={2} stroke={color} fillOpacity={0.8} />
        {/* <div contentEditable onChange={handleChangeLabel} className={styles.NodeShape_label}>{label}</div> */}
        <textarea ref={textareaRef} className={styles.NodeShape_label} onChange={handleChangeLabel} value={label}></textarea>
      </div>
      <Handle isValidConnection={preventSelfLink} className={styles.handleStyleTop} id="top" type="source" position={Position.Top} />
      <Handle isValidConnection={preventSelfLink} className={styles.handleStyleBottom} id="bottom" type="source" position={Position.Bottom} />
      <Handle isValidConnection={preventSelfLink} className={styles.handleStyleLeft} id="left" type="source" position={Position.Left} />
      <Handle isValidConnection={preventSelfLink} className={styles.handleStyleRight} id="right" type="source" position={Position.Right} />
    </>
  );
}

export default memo(NodeShape);
