import { type ShapeProps } from './_index';
import { generatePath } from '@/utils/generatePath';

function Parallelogram({ width, height, ...svgAttributes }: ShapeProps) {
  const skew = width * 0.25;
  const parallelogramPath = generatePath([[0, height], [skew, 0], [width, 0], [width - skew, height],]);
  return <path d={parallelogramPath} {...svgAttributes} />;
}

export default Parallelogram;
