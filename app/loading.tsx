export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0C0A] text-[#FAF8F5]">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#E8E2D8]/20 border-t-[#BA5227] animate-spin" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-heading font-bold tracking-widest text-[#FAF8F5] uppercase">
            FAROUK MESSAI
          </span>
          <span className="text-[10px] font-mono text-[#A89D8F]">
            Preparing cinematic video experience...
          </span>
        </div>
      </div>
    </div>
  );
}
