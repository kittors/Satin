#!/usr/bin/env node
// satin 命令行：satin init / add / check / doctor / skill。用法见 satin --help
import { main } from "../src/cli.js";

main(process.argv.slice(2)).then((code) => { process.exitCode = code ?? 0; }, (e) => {
  console.error(`出错了：${e?.message || e}`);
  if (process.env.SATIN_DEBUG) console.error(e?.stack);
  process.exitCode = 1;
});
