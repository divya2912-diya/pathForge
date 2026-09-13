import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 lp-fade-up">
      <div className="lp-glass-strong rounded-xl px-4 py-3 flex items-center gap-2 shadow-2xl">
        <CheckCircle2 size={18} color="#34d399" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
