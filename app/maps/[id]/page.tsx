import Map from "@/components/NodeMap/Map/Map";
import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import { MapGetById } from "@/DB/services/MapService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { IMap } from "@/DB/models/Map";

export async function generateMetadata({ params }) {
  const { id } = await params
  if (!id) return { title: 'EDONs' }
  const map = await MapGetById(id);
  return !map ? { title: 'EDONs' } : { title: `${map?.label} - EDONs` };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id: mapId } = await params
  const session = await getServerSession(authOptions);

  if (!mapId || !session || !session.user) return redirect("/maps/");

  const map: IMap | undefined = await MapGetById(mapId);

  if (!map || (map.userId.toString() !== session?.user?.id && !map.isPublicAccess)) return redirect("/maps/");

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{map.label}</title>
      </Head>
      <ReactFlowProvider>
        <DnDProvider>
          <Map mapId={mapId} mapLabel={map.label} isPublicAccess={map.isPublicAccess}/>
        </DnDProvider>
      </ReactFlowProvider>
    </>
  );
}
