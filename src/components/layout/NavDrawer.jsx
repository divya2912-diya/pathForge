import React, { useState, useEffect } from "react";
import { Flame, X, LogIn, LogOut, Home, ChevronDown, ChevronRight } from "lucide-react";
import { NAV_GROUPS } from "../../data/mockData";
import { LanguageSelector } from "../ui/LanguageSelector";
import { getTranslation } from "../../services/i18nService";

export function NavDrawer({
  open,
  onClose,
  active,
  onNavigate,
  language = "en",
  onLanguageChange,
  student,
  onLogout
}) {
  // Helper to find parent group of active route
  const getParentGroupId = (activeId) => {
    for (const group of NAV_GROUPS) {
      if (group.items.some((item) => item.id === activeId)) {
        return group.id;
      }
    }
    return null;
  };

  // State for expanded groups
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const activeParent = getParentGroupId(active);
    return activeParent ? { [activeParent]: true } : { my_progress: true };
  });

  // Auto-expand active group when `active` route changes
  useEffect(() => {
    const parentId = getParentGroupId(active);
    if (parentId) {
      setExpandedGroups((prev) => ({
        ...prev,
        [parentId]: true
      }));
    }
  }, [active]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lp-fade-up cursor-pointer"
          style={{ animationDuration: ".25s" }}
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 w-72 lp-glass-strong flex flex-col transition-transform duration-300 shadow-2xl border-r border-white/10 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleItemClick("home")}
            title="Go to Home"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
            >
              <Flame size={18} color="#04121a" fill="#04121a" />
            </div>
            <span className="lp-display font-bold text-[16px] bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent">
              PathForge
            </span>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Content Area */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-4">
          
          {/* HOME ITEM */}
          <div>
            <button
              onClick={() => handleItemClick("home")}
              className={`lp-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all cursor-pointer ${
                active === "home" ? "active bg-cyan-500/20 text-white border-l-2 border-cyan-400 shadow-md shadow-cyan-500/10" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home size={17} className={`shrink-0 ${active === "home" ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{getTranslation("nav.home", language) !== "nav.home" ? getTranslation("nav.home", language) : "Home"}</span>
            </button>
          </div>

          {/* GROUPS */}
          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = !!expandedGroups[group.id];
            const hasActiveChild = group.items.some((item) => item.id === active);
            const groupTranslatedLabel = getTranslation(`nav.group_${group.id}`, language);
            const groupTitle = groupTranslatedLabel !== `nav.group_${group.id}` ? groupTranslatedLabel : group.label;

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Header Button */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer group ${
                    hasActiveChild ? "text-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon size={14} className={hasActiveChild ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"} />
                    <span>{groupTitle}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-400" />
                  )}
                </button>

                {/* Group Sub-items List */}
                {isExpanded && (
                  <div className="pl-3.5 ml-2 border-l border-white/10 space-y-1 pt-0.5">
                    {group.items.map(({ id, label, icon: ItemIcon }) => {
                      const isActive = active === id;
                      const itemLabelTranslated = getTranslation(`nav.${id}`, language);
                      const displayLabel = itemLabelTranslated !== `nav.${id}` ? itemLabelTranslated : label;

                      return (
                        <button
                          key={id}
                          onClick={() => handleItemClick(id)}
                          className={`lp-nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                            isActive
                              ? "active bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white font-bold border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <ItemIcon size={15} className={`shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                          <span className="truncate">{displayLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        </nav>

        {/* Footer Area: Language & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 overflow-visible">
          <div className="flex items-center justify-between overflow-visible">
            <span className="text-xs font-semibold text-slate-400">App Language:</span>
            <LanguageSelector currentLang={language} onLanguageChange={onLanguageChange} direction="up" />
          </div>

          {student ? (
            <button
              onClick={() => {
                if (onClose) onClose();
                if (onLogout) onLogout();
              }}
              className="lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer hover:bg-red-500/10 hover:text-red-400 text-rose-300 transition-colors"
            >
              <LogOut size={16} className="shrink-0 text-rose-400" />
              <span>{getTranslation("nav.logout", language) !== "nav.logout" ? getTranslation("nav.logout", language) : "Log Out"}</span>
            </button>
          ) : (
            <button
              onClick={() => handleItemClick("login")}
              className={`lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${
                active === "login" ? "active text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn size={16} className="shrink-0 text-cyan-400" />
              <span>{getTranslation("nav.login", language) !== "nav.login" ? getTranslation("nav.login", language) : "Sign In"}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default NavDrawer;
