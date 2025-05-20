import { ReactNode } from "react";

export function BlockTitle({ children }: { children: ReactNode }) {
  return <div className="text-lg  text-sky-500 font-bold">{children}</div>;
}

export function Block({ children }: { children: ReactNode }) {
  return (
    <div className="p-2 rounded-lg border-border border flex flex-col gap-2">
      {children}
    </div>
  );
}
