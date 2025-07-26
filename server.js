// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/deploy', (req, res) => {
  const sessionId = req.body.session;

  if (!sessionId.startsWith("ARSL~")) {
    return res.send("❌ Invalid SESSION_ID format. Must start with ARSL~");
  }

  const appName = `arslan-md-${Date.now()}`;
  const herokuApp = `https://dashboard.heroku.com/new?template=https://github.com/ArslanMD/Arslan_MD/&env[SESSION_ID]=${encodeURIComponent(sessionId)}&env[APP_NAME]=${appName}`;

  res.redirect(herokuApp);
});

app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
