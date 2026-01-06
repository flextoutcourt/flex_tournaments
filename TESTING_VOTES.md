# Vote Tracking System - Testing Guide

## Prerequisites
1. ✅ Migration run: `yarn prisma migrate dev --name add_vote_model`
2. ✅ Twitch bot credentials in `.env`:
   - TWITCH_BOT_USERNAME
   - TWITCH_BOT_CHANNEL
   - TWITCH_OAUTH_TOKEN
3. Database connection working

## Test Flow

### Step 1: Start the Bot
```bash
node src/bot.js
```

Expected output:
```
[Bot] Twitch bot is running and waiting for tournament...
[Bot] Use API endpoint /api/bot/set-tournament to start a tournament
```

### Step 2: Create a Tournament
In your admin panel or via API:
1. Create a tournament with items like: "Pokemon", "Digimon", "Yo-kai Watch"
2. Copy the tournament ID

### Step 3: Activate Tournament (Start Tracking Votes)
Use cURL or Postman:
```bash
curl -X POST http://localhost:3000/api/bot/set-tournament \
  -H "Content-Type: application/json" \
  -d '{"tournamentId":"YOUR_TOURNAMENT_ID"}'
```

Expected response:
```json
{
  "success": true,
  "tournament": {
    "id": "...",
    "title": "Your Tournament",
    "items": [
      { "id": "...", "name": "Pokemon" },
      { "id": "...", "name": "Digimon" },
      { "id": "...", "name": "Yo-kai Watch" }
    ]
  }
}
```

Bot console should show:
```
[Bot] Tournament LIVE: Your Tournament
[Bot] Vote by typing: "Pokemon", "Digimon", "Yo-kai Watch"
```

### Step 4: Test Votes in Twitch Chat
Go to your Twitch channel chat and type item names:
- Type: `pokemon` → Should record a vote and show: `@username voted for Pokemon! ✅`
- Type: `digimon` → Should record a vote
- Type: `random text` → Should be ignored

Bot console shows:
```
[Vote] Username voted for "Pokemon"
[Vote] AnotherUser voted for "Digimon"
```

### Step 5: Check Vote Stats
```bash
curl http://localhost:3000/api/bot/votes/YOUR_TOURNAMENT_ID
```

Expected response:
```json
{
  "tournamentId": "...",
  "totalVotes": 2,
  "itemVotes": [
    { "itemId": "...", "itemName": "Pokemon", "votes": 1 },
    { "itemId": "...", "itemName": "Digimon", "votes": 1 },
    { "itemId": "...", "itemName": "Yo-kai Watch", "votes": 0 }
  ]
}
```

### Step 6: Check Home Page Stats
Visit `http://localhost:3000/` and the vote count should update (currently shows total ever, not per-day).

## Troubleshooting

### Bot doesn't connect
- Check Twitch credentials in `.env`
- Verify OAUTH_TOKEN is valid (get from https://twitchapps.com/tmi/)
- Check channel name format (should be lowercase)

### Votes not recording
- Check database connection
- Verify tournament ID is correct
- Check item names match exactly (case-insensitive in chat)
- Check bot output for errors

### API endpoints not working
- Verify `yarn build` completes successfully
- Check `/api/stats` first (simpler test)
- Verify Prisma client is initialized correctly

## Database Queries (Direct Testing)
Connect to database and run:
```sql
-- Count all votes
SELECT COUNT(*) FROM "Vote";

-- Get votes by tournament
SELECT "tournamentId", COUNT(*) as votes FROM "Vote" GROUP BY "tournamentId";

-- Get votes by item
SELECT i."name", COUNT(v."id") as votes 
FROM "Vote" v 
JOIN "Item" i ON v."itemId" = i."id"
GROUP BY i."name"
ORDER BY votes DESC;
```

## Notes
- Voting is case-insensitive (type "pokemon", "POKEMON", "Pokemon" all work)
- Each user can vote multiple times (no rate limiting yet)
- Votes persist in database permanently
- Home page shows cumulative vote total, not per-tournament
