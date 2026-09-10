"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const cadCategories = ["Body", "Lid", "Inside Lid Panel", "AVC", "Front Sign", "Back Sign", "Inside Artwork", "Storage System", "Divider / Cooler Panels", "Teak Pop-Up Bar", "Hardware", "Always Visible", "Ignore", "Unknown"] as const;
export type CadCategory = (typeof cadCategories)[number];
export type CadNodeMapping = { friendlyName: string; category: CadCategory; defaultVisible: boolean };
export type CadNodeInfo = { id: string; originalName: string; type: string; childCount: number; parentPath: string; size: [number, number, number]; position: [number, number, number] };
export type CadNodeMappings = Record<string, CadNodeMapping>;

const storageKey = "mazarine-cad-node-map-v1";
const defaultMapping = (): CadNodeMapping => ({ friendlyName: "", category: "Unknown", defaultVisible: true });

export function getNodesByCategory(nodes: CadNodeInfo[], mappings: CadNodeMappings, category: CadCategory) {
  return nodes.filter((node) => (mappings[node.id] ?? defaultMapping()).category === category);
}

export function setCategoryVisibility(nodes: CadNodeInfo[], mappings: CadNodeMappings, category: CadCategory, visible: boolean) {
  return nodes.reduce<CadNodeMappings>((next, node) => {
    if ((mappings[node.id] ?? defaultMapping()).category !== category) return next;
    return { ...next, [node.id]: { ...(mappings[node.id] ?? defaultMapping()), defaultVisible: visible } };
  }, mappings);
}

export function CadNodeManager({ nodes, mappings, selectedId, onChange, onSelect }: { nodes: CadNodeInfo[]; mappings: CadNodeMappings; selectedId: string | null; onChange: (mappings: CadNodeMappings) => void; onSelect: (id: string | null) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "VISIBLE" | "HIDDEN" | "UNMAPPED">("ALL");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try { onChange(JSON.parse(saved) as CadNodeMappings); } catch { window.localStorage.removeItem(storageKey); }
  }, [onChange]);

  const update = (next: CadNodeMappings) => { window.localStorage.setItem(storageKey, JSON.stringify(next)); onChange(next); };
  const visible = (node: CadNodeInfo) => (mappings[node.id] ?? defaultMapping()).defaultVisible;
  const filtered = useMemo(() => nodes.filter((node) => {
    const item = mappings[node.id] ?? defaultMapping();
    const term = `${node.originalName} ${item.friendlyName} ${item.category}`.toLowerCase();
    if (query && !term.includes(query.toLowerCase())) return false;
    if (filter === "VISIBLE") return item.defaultVisible;
    if (filter === "HIDDEN") return !item.defaultVisible;
    return filter !== "UNMAPPED" || !item.friendlyName && item.category === "Unknown";
  }), [filter, mappings, nodes, query]);

  const exportMapping = async () => { await navigator.clipboard.writeText(JSON.stringify(mappings, null, 2)); };
  const importMapping = (file: File) => { const reader = new FileReader(); reader.onload = () => { try { update(JSON.parse(String(reader.result)) as CadNodeMappings); } catch { /* Invalid files are ignored. */ } }; reader.readAsText(file); };
  const selected = nodes.find((node) => node.id === selectedId);

  return <section className="absolute bottom-3 left-3 right-3 z-20 max-h-[48%] overflow-auto rounded-lg border border-sky-300/30 bg-slate-950/95 p-3 text-xs text-slate-200 shadow-2xl md:left-auto md:right-3 md:top-3 md:w-[420px] md:max-h-[calc(100%-1.5rem)]">
    <div className="mb-3 flex items-center justify-between"><strong className="tracking-[0.16rem] text-sky-200">NODE / MESH MANAGER</strong><span>{nodes.length} nodes</span></div>
    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes, names, categories" className="mb-2 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5" />
    <div className="mb-2 flex flex-wrap gap-1">{(["ALL", "VISIBLE", "HIDDEN", "UNMAPPED"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded px-2 py-1 ${filter === item ? "bg-sky-300 text-slate-950" : "bg-slate-800"}`}>{item}</button>)}<button type="button" onClick={() => update(nodes.reduce<CadNodeMappings>((next, node) => ({ ...next, [node.id]: { ...(mappings[node.id] ?? defaultMapping()), defaultVisible: true } }), {}))} className="rounded bg-slate-800 px-2 py-1">SHOW ALL</button><button type="button" onClick={exportMapping} className="rounded bg-slate-800 px-2 py-1">EXPORT</button><button type="button" onClick={() => importRef.current?.click()} className="rounded bg-slate-800 px-2 py-1">IMPORT</button><button type="button" onClick={() => { window.localStorage.removeItem(storageKey); update({}); }} className="rounded bg-rose-950 px-2 py-1">RESET MAPPINGS</button></div>
    <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importMapping(file); }} />
    {selected && <div className="mb-2 rounded border border-sky-300/30 p-2 text-sky-100">Selected: {selected.originalName} | {selected.parentPath} | size {selected.size.map((value) => value.toFixed(2)).join(" x ")}</div>}
    <div className="space-y-2">{filtered.map((node) => { const item = mappings[node.id] ?? defaultMapping(); return <div id={`cad-node-${node.id}`} key={node.id} className={`rounded border p-2 ${selectedId === node.id ? "border-sky-300 bg-sky-500/10" : "border-slate-800"}`}><div className="flex justify-between gap-2"><button type="button" onClick={() => onSelect(node.id)} className="font-medium text-sky-100">{node.originalName}</button><span>{node.type} | {node.childCount} children</span></div><input value={item.friendlyName} onChange={(event) => update({ ...mappings, [node.id]: { ...item, friendlyName: event.target.value } })} placeholder="Friendly name" className="mt-1 w-full rounded bg-slate-900 px-2 py-1" /><div className="mt-1 flex gap-2"><label><input type="checkbox" checked={visible(node)} onChange={(event) => update({ ...mappings, [node.id]: { ...item, defaultVisible: event.target.checked } })} /> Visible</label><select value={item.category} onChange={(event) => update({ ...mappings, [node.id]: { ...item, category: event.target.value as CadCategory } })} className="min-w-0 flex-1 rounded bg-slate-900 px-1">{cadCategories.map((category) => <option key={category}>{category}</option>)}</select><button type="button" onClick={() => { const solo = nodes.reduce<CadNodeMappings>((next, candidate) => ({ ...next, [candidate.id]: { ...(mappings[candidate.id] ?? defaultMapping()), defaultVisible: candidate.id === node.id } }), {}); update(solo); onSelect(node.id); }} className="rounded bg-slate-800 px-2">SOLO</button><button type="button" onClick={() => onSelect(node.id)} className="rounded bg-slate-800 px-2">HIGHLIGHT</button></div><div className="mt-1 text-slate-500">{node.parentPath} | {node.size.map((value) => value.toFixed(1)).join(" x ")}</div></div>; })}</div>
  </section>;
}
