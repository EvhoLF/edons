import { type MiniMapNodeProps, useInternalNode } from '@xyflow/react';
import { ShapeComponents, ShapeNode } from '../Nodes/NodeShape/Shape/types/_index';

function MiniMapNode({ id, width, height, x, y, selected }: MiniMapNodeProps) {
  const internalNode = useInternalNode<ShapeNode>(id);

  if (!internalNode) return null;

  let color_stroke = internalNode.internals.userNode.data?.color ?? '#eeeeff';
  let color_fill = '#222233';
  let shapeType: keyof typeof ShapeComponents = 'roundRectangle'; // Указываем, что это ключ из ShapeComponents

  if (internalNode.internals.userNode.type === 'shape') {
    const { color, shapeType: internalShapeType } = internalNode.internals.userNode.data;
    if (internalShapeType in ShapeComponents) {
      shapeType = internalShapeType as keyof typeof ShapeComponents;
      color_fill = color;
    }
  }

  const ShapeComponent = ShapeComponents[shapeType];

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={selected ? 'react-flow__minimap-node selected' : 'react-flow__minimap-node'}
    >
      <ShapeComponent
        width={width}
        height={height}
        fill={color_fill}
        stroke={color_stroke}
        strokeWidth={8}
        fillOpacity={0.8}
      />
    </g>
  );
}

export default MiniMapNode;
