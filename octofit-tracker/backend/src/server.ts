import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const port = 8000;

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening at ${baseUrl}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit Tracker API:', error);
    process.exit(1);
  }
}

void startServer();