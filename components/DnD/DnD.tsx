import { useDnD } from '@/hooks/DnDProvider';
import React, { ReactNode } from 'react';

type DnDProps = {
  data: {
    type: string,
    nodeType?: string,
    nodeData?: {},
  },
  className: string,
  children: ReactNode,
}

const DnD = ({ data, className = '', children }: DnDProps) => {
  // eslint-disable-next-line no-unused-vars
  const [_, setDnD] = useDnD();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, event_data: {}) => {
    setDnD(event_data);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={className} onDragStart={(event) => onDragStart(event, data)} draggable>{children}</div>
  );
};

export default DnD;
