const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/verify", async (req, res) => {
  const { githubUsername, sessionId } = req.body;

  if (!githubUsername || !sessionId)
    return res.json({ error: "Missing username or SESSION_ID." });

  if (!sessionId.startsWith("ARSL~"))
    return res.json({ error: "Invalid SESSION_ID format." });

  try {
    const repoUrl = `https://api.github.com/repos/${githubUsername}/Arslan_MD`;
    const response = await axios.get(repoUrl);

    if (response.status === 200) {
      const deploy_link = `https://render.com/deploy?repo=https://github.com/${githubUsername}/Arslan_MD&SESSION_ID=${sessionId}`;
      return res.json({ deploy_link });
    }
  } catch (e) {
    return res.json({ error: "GitHub repo not found or not public." });
  }
});

app.get("/", (req, res) => {
  res.send("Arslan Render Server Running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port", PORT));
