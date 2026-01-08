#!/usr/bin/env node

/**
 * Test script for voting system
 * Tests both the vote ingestion endpoint and SSE subscription
 *
 * Usage:
 * node test-votes.js          # Send 10 votes (default 5ms delay)
 * node test-votes.js 50       # Send 50 votes
 * node test-votes.js 100 fast # Send 100 votes as fast as possible (1ms delay)
 * node test-votes.js 100 0    # Send 100 votes with no delay
 */

const http = require('http');

const tournamentId = 'cmk4ofvl0001qc7o4evyqre91';
const baseUrl = 'http://localhost:3000';
const voteCount = parseInt(process.argv[2] || '10', 10);

// Parse speed argument: 'fast' = 1ms, 'instant' or '0' = 0ms, or number for custom ms
let delayMs = 5; // default 5ms
if (process.argv[3]) {
  if (process.argv[3] === 'fast') {
    delayMs = 1;
  } else if (process.argv[3] === 'instant' || process.argv[3] === '0') {
    delayMs = 0;
  } else {
    delayMs = parseInt(process.argv[3], 10) || 5;
  }
}

const voteOptions = ['1', '2'];
let successCount = 0;
let errorCount = 0;

function sendVote(index) {
  return new Promise((resolve) => {
    const vote = voteOptions[Math.floor(Math.random() * voteOptions.length)];
    const username = `user_${Math.floor(Math.random() * 1000)}`;

    const payload = JSON.stringify({
      vote,
      username,
      userId: `user-${index}`,
      ts: Date.now(),
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/votes/${tournamentId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          successCount++;
          console.log(
            `[${index + 1}/${voteCount}] ✓ Vote sent: ${vote} by ${username}`
          );
        } else {
          errorCount++;
          console.error(
            `[${index + 1}/${voteCount}] ✗ Error: ${res.statusCode} - ${data}`
          );
        }

        resolve();
      });
    });

    req.on('error', (err) => {
      errorCount++;
      console.error(
        `[${index + 1}/${voteCount}] ✗ Network error: ${err.message}`
      );
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function runTest() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║        Vote System Test                              ║
╚══════════════════════════════════════════════════════╝

Tournament ID: ${tournamentId}
Base URL:     ${baseUrl}
Votes to send: ${voteCount}
Delay/vote:   ${delayMs}ms

Starting in 1 second...
`);

  await new Promise((r) => setTimeout(r, 1000));

  const startTime = Date.now();
  console.log('Sending votes...\n');

  // Send votes sequentially
  for (let i = 0; i < voteCount; i++) {
    await sendVote(i);
    // Delay between requests (configurable)
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  const duration = Date.now() - startTime;

  console.log(`
╔══════════════════════════════════════════════════════╗
║        Test Results                                  ║
╚══════════════════════════════════════════════════════╝

Success:  ${successCount}
Errors:   ${errorCount}
Duration: ${duration}ms
Rate:     ${(voteCount / (duration / 1000)).toFixed(2)} votes/sec

NEXT STEP:
In another terminal, test the SSE subscription:
  
  curl -N http://localhost:3000/api/votes/${tournamentId}/subscribe

This will stream live vote events to your terminal.
`);
}

runTest().catch(console.error);
