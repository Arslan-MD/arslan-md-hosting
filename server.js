const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve index.html from root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission
app.get("/verify", (req, res) => {
  const { user, session } = req.query;

  if (!user || !session) {
    return res.status(400).send("❌ GitHub username or session ID missing!");
  }

  // You can expand this logic to call GitHub API, clone repo, etc.
  return res.send(`✅ Hello ${user}! Your session ID (${session}) is valid. Proceeding to setup...`);
});

app.listen(PORT, () => {
  console.log(`✅ Arslan Render Server Running on port ${PORT}`);
});
