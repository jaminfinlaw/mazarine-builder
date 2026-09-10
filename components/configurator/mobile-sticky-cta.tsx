export function MobileStickyCTA({
  onRequestSummary,
}: {
  onRequestSummary: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-slate-200/10 bg-[#071726]/90 p-3 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={onRequestSummary}
        className="w-full rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold tracking-[0.2rem] text-slate-950 transition hover:bg-sky-300"
      >
        REQUEST MY CUSTOM BUILD
      </button>
    </div>
  );
}
