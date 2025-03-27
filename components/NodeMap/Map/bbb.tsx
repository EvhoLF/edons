import { useState, useEffect } from "react";
// import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { toPng } from "html-to-image";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "@xyflow/react";

export function DownloadFlow() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { getNodes } = useReactFlow();

  useEffect(() => {
    const nodesBounds = getRectOfNodes(getNodes());
    const imageWidth = nodesBounds.width + 200;
    const imageHeight = nodesBounds.height + 200;
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: '#ff00ff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: String(imageWidth),
        height: String(imageHeight),
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((dataUrl) => {
      setPreviewImage(dataUrl);
    });
  }, [getNodes]);

  function handleActualDownload() {
    if (previewImage) {
      downloadImage(previewImage, 'zxc');
    }
  }

  return <button onClick={handleActualDownload}>Download</button>;
}

function downloadImage(dataUrl: string, name?: string) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  const fileNamePrefix = name ? `${name}_` : "reactflow_";
  const fileName = `${fileNamePrefix}${dateStr}_${timeStr}.png`;

  const a = document.createElement("a");
  a.setAttribute("download", fileName);
  a.setAttribute("href", dataUrl);
  a.click();
}