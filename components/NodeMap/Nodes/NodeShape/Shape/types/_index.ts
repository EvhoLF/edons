import { SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

import Circle from './circle';
import RoundRectangle from './roundRectangle';
import Rectangle from './rectangle';
import Hexagon from './hexagon';
import Diamond from './diamond';
import ArrowRectangle from './arrowRectangle';
import Cylinder from './cylinder';
import Triangle from './triangle';
import Parallelogram from './parallelogram';
import Plus from './plus';

export type ShapeType = keyof typeof ShapeComponents;
export type ShapeProps = { width: number; height: number; } & SVGAttributes<SVGElement>;
export type ShapeComponentProps = Partial<ShapeProps> & { shapeType: ShapeType };
export type ShapeNode = Node<{ label: string, shapeType: ShapeType; color: string; }>;

export const ShapeComponents = {
  circle: Circle,
  roundRectangle: RoundRectangle,
  rectangle: Rectangle,
  hexagon: Hexagon,
  diamond: Diamond,
  arrowRectangle: ArrowRectangle,
  cylinder: Cylinder,
  triangle: Triangle,
  parallelogram: Parallelogram,
  plus: Plus,
};
