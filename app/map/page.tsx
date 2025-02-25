import Map from "@/components/NodeMap/Map/Map";
import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";

export default function Page() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ReactFlowProvider>
        <DnDProvider>
          <Map />
        </DnDProvider>
      </ReactFlowProvider>
    </>
  );
}
