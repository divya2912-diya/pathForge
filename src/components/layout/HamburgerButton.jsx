import React from "react";
import { Menu } from "lucide-react";

export function HamburgerButton({ onClick }) {
  return (
    <button onClick={onClick} className="lp-glass-strong fixed top-5 left-5 z-50 w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer lg:hidden">
      <Menu size={19} />
    </button>
  );
}

export default HamburgerButton;
