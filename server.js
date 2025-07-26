const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// POST /verify
app.post("/verify", async (req, res) => {
  const { username, session } = req.body;

  if (!username || !session || !session.startsWith("ARSL~")) {
    return res.json({ message: "❌ Invalid input!" });
  }

  try {
    const repo = "Arslan-MD/Arslan_MD";
    const url = `https://api.github.com/repos/${username}/Arslan_MD`;

    const githubRes = await axios.get(url);
    if (githubRes.data?.fork === true && githubRes.data?.parent?.full_name === repo) {
      // Success
      return res.json({ message: `✅ Verified! Bot will be activated for @${username}.` });
    } else {
      return res.json({ message: "❌ Repo not forked properly!" });
    }
  } catch (err) {
    return res.json({ message: "❌ GitHub user or repo not found!" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
