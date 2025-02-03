'use client';
import { readFileAsText } from "../readFileAsText";
import { getExtensionId, getFileExtension, getImports } from "../getFileData";
import { tNodeCode } from "@/data/NodeTemplates/tNodeCode";

function createEdges(files) {
  const connections = [];
  const fileMap = new Map(files.map(file => [file.path, file]));

  files.forEach(file => {
    if (file.imports) {
      file.imports.forEach(importedFilePath => {
        // Attempt to find the imported file using the map
        const importedFile = fileMap.get(importedFilePath);

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

  console.log(fileMap);


  return connections;
}

export const ParseFileInNode = async (e) => {
  const files = [...e.target.files];
  const nodes = [];

  const promises = files.map(async (file, i) => {
    const id = Date.now() + "" + i;
    try {
      const data = await readFileAsText(file);

      const extension = getFileExtension(file.name);
      const template = tNodeCode[getExtensionId(extension)];

      const imports = await getImports(extension, data, file.webkitRelativePath);

      // Create node directly
      const node = {
        id,
        imports,
        fileName: file.name,
        path: file.webkitRelativePath,
        position: { x: i * 400, y: 0 },
        type: "node",
        data: {
          node: {
            title: file.name,
            color: template.color,
            icon: template.icon,
            textHeader: "",
            text: "",
            image: "",
            code: { type: template.codeType, data },
            visibleField: { textHeader: false, text: false, image: false, code: false, ...template.visibleField },
            property: {
              fileName: file.name,
              fileSize: file.size,
            },
          },
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
