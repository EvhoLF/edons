import { Edge, MarkerType } from "@xyflow/react";
import { tNodeCode } from "../NodeTemplates/tNodeCode";

const dataCode = {
  data_html: ``,
  data_css: ``,
  data_js: ``
}

export const initialNodes = [
  {
    id: "0",
    position: { x: 0, y: 0 },
    type: "code",
    data: {
      label: 'Index.html',
      color: tNodeCode.html.data.color,
      icon: tNodeCode.html.data.icon,
      codeType: "html",
      codeData: dataCode.data_html,
      isClose: false,
    },
  },
  {
    id: "2",
    position: { x: 0, y: 50 },
    type: "code",
    data: {
      label: 'Script.js',
      color: tNodeCode.js.data.color,
      icon: tNodeCode.js.data.icon,
      codeType: "js",
      codeData: dataCode.data_js,
      isClose: false,
    },
  },
];



export const initialEdges: Edge[] = [
  {
    id: "e1-2", type: 'straightEdge', style: { stroke: '#ff0', strokeWidth: '5px' }, source: "0", target: "2", label: 'zxc', markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  // { id: "e1-2", source: "0", target: "1", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.css.color } },
  // { id: "e1-3", source: "0", target: "2", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.js.color } },
  // { id: "e1-4", source: "0", target: "3", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.images.color } },
];