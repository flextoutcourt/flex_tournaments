import tmi from 'tmi.js';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const BOT_USERNAME = process.env.TWITCH_BOT_USERNAME;
const CHANNEL = process.env.TWITCH_BOT_CHANNEL;
const OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN;

const prisma = new PrismaClient();

if (!BOT_USERNAME || !CHANNEL || !OAUTH_TOKEN) {
  console.error('Missing env vars for Twitch bot');
  process.exit(1);
}

// Store current tournament and items in memory
let currentTournament = null;
let currentItems = [];

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [CHANNEL],
});

client.connect().catch(err => {
  console.error('Failed to connect to Twitch:', err);
  process.exit(1);
});

client.on('message', async (channel, tags, message, self) => {
  if (self) return;

  const username = tags['display-name'];
  const msg = message.toLowerCase().trim();

  // Check if message matches any current item name (for voting)
  if (currentItems.length > 0) {
    const votedItem = currentItems.find(
      item => item.name.toLowerCase() === msg
    );

    if (votedItem && currentTournament) {
      try {
        // Record the vote
        await prisma.vote.create({
          data: {
            itemId: votedItem.id,
            tournamentId: currentTournament.id,
          },
        });

        console.log(`[Vote] ${username} voted for "${votedItem.name}"`);
        
        // Send chat confirmation (optional)
        client.say(CHANNEL, `@${username} voted for ${votedItem.name}! ✅`);
      } catch (error) {
        console.error('Error recording vote:', error);
      }
    }
  }
});

// Set current tournament for vote tracking (not currently used)
async function _setCurrentTournament(tournamentId) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { Items: true },
    });

    if (tournament) {
      currentTournament = tournament;
      currentItems = tournament.Items;
      
      const itemNames = tournament.Items.map(i => `"${i.name}"`).join(', ');
      console.log(`[Bot] Tournament LIVE: ${tournament.title}`);
      console.log(`[Bot] Vote by typing: ${itemNames}`);
      
      client.say(CHANNEL, `🎮 Tournament started: ${tournament.title} | Vote by typing: ${itemNames}`);
    }
  } catch (error) {
    console.error('Error setting tournament:', error);
  }
}

// Reset tournament (not currently used)
function _resetTournament() {
  currentTournament = null;
  currentItems = [];
  console.log('[Bot] Tournament reset');
}

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log('[Bot] Shutting down...');
  await prisma.$disconnect();
  client.disconnect();
  process.exit(0);
});

console.log('[Bot] Twitch bot is running and waiting for tournament...');
console.log('[Bot] Use API endpoint /api/bot/set-tournament to start a tournament');
