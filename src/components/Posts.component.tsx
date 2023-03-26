import Image from "next/image";
import { type FC } from "react";
import { type RouterOutputs } from "~/utils/api";
import { formatTime } from "~/utils/formatTime";

type Props = RouterOutputs["posts"]["getAll"][number];
export const PostsView: FC<Props> = ({ auhtor, post }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        className="h-14 w-14 rounded-full"
        src={auhtor.profileImageUrl}
        alt={auhtor?.username ?? ""}
        width={14}
        height={14}
      />
      <div className="flex flex-col">
        <h2 className="text-slate-300">
          <span className="pr-2">@{auhtor.username}</span>
          <span>. {formatTime(post.createdAt)}</span>
        </h2>
      </div>
      <p className="text-lg capitalize text-slate-100">{post.content}</p>
    </div>
  );
};
