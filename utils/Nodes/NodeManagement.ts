import { tNodeCode } from "@/data/NodeTemplates/tNodeCode";
import { tNodeShape } from "@/data/NodeTemplates/tNodeShape";
import { generateUniqueId } from "../generateUnique";

const getInitialData_Shape = (subType: string = 'rectangle') => ({
  width: 100, height: 100,
  data: {
    label: 'Shape',
    shapeType: subType,
    color: tNodeShape[subType as keyof typeof tNodeShape || 'rectangle'].data.color,
  }
});

const getInitialData_Code = () => ({
  data: {
    label: 'Node',
    color: tNodeCode.text.data.color,
    icon: tNodeCode.text.data.icon,
    codeType: tNodeCode.text.data.codeType,
    codeData: '',
    isClose: false
  }
});

const getInitialData_Table = () => ({
  data: {
    label: 'Table',
    table_nextIdx: 1,
    table: [
      {
        idx: 0,
        isKey: true,
        name: 'Id',
        type: 'num',
      },
    ]
  }
});


type GetNewNodeProps = {
  type: string,
  subType?: string,
  data_main?: object,
  data_sub?: object
}

export const GetNewNode = ({ type = '', subType = '', data_main = {}, data_sub = {} }: GetNewNodeProps) => {
  const init = {
    text: { data: { label: '', color: tNodeCode.text.data.color } },
    shape: getInitialData_Shape(subType),
    code: getInitialData_Code(),
    table: getInitialData_Table(),
  }[type] ?? { data: {} };

  const { data, ...node } = init;

  return {
    id: generateUniqueId(),
    type,
    position: { x: 0, y: 0 },
    ...node,
    ...data_main,
    data: {
      ...data,
      ...data_sub
    },
  }
};