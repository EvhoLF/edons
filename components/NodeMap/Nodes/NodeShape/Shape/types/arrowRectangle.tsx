import { generatePath } from '@/utils/generatePath';
import { type ShapeProps } from './_index';

function ArrowRectangle({ width, height, ...svgAttributes }: ShapeProps) {
  const skew = width * 0.1;
  const arrowRectanglePath = generatePath([[0, 0], [width - skew, 0], [width, height / 2], [width - skew, height], [0, height],]);
  return <path d={arrowRectanglePath} {...svgAttributes} />;
}

export default ArrowRectangle;
