import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../services/i18nService";

const LANGUAGE_FLAGS = {
  en: "🇬🇧",
  te: "🇮🇳",
  hi: "🇮🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
};

export function LanguageSelector({ 
  currentLang = "en", 
  onLanguageChange, 
  direction = "down", // "down" or "up"
  align = "right"     // "right" or "left"
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const activeFlag = LANGUAGE_FLAGS[activeLangObj.code] || "🌐";

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setOpen(false);
    if (onLanguageChange && code !== currentLang) {
      onLanguageChange(code);
    }
  };

  const menuPosClass = direction === "up" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";

  const alignClass = align === "left" 
    ? "left-0" 
    : "right-0";

  return (
    <div ref={containerRef} className="relative inline-block text-left z-[999]">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm select-none ${
          open 
            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-cyan-500/20" 
            : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-cyan-500/40 text-slate-200"
        }`}
        title="Select Interface Language"
        aria-label="Language Selector"
      >
        <span className="text-sm">{activeFlag}</span>
        <span className="text-xs font-bold">{activeLangObj.name}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-cyan-300" : ""}`} />
      </button>

      {open && (
        <div 
          className={`absolute ${alignClass} ${menuPosClass} w-56 rounded-2xl bg-[#0c1322]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 p-2 z-[999] animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold text-cyan-300 uppercase tracking-wider border-b border-white/10 mb-1">
            <span className="flex items-center gap-1.5">
              <Globe size={12} /> Select Language
            </span>
            <span className="text-slate-400 font-mono text-[9px]">{SUPPORTED_LANGUAGES.length} Available</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              const flag = LANGUAGE_FLAGS[lang.code] || "🌐";

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm" 
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{flag}</span>
                    <span className="flex flex-col text-left">
                      <span>{lang.name}</span>
                      {lang.label !== lang.name && (
                        <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
                      )}
                    </span>
                  </span>
                  {isSelected && <Check size={14} className="text-cyan-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;

