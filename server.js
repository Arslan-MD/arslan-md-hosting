// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_OWNER_ID = process.env.RENDER_OWNER_ID; // Must be correct!

app.post("/deploy", async (req, res) => {
  const { username, session_id } = req.body;

  if (!username || !session_id) {
    return res.status(400).json({ error: "Missing username or session_id" });
  }

  try {
    const response = await axios.post(
      "https://api.render.com/v1/services",
      {
        name: `arslan-bot-${username}`,
        type: "web",
        repo: {
          url: `https://github.com/${username}/Arslan_MD`,
          branch: "main"
        },
        env: "node",
        buildCommand: "npm install",
        startCommand: "node index.js",
        plan: "starter",
        region: "oregon",
        envVars: [
          { key: "SESSION_ID", value: session_id },
          { key: "PORT", value: "10000" } // optional if needed
        ],
        autoDeploy: true,
        ownerId: RENDER_OWNER_ID
      },
      {
        headers: {
          Authorization: `Bearer ${RENDER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      message: "✅ Bot deployment started on Render!",
      service_id: response.data.id,
      dashboard_url: `https://dashboard.render.com/web/${response.data.id}`
    });
  } catch (err) {
    console.error("❌ Deployment error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to deploy bot",
      detail: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Render Deploy Server running on port ${PORT}`);
});
