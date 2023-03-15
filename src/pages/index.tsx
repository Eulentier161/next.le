import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Game from "~/components/game";

const Home: NextPage = () => {
  const session = useSession();

  if (session.status === "loading") return <>TODO: Loading Screen</>;
  if (!session.data)
    return (
      <>
        Please{" "}
        <Link className="underline" href="/signin">
          Sign in
        </Link>{" "}
        to play
      </>
    );

  return (
    <>
      <h1 className="my-10 text-center text-7xl underline">
        <a href="https://github.com/Eulentier161/next.le">Next.le</a>
      </h1>
      <Game />
    </>
  );
};

export default Home;
