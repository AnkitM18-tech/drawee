import RoomCanvas from "@/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: { roomId: number };
}) {
  const { roomId } = await params;
  return <RoomCanvas roomId={Number(roomId)} />;
}
