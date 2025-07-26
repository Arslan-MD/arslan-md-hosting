const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const BASE_REPO = "Arslan-MD/Arslan_MD";

app.post("/verify", async (req, res) => {
  const { githubUsername, sessionId } = req.body;
  if (!githubUsername || !sessionId)
    return res.status(400).json({ error: "Missing data" });

  // Check if user has forked
  const url = `https://api.github.com/repos/${githubUsername}/Arslan_MD`;
  try {
    await axios.get(url);

    const deployLink = `https://render.com/deploy?repo=https://github.com/${githubUsername}/Arslan_MD&env=SESSION_ID=${sessionId}`;

    return res.json({
      message: "✅ Repo verified!",
      deploy_link: deployLink
    });
  } catch (e) {
    return res.status(404).json({ error: "❌ Fork not found. Please fork first." });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
