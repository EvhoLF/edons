import { type ShapeProps } from './_index';
import { generatePath } from '@/utils/generatePath';

function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  const diamondPath = generatePath([[0, height / 2], [width / 2, 0], [width, height / 2], [width / 2, height],]);
  return <path d={diamondPath} {...svgAttributes} />;
}

export default Diamond;
