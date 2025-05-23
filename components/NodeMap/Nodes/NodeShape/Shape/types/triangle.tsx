import { type ShapeProps } from './_index';
import { generatePath } from '@/utils/generatePath';

function Triangle({ width, height, ...svgAttributes }: ShapeProps) {
  const trianglePath = generatePath([[0, height], [width / 2, 0], [width, height],]);
  return <path d={trianglePath} {...svgAttributes} />;
}

export default Triangle;
