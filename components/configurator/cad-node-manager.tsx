"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const cadCategories = ["Body", "Lid", "Inside Lid Panel", "AVC", "Front Sign", "Back Sign", "Inside Artwork", "Storage System", "Divider / Cooler Panels", "Teak Pop-Up Bar", "Hardware", "Always Visible", "Ignore", "Unknown"] as const;
export type CadCategory = (typeof cadCategories)[number];
export type CadNodeMapping = { friendlyName: string; category: CadCategory; defaultVisible: boolean };
export type CadNodeInfo = { id: string; originalName: string; type: string; childCount: number; parentPath: string; size: [number, number, number]; position: [number, number, number] };
export type CadNodeMappings = Record<string, CadNodeMapping>;

const storageKey = "mazarine-cad-node-map-v1";
const emptyMapping = (): CadNodeMapping => ({ friendlyName: "", category: "Unknown", defaultVisible: true });

export function getNodesByCategory(nodes: CadNodeInfo[], mappings: CadNodeMappings, category: CadCategory) {
  return nodes.filter((node) => (mappings[node.id] ?? emptyMapping()).category === category);
}

export function setCategoryVisibility(nodes: CadNodeInfo[], mappings: CadNodeMappings, category: CadCategory, visible: boolean) {
  return nodes.reduce<CadNodeMappings>((next, node) => (mappings[node.id] ?? emptyMapping()).category === category
    ? { ...next, [node.id]: { ...(mappings[node.id] ?? emptyMapping()), defaultVisible: visible } }
    : next, mappings);
}

export function CadNodeManager({ nodes, mappings, selectedId, onChange, onSelect }: { nodes: CadNodeInfo[]; mappings: CadNodeMappings; selectedId: string | null; onChange: (mappings: CadNodeMappings) => void; onSelect: (id: string | null) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "VISIBLE" | "HIDDEN" | "UNMAPPED">("ALL");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try { onChange(JSON.parse(saved) as CadNodeMappings); } catch { window.localStorage.removeItem(storageKey); }
  }, [onChange]);

  const update = (next: CadNodeMappings) => { window.localStorage.setItem(storageKey, JSON.stringify(next)); onChange(next); };
  const mappingFor = (node: CadNodeInfo) => mappings[node.id] ?? emptyMapping();
  const root = nodes.filter((node) => node.parentPath === "Node0");
  const childrenOf = (node: CadNodeInfo) => nodes.filter((candidate) => candidate.parentPath === node.id);
  const matches = (node: CadNodeInfo) => {
    const mapping = mappingFor(node);
    const haystack = `${node.originalName} ${mapping.friendlyName} ${mapping.category}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (filter === "VISIBLE") return mapping.defaultVisible;
    if (filter === "HIDDEN") return !mapping.defaultVisible;
    return filter !== "UNMAPPED" || !mapping.friendlyName && mapping.category === "Unknown";
  };
  const shownRoots = useMemo(() => root.filter(matches), [filter, mappings, nodes, query]);
  const toggleExpanded = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const showAll = () => update(nodes.reduce<CadNodeMappings>((next, node) => ({ ...next, [node.id]: { ...mappingFor(node), defaultVisible: true } }), {}));
  const reset = () => { window.localStorage.removeItem(storageKey); update({}); };
  const exportMapping = async () => { await navigator.clipboard.writeText(JSON.stringify(mappings, null, 2)); };
  const importMapping = (file: File) => { const reader = new FileReader(); reader.onload = () => { try { update(JSON.parse(String(reader.result)) as CadNodeMappings); } catch { /* Ignore invalid mapping files. */ } }; reader.readAsText(file); };

  const row = (node: CadNodeInfo, depth: number): React.ReactNode => {
    const mapping = mappingFor(node);
    const children = childrenOf(node);
    const isExpanded = expanded.has(node.id);
    return <div key={node.id} id={`cad-node-${node.id}`} className={`rounded border p-2 ${selectedId === node.id ? "border-sky-300 bg-sky-500/10" : "border-slate-800"}`} style={{ marginLeft: `${depth * 12}px` }}>
      <div className="flex items-center justify-between gap-2"><button type="button" onClick={() => children.length && toggleExpanded(node.id)} className="min-w-5 text-sky-300">{children.length ? isExpanded ? "-" : "+" : ""}</button><button type="button" onClick={() => onSelect(node.id)} className="flex-1 text-left font-medium text-sky-100">{node.originalName}</button><span>{node.type} | {children.length} children</span></div>
      <input value={mapping.friendlyName} onChange={(event) => update({ ...mappings, [node.id]: { ...mapping, friendlyName: event.target.value } })} placeholder="Friendly name" className="mt-1 w-full rounded bg-slate-900 px-2 py-1" />
      <div className="mt-1 flex gap-2"><label><input type="checkbox" checked={mapping.defaultVisible} onChange={(event) => update({ ...mappings, [node.id]: { ...mapping, defaultVisible: event.target.checked } })} /> Visible</label><select value={mapping.category} onChange={(event) => update({ ...mappings, [node.id]: { ...mapping, category: event.target.value as CadCategory } })} className="min-w-0 flex-1 rounded bg-slate-900 px-1">{cadCategories.map((category) => <option key={category}>{category}</option>)}</select><button type="button" onClick={() => { update(nodes.reduce<CadNodeMappings>((next, candidate) => ({ ...next, [candidate.id]: { ...mappingFor(candidate), defaultVisible: candidate.id === node.id } }), {})); onSelect(node.id); }} className="rounded bg-slate-800 px-2">SOLO</button><button type="button" onClick={() => onSelect(node.id)} className="rounded bg-sky-700 px-2 text-white">SELECT</button></div>
      <div className="mt-1 text-slate-500">{node.parentPath} | {node.size.map((value) => value.toFixed(1)).join(" x ")}</div>
      {isExpanded && children.map((child) => row(child, depth + 1))}
    </div>;
  };

  return <section className={`absolute bottom-3 right-3 z-20 overflow-auto rounded-lg border border-sky-300/30 bg-slate-950/95 text-xs text-slate-200 shadow-2xl ${isOpen ? "left-3 max-h-[48%] p-3 md:left-auto md:top-3 md:w-[420px] md:max-h-[calc(100%-1.5rem)]" : "p-2"}`}>
    <div className={`flex items-center justify-between gap-3 ${isOpen ? "mb-3" : ""}`}><strong className="tracking-[0.16rem] text-sky-200">NODE / MESH MANAGER</strong>{isOpen && <span>{nodes.length - 1} selectable nodes</span>}<button type="button" onClick={() => setIsOpen((open) => !open)} className="rounded bg-slate-800 px-2 py-1 text-sky-100">{isOpen ? "MINIMIZE" : "OPEN"}</button></div>
    {isOpen && <><p className="mb-2 text-sky-100">Expand Node1 to inspect, rename, and control its children.</p><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes, names, categories" className="mb-2 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5" /><div className="mb-2 flex flex-wrap gap-1">{(["ALL", "VISIBLE", "HIDDEN", "UNMAPPED"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded px-2 py-1 ${filter === item ? "bg-sky-300 text-slate-950" : "bg-slate-800"}`}>{item}</button>)}<button type="button" onClick={showAll} className="rounded bg-slate-800 px-2 py-1">SHOW ALL</button><button type="button" onClick={exportMapping} className="rounded bg-slate-800 px-2 py-1">EXPORT</button><button type="button" onClick={() => importRef.current?.click()} className="rounded bg-slate-800 px-2 py-1">IMPORT</button><button type="button" onClick={reset} className="rounded bg-rose-950 px-2 py-1">RESET MAPPINGS</button></div><input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importMapping(file); }} /><div className="space-y-2">{shownRoots.map((node) => row(node, 0))}</div></>}
  </section>;
}
