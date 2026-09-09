import { Sparkles } from 'lucide-react';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce print:hidden">
      <div className="bg-linear-to-r from-[#EF2A82] to-[#F47340] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-[#F9D371]/40 flex items-center gap-2 backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-[#F9D371] animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}