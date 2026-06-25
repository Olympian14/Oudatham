"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface SuggestionInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  suggestions: string[];
  id?: string;
  textarea?: boolean;
  rows?: number;
}

export default function SuggestionInput({
  value, onChange, placeholder = "", className = "", suggestions = [], id, textarea = false, rows = 3,
}: SuggestionInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setFiltered(suggestions.slice(0, 8));
    } else {
      const query = value.toLowerCase().trim();
      setFiltered(suggestions.filter((item) => item.toLowerCase().includes(query)).slice(0, 8));
    }
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") setIsOpen(true);
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((prev) => (prev + 1) % filtered.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((prev) => (prev - 1 + filtered.length) % filtered.length); }
    else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) { e.preventDefault(); selectSuggestion(filtered[highlightedIndex]); }
      else setIsOpen(false);
    } else if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
  };

  const selectSuggestion = (val: string) => { onChange(val); setIsOpen(false); };

  const renderSuggestionText = (text: string) => {
    if (!value.trim()) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(value.toLowerCase().trim());
    if (index === -1) return <span>{text}</span>;
    const before = text.substring(0, index);
    const match = text.substring(index, index + value.trim().length);
    const after = text.substring(index + value.trim().length);
    return (<span>{before}<strong className="text-indigo-400 font-extrabold underline decoration-indigo-500/50 underline-offset-2">{match}</strong>{after}</span>);
  };

  return (
    <div ref={wrapperRef} className="relative w-full" id={id}>
      {textarea ? (
        <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown} placeholder={placeholder} rows={rows} className={className} />
      ) : (
        <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown} placeholder={placeholder} className={className} />
      )}
      <AnimatePresence>
        {isOpen && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.12 }} className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-md">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 border-b border-slate-100 dark:border-slate-900 mb-1 flex items-center justify-between">
              <span>Matching Suggestions</span>
              <span className="text-[9px] font-mono lowercase text-slate-400 dark:text-slate-600">↑↓ navigate</span>
            </div>
            <div className="space-y-0.5">
              {filtered.map((item, idx) => (
                <button key={idx} type="button" onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }} onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors duration-100 flex items-center justify-between ${highlightedIndex === idx ? "bg-indigo-600/15 border border-indigo-500/25 text-indigo-200" : "text-slate-700 dark:text-slate-300 border border-transparent hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"}`}>
                  <span className="truncate font-medium">{renderSuggestionText(item)}</span>
                  {highlightedIndex === idx && <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-bold px-1 py-0.5 rounded uppercase font-mono animate-pulse">Select</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
