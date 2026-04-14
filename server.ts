import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  const DATA_FILE = path.join(process.cwd(), 'cases.json');

  app.get('/api/cases', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json({});
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  });

  app.post('/api/cases', (req, res) => {
    const newCase = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    data[newCase.id] = newCase.data;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  app.put('/api/cases/:id', (req, res) => {
    const { id } = req.params;
    const updatedCase = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    data[id] = updatedCase;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  app.delete('/api/cases/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    delete data[id];
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
