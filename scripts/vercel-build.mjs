/**
 * Explicit Vercel build entry — avoids bare `vite` on PATH (exit 127).
 * Then applies migrations when DATABASE_URL is present.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const migrateBin = path.join(root, "scripts", "migrate.mjs");

if (!existsSync(viteBin)) {
  console.error(
    "[vercel-build] vite missing at",
    viteBin,
    "\nRun `npm ci` first. Ensure package.json lists vite.",
  );
  process.exit(127);
}

console.log("[vercel-build] using", viteBin);
const build = spawnSync(process.execPath, [viteBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if ((build.status ?? 1) !== 0) {
  process.exit(build.status ?? 1);
}

if (existsSync(migrateBin)) {
  console.log("[vercel-build] migrate");
  const migrate = spawnSync(process.execPath, [migrateBin], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  process.exit(migrate.status ?? 1);
}

process.exit(0);
