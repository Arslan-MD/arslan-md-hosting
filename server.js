import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import bodyParser from "body-parser";

const execPromise = util.promisify(exec);
const app = express();
app.use(bodyParser.json());

// __dirname setup (for ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static HTML
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/deploy", async (req, res) => {
  const { username, session_id } = req.body;

  if (!username || !session_id) {
    return res.status(400).json({ error: "❌ Missing username or session_id" });
  }

  const repo = `https://github.com/${username}/Arslan_MD.git`;
  const folder = `bot-${Date.now()}`;

  try {
    console.log(`📥 Cloning repo: ${repo}`);
    const { stdout, stderr } = await execPromise(`git clone ${repo} ${folder}`);
    console.log("✅ Clone Success:", stdout);
    if (stderr) console.warn("⚠️", stderr);

    const configPath = `${folder}/config.js`;
    let config = fs.readFileSync(configPath, "utf-8");
    config = config.replace(/SESSION_ID\s*=\s*['"`].*?['"`]/, `SESSION_ID = '${session_id}'`);
    fs.writeFileSync(configPath, config);
    console.log("🔑 SESSION_ID injected!");

    console.log("🚀 Starting bot...");
    exec(`cd ${folder} && npm install && node index.js`);

    return res.json({ success: true, message: "✅ Bot Deployed and Running!" });
  } catch (err) {
    console.error("❌ Error:", err.stderr || err.message);
    return res.status(500).json({ error: "Failed to deploy bot" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
