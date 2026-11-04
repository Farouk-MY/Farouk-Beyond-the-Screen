export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080B] text-[#F3F6FA]">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#1C222D] border-t-[#00F2FE] animate-spin" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-[#F3F6FA] uppercase">
            FAROUK — BEYOND THE SCREEN
          </span>
          <span className="text-[10px] font-mono text-[#8E9CAE]">
            Initializing 3D viewport and neural spline...
          </span>
        </div>
      </div>
    </div>
  );
}

