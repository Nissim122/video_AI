
import { register } from "esbuild-register/dist/node.js";
register({ format: "cjs", target: "node18" });
const mod = require("C:\\‏‏שולחן העבודה - עותק\\video_AI\\src\\videos\\30bachodesh\\config.ts");
const config = mod.VIDEO_CONFIG || mod.CONFIG || mod.default;
if (!config) { console.error("No VIDEO_CONFIG export found"); process.exit(1); }
process.stdout.write(JSON.stringify(config, null, 2));
