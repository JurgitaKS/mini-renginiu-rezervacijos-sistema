import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="app-card">
      <h1 className="page-title">{title}</h1>
      {children}
    </div>
  );
}
