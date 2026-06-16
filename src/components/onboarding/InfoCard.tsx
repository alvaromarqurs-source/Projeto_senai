import * as React from "react";

type InfoCardProps = {
  title?: string;
  children: React.ReactNode;
};

export function InfoCard({
  title = "Por que estamos perguntando isso?",
  children,
}: InfoCardProps) {
  return (
    <aside className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-indigo-700">
      <p className="text-sm font-bold text-indigo-900">{title}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </aside>
  );
}
