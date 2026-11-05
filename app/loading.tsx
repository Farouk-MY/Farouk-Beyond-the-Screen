export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0C0A] text-[#FAF8F5] select-none">
      <div className="relative flex flex-col items-center gap-6 max-w-sm text-center px-4">
        {/* Custom FM Monogram Medallion */}
        <div className="relative w-16 h-16 rounded-full bg-[#1A120E] border border-[#D4AF37]/40 p-3.5 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex items-center justify-center animate-pulse">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <rect x="12" y="12" width="7" height="40" rx="1.5" fill="#FAF8F5" />
            <path
              d="M12 13.5C12 12.6716 12.6716 12 13.5 12H50.5C51.3284 12 52 12.6716 52 13.5V18.5C52 19.3284 51.3284 20 50.5 20H13.5C12.6716 20 12 19.3284 12 18.5V13.5Z"
              fill="#FAF8F5"
            />
            <rect x="12" y="28" width="18" height="6" rx="1.2" fill="#BA5227" />
            <path
              d="M30 19L36.5 36.5C36.8 37.3 37.9 37.3 38.2 36.5L44.5 19H50.5L40.2 46C39.5 47.8 36.9 47.8 36.2 46L27 21.5L30 19Z"
              fill="#FAF8F5"
            />
            <rect x="45" y="19" width="7" height="33" rx="1.5" fill="#FAF8F5" />
            <circle cx="37.5" cy="28" r="2.2" fill="#D4AF37" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-heading font-extrabold tracking-[0.24em] text-[#FAF8F5] uppercase">
            FAROUK MESSAI
          </span>
          <span className="text-[10px] font-mono tracking-[0.28em] text-[#E59368] uppercase font-medium">
            BEYOND THE SCREEN
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#A89D8F] uppercase mt-2">
            INITIALIZING STUDIO ENVIRONMENT...
          </span>
        </div>
      </div>
    </div>
  );
}
