/**
 * SSE (Server-Sent Events) based vote broadcasting system
 * Uses in-memory room management with callbacks for lightweight pub/sub
 * No external dependencies required!
 */

export interface VoteMessage {
  userId?: string;
  username?: string;
  vote: string;
  ts?: number;
}

export interface BroadcastVote extends VoteMessage {
  tournamentId: string;
  timestamp: number;
}

type ResponseCallback = (data: string) => void;

// Rooms: tournamentId -> Set of response write callbacks
const rooms = new Map<string, Set<ResponseCallback>>();
let totalMessagesEnqueuedRef = 0; // Global counter for debugging

/**
 * Subscribe a client response to a tournament room
 * Returns a function to unsubscribe
 */
export function subscribeToRoom(
  tournamentId: string,
  callback: ResponseCallback
): () => void {
  if (!rooms.has(tournamentId)) {
    rooms.set(tournamentId, new Set());
  }
  const room = rooms.get(tournamentId)!;
  room.add(callback);

  console.log(
    `[SSE] Client subscribed to tournament: ${tournamentId} (clients: ${room.size})`
  );

  // Return unsubscribe function
  return () => {
    room.delete(callback);
    console.log(
      `[SSE] Client unsubscribed from tournament: ${tournamentId} (clients: ${room.size})`
    );
    if (room.size === 0) {
      rooms.delete(tournamentId);
    }
  };
}

/**
 * Broadcast a vote to all subscribers in a tournament room (SSE)
 */
export function broadcastVote(vote: BroadcastVote): void {
  const room = rooms.get(vote.tournamentId);
  
  if (!room || room.size === 0) {
    console.log(
      `[SSE] ❌ NO CLIENTS: vote ${vote.vote} dropped for tournament: ${vote.tournamentId}`
    );
    return;
  }

  const eventData = JSON.stringify({
    type: 'vote',
    data: vote,
  });

  // SSE format: "data: {json}\n\n"
  const message = `data: ${eventData}\n\n`;

  let successCount = 0;
  const failedCallbacks: ResponseCallback[] = [];

  room.forEach((callback) => {
    try {
      totalMessagesEnqueuedRef++;
      callback(message);
      successCount++;
      console.log(`[SSE] Message #${totalMessagesEnqueuedRef} enqueued`);
    } catch (err) {
      console.error('[SSE] Error sending vote:', err);
      failedCallbacks.push(callback);
    }
  });

  // Clean up failed callbacks (client likely disconnected)
  failedCallbacks.forEach((cb) => room.delete(cb));

  if (successCount === 0) {
    console.log(`[SSE] ❌ FAILED TO SEND: vote ${vote.vote} to ${room.size} clients`);
  } else {
    console.log(
      `[SSE] ✅ BROADCAST: vote ${vote.vote} -> ${successCount}/${room.size} clients`
    );
  }
}

/**
 * Clean up stale rooms and reset counters periodically
 * This helps prevent memory leaks from accumulated callbacks
 */
export function cleanupSSEResources() {
  let cleanedRooms = 0;
  
  for (const [tournamentId, room] of rooms.entries()) {
    if (room.size === 0) {
      rooms.delete(tournamentId);
      cleanedRooms++;
    }
  }
  
  // Log stats if any cleanup occurred
  if (cleanedRooms > 0) {
    console.log(`[SSE] Cleaned up ${cleanedRooms} empty rooms`);
  }
  
  const stats = getSSEStats();
  if (stats.totalRooms > 0) {
    console.log(`[SSE] Active resources:`, stats);
  }
}

/**
 * Get stats about connected clients (useful for debugging)
 */
export function getSSEStats() {
  const roomStats = Array.from(rooms.entries()).map(([tournamentId, clients]) => ({
    tournamentId,
    clientCount: clients.size,
  }));
  
  return {
    totalRooms: rooms.size,
    totalClients: Array.from(rooms.values()).reduce((sum, room) => sum + room.size, 0),
    rooms: roomStats,
    totalMessagesEnqueued: totalMessagesEnqueuedRef,
  };
}
