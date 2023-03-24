import Image from "next/image";
import { type FC } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type RouterOutputs } from "~/utils/api";

type Props = RouterOutputs["posts"]["getAll"][number];
export const PostsView: FC<Props> = ({ auhtor, post }) => {
  dayjs.extend(relativeTime);
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
          <span>. {dayjs(post.createdAt).fromNow()}</span>
        </h2>
      </div>
      <p className="text-lg capitalize text-slate-100">{post.content}</p>
    </div>
  );
};
