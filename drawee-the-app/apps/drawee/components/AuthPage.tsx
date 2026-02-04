"use client";

import { useRef } from "react";
import { HTTP_BACKEND_URL } from "@/app/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage({
  title,
  subtitle,
  isSignup,
}: {
  title: string;
  subtitle: string;
  isSignup: boolean;
}) {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch(
        `${HTTP_BACKEND_URL}/auth/${isSignup ? "signup" : "signin"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: isSignup
            ? JSON.stringify({
                username: userNameRef.current?.value,
                password: passwordRef.current?.value,
                name: nameRef.current?.value,
              })
            : JSON.stringify({
                username: userNameRef.current?.value,
                password: passwordRef.current?.value,
              }),
        },
      );
      const data = await response.json();
      if (data.message) {
        if (data.token) localStorage.setItem("token", data.token);
        alert(data.message);
      }
      if (isSignup) {
        router.push("/signin");
      } else {
        router.push("/canvas");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center mt-20 text-zinc-950 dark:text-zinc-50">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg text-center font-semibold px-4">{subtitle}</p>
      </div>
      <div className="flex flex-col md:w-96 w-48 gap-5 my-10">
        {isSignup && (
          <input
            ref={nameRef}
            type="text"
            placeholder="e.g. John Doe"
            className="border-zinc-50 border rounded-md px-2 py-2 w-full focus:outline-none"
          />
        )}
        <input
          type="text"
          ref={userNameRef}
          placeholder="e.g. john.doe@email.com"
          className="border-zinc-50 border rounded-md px-2 py-2 w-full focus:outline-none"
        />
        <input
          type="password"
          ref={passwordRef}
          placeholder="e.g. minimum 6 characters password"
          className="border-zinc-50 border rounded-md px-2 py-2 w-full focus:outline-none"
        />
        <button
          onClick={handleClick}
          className="border border-zinc-950 dark:border-zinc-50 p-2 rounded-md cursor-pointer dark:hover:bg-zinc-50 dark:hover:text-zinc-950 hover:bg-zinc-950 hover:text-zinc-50"
        >
          {title}
        </button>
        <div className="text-center">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className="text-zinc-950 dark:text-zinc-50"
          >
            <span className="font-bold underline">
              {isSignup ? "Sign In" : "Sign up"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
