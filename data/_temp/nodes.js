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
  // {
  //   id: "3",
  //   position: { x: 300, y: 0 },
  //   type: "node",
  //   data: {
  //     node: {
  //       title: "Image.jpg",
  //       color: data_nodeTypesTemplate.images.color,
  //       icon: data_nodeTypesTemplate.images.icon,
  //       textHeader: "",
  //       text: "",
  //       image: true,
  //       code: { type: "none", data: "" },
  //       visibleField: { textHeader: false, text: false, image: true, code: false }
  //     }
  //   },
  // },
  // {
  //   id: 'sticker-89',
  //   position: { x: 1, y: 1 },
  //   type: "nodeSticker",
  //   data: {
  //     node: {
  //       text: 'zxc',
  //       color: '#eedd88',
  //       colorBG: '#eedd88'
  //     }
  //   },
  // },

  // {
  //   id: 'c1',
  //   position: { x: 1, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'rectangle', color: '#55ff55', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c3',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'circle', color: '#ff88aa', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c4',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'polygon', points:'3', color: '#cc55ff', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c5',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'polygon', points:'5', color: '#ee2222', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c6',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'polygon', points:'6', color: '#9fe06f', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c7',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'polygon', points:'7', color: '#f09050', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },
  // {
  //   id: 'c8',
  //   position: { x: 200, y: 1 },
  //   type: "nodeText",
  //   data: {
  //     node: {
  //       text: 'zxc', type: 'parallelogram',  color: '#f05f7f', colorBG: '#333344', border: '2',
  //     }
  //   },
  // },

];



export const initialEdges = [
  // { id: "e1-2", source: "0", target: "1", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.css.color } },
  // { id: "e1-3", source: "0", target: "2", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.js.color } },
  // { id: "e1-4", source: "0", target: "3", data: { colorS: data_nodeTypesTemplate.html.color, colorT: data_nodeTypesTemplate.images.color } },
];