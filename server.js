// server.js
import express from "express";
import bodyParser from "body-parser";
import { exec } from "child_process";
import util from "util";
import fs from "fs";
const execPromise = util.promisify(exec);

const app = express();
app.use(bodyParser.json());

app.post("/deploy", async (req, res) => {
  const { username, session_id } = req.body;

  if (!username || !session_id) {
    return res.status(400).json({ error: "Missing username or session_id" });
  }

  const repo = `https://github.com/${username}/Arslan_MD.git`;
  const folder = `bot-${Date.now()}`;

  try {
    if (fs.existsSync(folder)) {
      return res.status(400).json({ error: "Bot is already running" });
    }

    console.log(`📦 Cloning repo: ${repo}`);
    const { stdout, stderr } = await execPromise(`git clone ${repo} ${folder}`);
    console.log("✅ Cloned:", stdout);
    if (stderr) console.warn("⚠️ Clone warning:", stderr);

    // Inject session ID into config
    const configPath = `${folder}/config.js`;
    let config = fs.readFileSync(configPath, "utf-8");
    config = config.replace(/SESSION_ID\s*=\s*["'`].*?["'`]/, `SESSION_ID = '${session_id}'`);
    fs.writeFileSync(configPath, config);

    // Start bot
    console.log(`🚀 Starting bot for ${username}`);
    exec(`cd ${folder} && npm install && pm2 start index.js --name ${username}-bot`);

    return res.json({ success: true, message: "✅ Bot Deployed" });
  } catch (err) {
    console.error("❌ Deployment Error:", err.stderr || err.message);
    return res.status(500).json({ error: "Failed to clone bot repo" });
  }
});

app.get("/", (_, res) => {
  res.send("🚀 Arslan-MD Hosting Server Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🟢 Server listening on", PORT));
