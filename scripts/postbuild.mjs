/**
 * Post-build: emit a 404 fallback that is the app itself.
 *
 * Vercel serves /404.html for any unmatched path. The site is deliberately a
 * single route (deep links are hash fragments, so they never reach the
 * server), but a mistyped or stale URL should still land on the film rather
 * than a platform error page.
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const index = path.join(dist, "index.html");

if (!fs.existsSync(index)) {
  console.error("404 fallback: dist/index.html is missing — did the build run?");
  process.exit(1);
}

fs.copyFileSync(index, path.join(dist, "404.html"));
console.log("404 fallback written: dist/404.html");