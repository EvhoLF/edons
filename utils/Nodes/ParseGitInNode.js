'use client';
// import { data_nodeTypesTemplate } from "@/data/data_nodeTypesTemplate";
import { readFileAsText } from "../readFileAsText";
import { getExtensionId, getFileExtension, getImports } from "../getFileData";
import { tNodeCode } from "@/data/NodeTemplates/tNodeCode";

function createEdges(files = []) {
  const connections = [];
  const file_ids = []
  files.forEach((file, id) => { file_ids.push([file.path, id], [file.path.replace(/\.[^/.]+$/, ""), id]) })
  const fileMap = new Map(file_ids);
  console.log(fileMap);

  files.forEach(file => {
    if (file.imports) {
      file.imports.forEach(importedFilePath => {
        // Attempt to find the imported file using the map
        const importedFile = files[fileMap.get(importedFilePath)];

        if (importedFile) {
          connections.push({
            id: `p(${file.id}-${importedFile.id})`,
            source: file.id,
            target: importedFile.id,
          });
        }
      });
    }
  });

  // console.log(fileMap);
  return connections;
}

export const ParseGitInNode = async (files) => {
  const nodes = [];

  const promises = files.filter(e => e.type == 'blob').map(async (file, i) => {
    console.log(i);

    const id = Date.now() + "" + i;
    try {
      const data = file.data;
      const extension = getFileExtension(file.fileName);
      const template = tNodeCode[getExtensionId(extension)];

      const imports = await getImports(extension, data, file.path);

      console.log(template);


      // Create node directly
      const node = {
        id,
        imports,
        fileName: file.fileName,
        path: file.path,
        position: { x: i * 400, y: 0 },
        type: "code",
        data: {
          label: file.fileName ?? 'Code',
          color: template.data.color,
          icon: template.data.icon,
          codeType: template.data.codeType,
          codeData: data ?? '',
          isClose: true
          // node: {
          //   title: file.fileName,
          //   color: template.color,
          //   icon: template.icon,
          //   textHeader: "",
          //   text: "",
          //   image: "",
          //   code: { type: template.codeType, data },
          //   visibleField: { textHeader: false, text: false, image: false, code: false, ...template.visibleField },
          //   property: {
          //     fileName: file.path,
          //     fileSize: file.size,
          //   },
          // },
        },
      };

      nodes.push(node); // Push the node directly to nodes array
      return node; // Return the node for results
    } catch (error) {
      return null; // Return null on error
    }
  });

  // Await all promises
  const results = await Promise.all(promises);

  const newNodes = results.filter(result => result !== null);

  // Create edges based on imports
  const newEdges = createEdges(newNodes);

  console.log(newNodes);
  console.log(newEdges);

  return { newNodes, newEdges };
};
