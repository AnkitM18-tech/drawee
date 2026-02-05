import { HTTP_BACKEND_URL } from "@/app/config";

async function getExistingShapes(roomId: number) {
  const response = await fetch(`${HTTP_BACKEND_URL}/room/chats/${roomId}`, {
    headers: {
      authorization: localStorage.getItem("token") as string,
    },
  });
  const data = await response.json();
  const messages = data.messages;

  const shapes = messages.map(
    (x: { roomId: number; message: string; adminId: number; id: number }) => {
      const parsedMessage = JSON.parse(x.message);
      return parsedMessage;
    },
  );

  return shapes;
}

export { getExistingShapes };
