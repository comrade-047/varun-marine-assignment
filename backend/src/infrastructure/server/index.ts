import 'dotenv/config';
import { createApp } from './app';

async function main() {
  const app = await createApp();
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});