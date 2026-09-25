import React, { useState, useRef, useEffect } from "react";
import { Search, Route, LayoutGrid, Award, FolderKanban, BookOpen, Compass, ChevronRight, X, Sparkles, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { syncOfflineQueue } from "../../services/offlineSyncService";
import { getTranslation } from "../../services/i18nService";

export function TopBar({ title, onProfileClick, student, go }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("Online");
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("Syncing...");
      syncOfflineQueue((status) => setSyncStatus(status));
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const SEARCH_ITEMS = [
    { label: "Knowledge Assessment", cat: "Assessment", view: "assessment", icon: Award },
    { label: "Learning Roadmap", cat: "Roadmap", view: "roadmap", icon: Route },
    { label: "Learning Analytics", cat: "Analytics", view: "analytics", icon: Compass },
    { label: "Full Stack Developer", cat: "Careers", view: "career", icon: Compass },
    { label: "AI / ML Engineer", cat: "Careers", view: "career", icon: Compass },
    { label: "Software Engineer", cat: "Careers", view: "career", icon: Compass },
    { label: "Data Scientist", cat: "Careers", view: "career", icon: Compass },
    { label: "React & Component Architecture", cat: "Skills", view: "roadmap", icon: BookOpen },
    { label: "Python & Data Analysis", cat: "Skills", view: "roadmap", icon: BookOpen },
    { label: "Node.js & Backend APIs", cat: "Skills", view: "roadmap", icon: BookOpen },
    { label: "Databases & SQL Queries", cat: "Skills", view: "roadmap", icon: BookOpen },
    { label: "Docker & Containerization", cat: "Skills", view: "roadmap", icon: BookOpen },
    { label: "Certifications Catalog", cat: "Certifications", view: "certifications", icon: Award },
    { label: "Portfolio Projects", cat: "Projects", view: "projects", icon: FolderKanban },
    { label: "Learning Resources", cat: "Resources", view: "resources", icon: LayoutGrid },
  ];

  const results = query.trim()
    ? SEARCH_ITEMS.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) || 
        item.cat.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (view) => {
    if (go) go(view);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div
      className="flex items-center justify-between pl-20 sm:pl-24 pr-5 md:pr-8 py-5 sticky top-0 z-30"
      style={{ background: "rgba(6,9,17,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h1 className="lp-display text-lg font-semibold text-white flex items-center gap-3">
        {title}
      </h1>
      
      <div className="flex items-center gap-3">
        {/* Offline / Online Sync Indicator Badge */}
        <div 
          onClick={() => {
            if (isOnline) {
              setSyncStatus("Syncing...");
              syncOfflineQueue((st) => setSyncStatus(st));
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
            isOnline 
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20" 
              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
          }`}
          title={isOnline ? "Click to force sync offline queue" : "Offline mode — progress saved locally"}
        >
          {isOnline ? (
            <Wifi size={13} className="text-emerald-400" />
          ) : (
            <WifiOff size={13} className="text-amber-400" />
          )}
          <span>{syncStatus}</span>
        </div>

        {/* Global Search Container */}
        <div ref={searchRef} className="relative hidden sm:block">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.09] focus-within:border-cyan-500/50 focus-within:bg-white/[0.06] transition-all">
            <Search size={14} className="text-slate-400" />
            <input 
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search resources, skills, careers..." 
              className="bg-transparent text-xs outline-none w-52 text-slate-200 placeholder-slate-500" 
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-slate-500 hover:text-white cursor-pointer">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isOpen && results.length > 0 && (
            <div className="absolute right-0 top-12 w-80 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1.5">
                Search Results ({results.length})
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {results.map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(item.view)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <ItemIcon size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.label}</div>
                          <div className="text-[10px] text-slate-500">{item.cat}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={onProfileClick}
          aria-label="Open Profile"
          title={`${student?.name || "Profile"}`}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer hover:ring-2 hover:ring-cyan-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          style={{ background: student?.profilePicture ? "transparent" : (student?.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)"), color: "#04121a" }}
        >
          {student?.profilePicture ? (
            <img src={student.profilePicture} alt={student.name || "Profile"} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{student?.name ? student.name.slice(0, 2).toUpperCase() : "ME"}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
