import clsx from "clsx";
import type { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction } from "react";
import { api } from "~/utils/api";
import { useEventListener } from "usehooks-ts";

interface Props {
  disabled: boolean;
  randomWordId: string;
  characters: string[];
  setCharacters: Dispatch<SetStateAction<string[]>>;
  setAttempt: Dispatch<SetStateAction<number>>;
  setCharacterAttempts: Dispatch<SetStateAction<{ char: string; validation: number }[][]>>;
  setGameResult: Dispatch<SetStateAction<"win" | "lose" | "pending">>;
}

const Keyboard: React.FC<Props> = ({
  disabled,
  randomWordId,
  characters,
  setCharacters,
  setAttempt,
  setCharacterAttempts,
  setGameResult,
}) => {
  const rowFull = characters.length >= 5;
  const validateWord = api.game.validateWord.useMutation();
  const validateCharacters = api.game.validateCharacters.useMutation();
  const increaseScoreMutation = api.game.increaseScore.useMutation();

  const appendChar = (char: string) => !disabled && setCharacters((chars) => [...chars, char]);

  const popChar = () =>
    setCharacters((chars) => {
      const c = [...chars];
      c.pop();
      return c;
    });

  const submitRow = () => {
    void validateWord.mutateAsync({ word: characters.join("") }).then((wordValidation) => {
      if (!wordValidation) return; // Not a valid word
      void validateCharacters.mutateAsync({ winId: randomWordId, guess: characters }).then((charValidation) => {
        setAttempt((attempt) => {
          setGameResult(() => {
            if (charValidation.map((v) => v.validation).reduce((acc, val) => acc + val) === 10) {
              void increaseScoreMutation.mutateAsync();
              return "win";
            } else if (attempt + 1 >= 6) return "lose";
            return "pending";
          });
          return attempt + 1;
        });
        setCharacterAttempts((chratts) => [...chratts, charValidation]);
        setCharacters([]);
      });
    });
  };

  useEventListener("keydown", ({ key }) => {
    if (/^[a-zA-Z]{1}$/.test(key) && !rowFull) appendChar(key.toLowerCase());
    if (key === "Backspace") popChar();
    if (key === "Enter") submitRow();
  });

  return (
    <>
      <div className="m-1 flex w-full justify-evenly">
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((chr) => (
          <Key
            disabled={rowFull}
            onClick={() => {
              setCharacters((chrs) => [...chrs, chr]);
            }}
            className="w-12"
            key={chr}
            chr={chr.toUpperCase()}
          />
        ))}
      </div>
      <div className="m-1 flex w-full justify-evenly">
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((chr) => (
          <Key disabled={rowFull} onClick={() => appendChar(chr)} className="w-12" key={chr} chr={chr.toUpperCase()} />
        ))}
      </div>
      <div className="m-1 flex w-full justify-evenly">
        <Key disabled={!rowFull} onClick={submitRow} className="w-16" chr="ENTER" />
        {["z", "x", "c", "v", "b", "n", "m"].map((chr) => (
          <Key disabled={rowFull} onClick={() => appendChar(chr)} className="w-12" key={chr} chr={chr.toUpperCase()} />
        ))}
        <Key
          className="w-16"
          onClick={popChar}
          //@ts-expect-error svg is not a string but w/e
          chr={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
              />
            </svg>
          }
        />
      </div>
    </>
  );
};
export default Keyboard;

const Key: React.FC<
  { chr: string } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ chr, className, ...props }) => {
  return (
    <button
      className={clsx(
        className,
        "m-1 flex h-10 cursor-pointer items-center justify-center rounded border border-black bg-slate-200 text-center hover:bg-slate-300"
      )}
      {...props}
    >
      {chr}
    </button>
  );
};
