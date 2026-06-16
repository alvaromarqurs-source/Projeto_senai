import * as React from "react";

type QuestionCardProps = {
  title: string;
  children: React.ReactNode;
};

export function QuestionCard({ title, children }: QuestionCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-100">
      <h3 className="text-sm font-bold leading-5 text-slate-950">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
