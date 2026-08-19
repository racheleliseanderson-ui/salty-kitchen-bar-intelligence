import { APP_ID, PACKET_VERSION, type AvailabilityPacket, type InventoryItem, type UserIntent } from "./types";
import { urgencyLabel } from "./match";

const PROHIBITED = new Set([
  "guestNames",
  "emailAddresses",
  "medicalHistory",
  "exactAllergySafetyConclusion",
  "paymentData",
  "currentPriceGuarantees",
  "recipes",
  "generatedMenu",
  "nutrition",
  "pricing",
]);

export function buildPacket(
  items: InventoryItem[],
  opts?: { intent?: UserIntent; notes?: string[]; constraints?: string[]; stamp?: boolean },
): AvailabilityPacket {
  return {
    contract_version: PACKET_VERSION,
    timestamp: opts?.stamp === false ? "pending" : new Date().toISOString(),
    source: "KitchenBarLayer",
    application_id: APP_ID,
    user_intent: opts?.intent ?? "daily_inventory",
    available_ingredients: items.map((item) => ({
      normalized_name: item.normalizedName,
      quantity_hint: `${item.quantity.value} ${item.quantity.unit}`,
      expiry_urgency: urgencyLabel(item.expiry),
    })),
    hard_user_constraints: [...(opts?.constraints ?? [])],
    optional_notes: [...(opts?.notes ?? [])],
    handoff_id: opts?.stamp === false ? "preview" : crypto.randomUUID(),
  };
}

export function validatePacket(value: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, errors: ["Packet must be an object."] };
  }
  const p = value as Record<string, unknown>;
  if (p.contract_version !== PACKET_VERSION) errors.push("Unsupported contract_version.");
  if (p.source !== "KitchenBarLayer") errors.push("source must be KitchenBarLayer.");
  if (p.application_id !== APP_ID) errors.push("application_id must be SC-KBI-001.");
  if (!Array.isArray(p.available_ingredients)) errors.push("available_ingredients must be an array.");
  if (!Array.isArray(p.hard_user_constraints)) errors.push("hard_user_constraints must be an array.");
  if ("recipes" in p || "generatedMenu" in p) {
    errors.push("Packet must not include recipes or generated menus.");
  }
  const found: string[] = [];
  inspect(p, found);
  if (found.length) errors.push(`Prohibited fields: ${[...new Set(found)].join(", ")}.`);
  return { valid: errors.length === 0, errors };
}

function inspect(value: unknown, found: string[]) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (PROHIBITED.has(key)) found.push(key);
    if (child && typeof child === "object") inspect(child, found);
  }
}

export const CONTRACT_RULES = [
  "User must actively choose Send to Occasions. No silent inference.",
  "Packet contains availability and declared constraints only.",
  "Never include generated recipes, allergen guarantees, pricing, or nutrition claims.",
  "Occasions may refuse, simplify, or ignore the packet. Daily inventory and occasion planning stay independent.",
  "Reverse handoff, if ever needed, stays equally explicit.",
  "Local history only unless the user signs in and chooses to persist.",
];
