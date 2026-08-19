import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sampleInventory } from "./catalog";
import { SEED_VERSION } from "./types";
import type { InventoryItem } from "./types";

interface InventoryState {
  items: InventoryItem[];
  seedVersion: number;
  hydrated: boolean;
  setHydrated: () => void;
  replaceAll: (items: InventoryItem[]) => void;
  upsert: (item: InventoryItem) => void;
  remove: (id: string) => void;
  resetDemo: () => void;
}

export const useInventory = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      seedVersion: 0,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      replaceAll: (items) => set({ items }),
      upsert: (item) => {
        const items = get().items;
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx === -1) set({ items: [item, ...items] });
        else set({ items: items.map((i) => (i.id === item.id ? item : i)) });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      resetDemo: () => set({ items: sampleInventory(), seedVersion: SEED_VERSION }),
    }),
    {
      name: "sc-kbi-inventory",
      skipHydration: true,
      partialize: (s) => ({ items: s.items, seedVersion: s.seedVersion }),
    },
  ),
);

export function rehydrateInventory() {
  const result = useInventory.persist.rehydrate();
  void Promise.resolve(result).then(() => {
    const state = useInventory.getState();
    if (state.items.length === 0 || state.seedVersion !== SEED_VERSION) {
      state.resetDemo();
    }
    state.setHydrated();
  });
}
