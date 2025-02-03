import { type ShapeProps } from './_index';

function Rectangle({ width, height, ...svgAttributes }: ShapeProps) {
  return <rect x={0} y={0} width={width} height={height} {...svgAttributes} />;
}

export default Rectangle;
