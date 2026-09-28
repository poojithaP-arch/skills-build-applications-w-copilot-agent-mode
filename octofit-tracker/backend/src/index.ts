import 'dotenv/config';
import app from './app';
import { apiBaseUrl } from './config/api';
import { connectDatabase } from './config/database';

const port = 8000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening at ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit Tracker API:', error);
    process.exit(1);
  }
}

void startServer();