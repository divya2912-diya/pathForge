import React from "react";
import { ArrowLeft } from "lucide-react";

export function HomeButton({ onClick }) {
  return (
    <button onClick={onClick} className="lp-glass-strong fixed top-5 left-[68px] z-50 h-11 px-4 rounded-xl flex items-center gap-2 text-sm cursor-pointer">
      <ArrowLeft size={16} /> <span className="hidden sm:inline">Home</span>
    </button>
  );
}

export default HomeButton;
