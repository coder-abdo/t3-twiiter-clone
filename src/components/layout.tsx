import type { FC, PropsWithChildren } from "react";

export const PageLayout: FC<PropsWithChildren> = ({ children }) => (
  <main className="flex h-screen flex-col">{children}</main>
);
