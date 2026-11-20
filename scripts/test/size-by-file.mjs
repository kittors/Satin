import * as esbuild from "esbuild"; import path from "node:path"; import fs from "node:fs";
const ROOT = "/Users/kittors/Developer/opensource/Satin";
const code = process.argv[2];
const alias = { name: "alias", setup(b) { b.onResolve({ filter: /^\.\.?\// }, (a) => (a.importer.includes("packages/satin-ui") ? { path: path.resolve(path.dirname(a.importer), a.path), sideEffects: false } : undefined)); b.onResolve({ filter: /^satin-ui(\/.*)?$/ }, (a) => { const sub = a.path.slice(8) || "."; const pkg = JSON.parse(fs.readFileSync(ROOT + "/packages/satin-ui/package.json", "utf8")); let e = pkg.exports[sub === "." ? "." : "." + sub]; if (typeof e === "object") e = e.default; return { path: path.join(ROOT, "packages/satin-ui", e), sideEffects: false }; }); b.onResolve({ filter: /^(react|vue)/ }, (a) => ({ path: a.path, external: true })); } };
const r = await esbuild.build({ stdin: { contents: code, resolveDir: ROOT, loader: "js" }, bundle: true, minify: true, format: "esm", write: false, plugins: [alias], metafile: true, logLevel: "silent" });
const o = Object.values(r.metafile.outputs)[0];
for (const [f, v] of Object.entries(o.inputs).sort((a, b) => b[1].bytesInOutput - a[1].bytesInOutput)) if (v.bytesInOutput) console.log(String(v.bytesInOutput).padStart(7), path.basename(f));
