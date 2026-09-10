export function ConfiguratorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/10 bg-[#0d2337]/80 p-4 shadow-[0_15px_35px_rgba(2,6,23,0.25)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs uppercase tracking-[0.18rem] text-slate-400">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
