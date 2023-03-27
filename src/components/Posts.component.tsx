import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { type RouterOutputs } from "~/utils/api";
import { formatTime } from "~/utils/formatTime";

type Props = RouterOutputs["posts"]["getAll"][number];
export const PostsView: FC<Props> = ({ auhtor, post }) => {
  return (
    <div className="mt-4 flex items-center gap-2">
      <Image
        className="h-14 w-14 rounded-full"
        src={auhtor.profileImageUrl}
        alt={auhtor?.username ?? ""}
        width={14}
        height={14}
        priority
      />
      <div className="flex flex-col">
        <h2 className="text-slate-300">
          {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access*/}
          <Link href={`/@${auhtor.username}`}>
            <span className="pr-2">@{auhtor.username}</span>
          </Link>
          {/* fix format time using date type instead of string type */}
          <Link href={`/post/${post.id}`}>
            <span>. {formatTime(post.createdAt)}</span>
          </Link>
        </h2>
      </div>
      <p className="text-lg capitalize text-slate-100">{post.content}</p>
    </div>
  );
};
