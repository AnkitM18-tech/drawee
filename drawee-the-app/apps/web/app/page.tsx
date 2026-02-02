"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomSlug, setRoomSlug] = useState("");
  const router = useRouter();
  return (
    <div className={styles.page}>
      <input
        className={styles.primary}
        type="text"
        placeholder="Room Slug"
        value={roomSlug}
        onChange={(e) => setRoomSlug(e.target.value)}
      />
      <button
        className={styles.secondary}
        onClick={() => {
          router.push("/room/" + roomSlug.toLowerCase().split(" ").join("-"));
        }}
      >
        Join Room
      </button>
    </div>
  );
}
