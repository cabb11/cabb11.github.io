import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default {
  // static HTML export for GitHub Pages
  output: "export",
  images: { unoptimized: true },
  turbopack: { root },
};
