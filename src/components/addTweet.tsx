import Image from "next/image";
import { type FormEvent, type ChangeEvent, type FC } from "react";

type Props = {
  imgSrc: string;
  val: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  isDisabled?: boolean;
};
export const AddTweet: FC<Props> = ({
  imgSrc,
  val,
  handleChange,
  handleSubmit,
  isDisabled,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start pl-4">
      <div className="flex items-center gap-2">
        <Image
          className="h-14 w-14 rounded-full"
          src={imgSrc}
          alt="user avatar"
          width={14}
          height={14}
          priority
        />
        <input
          type="text"
          value={val}
          onChange={handleChange}
          placeholder="what is happen?"
          className="rounded-sm border-none bg-transparent py-8 px-4 outline-none"
        />
      </div>
      <button
        className="mt-4 rounded-md bg-slate-200 py-2 px-4 text-sm text-black disabled:cursor-not-allowed"
        type="submit"
        disabled={isDisabled}
      >
        tweet
      </button>
    </form>
  );
};
