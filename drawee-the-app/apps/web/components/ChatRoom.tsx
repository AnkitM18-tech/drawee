import { HTTP_BACKEND_URL } from "../app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(id: number) {
  const response = await fetch(`${HTTP_BACKEND_URL}/room/chats/${id}`);
  const data = await response.json();
  return data.messages;
}

const ChatRoom = async ({ id }: { id: number }) => {
  const chats = await getChats(id);
  return <ChatRoomClient messages={chats} id={id}></ChatRoomClient>;
};

export default ChatRoom;
