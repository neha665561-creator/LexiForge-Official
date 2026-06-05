// LocalStorage-backed history store. Intentionally framework-free so it can
// later be swapped for a Supabase-backed implementation without changing
// component code.

import type { OptimizationPayload } from "@/types/optimization";

const STORAGE_KEY = "lexiforge.history.v1";
const MAX_ENTRIES = 25;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadHistory(): OptimizationPayload[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OptimizationPayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistHistory(entries: OptimizationPayload[]): void {
  if (!isBrowser()) return;
  try {
    const trimmed = entries.slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage may be full or disabled — fail silently; history is non-critical.
  }
}
