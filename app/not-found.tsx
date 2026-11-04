import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07080B] text-[#F3F6FA] p-6 text-center">
      <div className="max-w-md p-8 rounded-2xl border border-[#1C222D] bg-[#0E1117]/90 backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono border border-[#FF9F43]/30 bg-[#FF9F43]/10 text-[#FF9F43] mb-4">
          404 — TRAJECTORY DRIFT
        </span>
        <h1 className="text-3xl font-extrabold text-[#F3F6FA] mb-2">Waypoint Not Found</h1>
        <p className="text-xs sm:text-sm text-[#8E9CAE] leading-relaxed mb-6">
          The requested path lies outside the five-act cinematic world coordinates. Return to the primary experience to
          resume traversal.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-[#00F2FE] text-[#07080B] hover:bg-[#38F9D7] transition-all"
        >
          Return to Sanctuary (Act I)
        </Link>
      </div>
    </div>
  );
}

