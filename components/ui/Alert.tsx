import type { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
};

export function AlertError({ children }: AlertProps) {
  return <p className="app-alert-error mt-3">{children}</p>;
}
