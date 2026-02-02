import ChatRoom from "../../../components/ChatRoom";
import { HTTP_BACKEND_URL } from "../../config";

async function getRoom(slug: string) {
  const res = await fetch(`${HTTP_BACKEND_URL}/room/${slug}`);
  const data = await res.json();
  return data.room;
}

const ChatRoomPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const room = await getRoom(slug);
  return <ChatRoom id={room.id}></ChatRoom>;
};

export default ChatRoomPage;
