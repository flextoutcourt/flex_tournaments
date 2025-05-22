import tmi from 'tmi.js';
import dotenv from 'dotenv';
dotenv.config();

const BOT_USERNAME = process.env.TWITCH_BOT_USERNAME;
const CHANNEL = process.env.TWITCH_BOT_CHANNEL;
const OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN; // à récupérer via OAuth

if (!BOT_USERNAME || !CHANNEL || !OAUTH_TOKEN) {
  console.error('Missing env vars for Twitch bot');
  process.exit(1);
}

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [CHANNEL],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  console.log(`[Chat] ${tags['display-name']}: ${message}`);

  // Ici tu peux parse les votes par exemple
  // Par exemple si message === nomClip, on stocke le vote

  // Pour faire simple, on stocke en mémoire les votes dans un objet global
  // Idéalement tu connectes à ta DB / API pour stocker les votes et gérer le tournoi en live
});
