import { type FC } from "react";
import { type RouterOutputs } from "~/utils/api";

type Props = RouterOutputs["posts"]["getAll"][number];
export const PostsView: FC<Props> = ({ auhtor, post }) => {
  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-14 w-14 rounded-full"
        src={auhtor.profileImageUrl}
        alt={auhtor?.username ?? ""}
      />
      <p className="text-lg capitalize text-slate-100">{post.content}</p>
    </div>
  );
};
