"use client";

import { useRef } from "react";
import { HTTP_BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Canvas() {
  const router = useRouter();

  const handleCreateRoom = async () => {
    const roomName = roomRef.current?.value;
    const slug = roomName?.toLowerCase().split(" ").join("-");
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/room/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") as string,
        },
        body: JSON.stringify({ name: slug }),
      });

      if (response.ok) {
        try {
          const response = await fetch(`${HTTP_BACKEND_URL}/room/${slug}`, {
            headers: {
              authorization: localStorage.getItem("token") as string,
            },
          });
          const data = await response.json();
          const roomId = data.room.id;
          if (response.ok) router.push(`/canvas/${roomId}`);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoom = async () => {
    const slug = roomRef.current?.value?.toLowerCase().split(" ").join("-");
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/room/${slug}`, {
        headers: {
          authorization: localStorage.getItem("token") as string,
        },
      });
      const data = await response.json();
      const roomId = data.room.id;
      if (response.ok) router.push(`/canvas/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const roomRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-w-screen min-h-screen py-10 flex flex-col gap-20 dark:text-zinc-50 text-zinc-950">
      <h1 className="text-4xl font-bold text-center">Create or Join a Room</h1>
      <input
        ref={roomRef}
        type="text"
        placeholder="Room Name"
        className="px-4 py-2 border-zinc-50 border rounded-lg w-1/2 mx-auto"
      />
      <div className="flex gap-10 mx-auto">
        <button
          className="cursor-pointer outline px-2 py-4 rounded-lg dark:hover:text-zinc-950 dark:hover:bg-zinc-50 hover:bg-zinc-950"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
        <button
          className="cursor-pointer outline px-2 py-4 rounded-lg dark:hover:text-zinc-950 dark:hover:bg-zinc-50 hover:bg-zinc-950"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
