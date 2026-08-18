import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { InventoryItem } from "./types";

export const loadHousehold = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`
      select payload from kbi_inventories where user_id = ${context.userId}
    `;
    const raw = rows[0]?.payload;
    if (!raw) return [] as InventoryItem[];
    try {
      return JSON.parse(raw) as InventoryItem[];
    } catch {
      return [] as InventoryItem[];
    }
  });

export const saveHousehold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((items: InventoryItem[]) => items)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data);
    await sql`
      insert into kbi_inventories (user_id, payload, updated_at)
      values (${context.userId}, ${payload}, now())
      on conflict (user_id) do update
        set payload = excluded.payload, updated_at = now()
    `;
    return { ok: true as const };
  });
