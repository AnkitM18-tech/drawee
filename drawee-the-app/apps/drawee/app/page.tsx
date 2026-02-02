import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center mt-20 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center text-zinc-900 dark:text-zinc-50 gap-5">
        <h1 className="text-4xl font-bold ">Drawee</h1>
        <p className=" font-bold text-xl">
          Your one stop collaborative drawing tool.
        </p>
      </div>
      <div className="flex w-96 justify-between my-20 gap-20">
        <Link
          href="/signup"
          className="border text-center border-zinc-950 dark:border-zinc-50 p-2 rounded-md cursor-pointer dark:hover:bg-zinc-50 dark:hover:text-zinc-950 hover:bg-zinc-950 hover:text-zinc-50 w-full"
        >
          Sign Up
        </Link>
        <Link
          href="/signin"
          className="border text-center border-zinc-950 dark:border-zinc-50 p-2 rounded-md cursor-pointer dark:hover:bg-zinc-50 dark:hover:text-zinc-950 hover:bg-zinc-950 hover:text-zinc-50 w-full"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
