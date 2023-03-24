/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SignOutButton } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/api";
import Image from "next/image";
import { type FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: User | any;
};
export const LoginUser: FC<Props> = ({ user }) => {
  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <Image
        className="h-14 w-14 rounded-full"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        src={user.profileImageUrl}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        alt={user?.username ?? ""}
        width={14}
        height={14}
      />
      <SignOutButton />
    </div>
  );
};
