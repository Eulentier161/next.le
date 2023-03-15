import clsx from "clsx";
import { useState } from "react";
import { api } from "~/utils/api";
import Keyboard from "./Keyboard";

const Game: React.FC = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [characterAttempts, setCharacterAttempts] = useState<{ char: string; validation: number }[][]>([]);
  const { data: getRandomWordId, refetch } = api.game.getRandomWordId.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const [gameResult, setGameResult] = useState<"win" | "lose" | "pending">("pending");
  const solutionMutation = api.game.getSolution.useMutation();

  const resetGame = () => {
    setCharacters([]);
    setAttempt(0);
    setCharacterAttempts([]);
    solutionMutation.reset();
    void refetch();
    setGameResult("pending");
  };

  if (!getRandomWordId) return <></>;

  return (
    <div className="container mx-auto w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
      <div className="grid grid-rows-6 gap-1">
        {[...Array(6).keys()].map((t) => (
          <div key={t} className="grid grid-cols-5 justify-around justify-items-center">
            {[...Array(5).keys()].map((n) => (
              <div
                key={n}
                className={clsx(
                  "flex h-12 w-12 items-center justify-center rounded border border-black text-xl font-bold",
                  attempt === t && gameResult === "pending" && "border-2",
                  attempt === t && characters.length === n && gameResult === "pending" && "border-fuchsia-500",
                  characterAttempts[t]?.[n]?.validation === 2
                    ? "bg-green-400"
                    : characterAttempts[t]?.[n]?.validation === 1
                    ? "bg-yellow-400"
                    : characterAttempts[t]?.[n]?.validation === 0
                    ? "bg-gray-400"
                    : null
                )}
              >
                {attempt === t ? characters[n]?.toUpperCase() : characterAttempts[t]?.[n]?.char?.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard
        disabled={Boolean(gameResult !== "pending")}
        randomWordId={getRandomWordId.id}
        characters={characters}
        setCharacters={setCharacters}
        setAttempt={setAttempt}
        setCharacterAttempts={setCharacterAttempts}
        setGameResult={setGameResult}
      />
      {gameResult !== "pending" ? `Result: ${gameResult}` : null}
      {gameResult === "lose" ? (
        <>
          <br />
          <p>Solution: {solutionMutation?.data ?? "*****"}</p>

          <button
            className="m-1 rounded border border-black p-1 hover:bg-slate-300"
            onClick={
              solutionMutation?.data
                ? () => solutionMutation.reset()
                : () => solutionMutation.mutateAsync({ winId: getRandomWordId.id }).then((r) => r)
            }
          >
            {solutionMutation?.data ? "Hide" : "Show"} Solution
          </button>
        </>
      ) : null}
      {gameResult !== "pending" ? (
        <>
          <br />
          <button className="m-1 rounded border border-black p-1 hover:bg-slate-300" onClick={resetGame}>
            New Game
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Game;
