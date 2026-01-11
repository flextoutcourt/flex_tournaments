import { NextRequest, NextResponse } from 'next/server';
import { subscribeToRoom } from '@/server/sse';

/**
 * GET /api/votes/[tournamentId]/subscribe
 *
 * Server-Sent Events (SSE) endpoint for receiving votes in real-time
 * Clients connect here and receive a stream of vote events
 *
 * Usage:
 * const eventSource = new EventSource('/api/votes/tournament-123/subscribe');
 * eventSource.addEventListener('message', (event) => {
 *   const { type, data } = JSON.parse(event.data);
 *   if (type === 'vote') console.log('Vote:', data);
 * });
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tournamentId: string }>;
  }
) {
  try {
    const { tournamentId } = await params;

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'tournamentId is required' },
        { status: 400 }
      );
    }

    // Create a custom encoder for SSE
    const encoder = new TextEncoder();
    let isClosed = false;

    // Create a readable stream for SSE
    const customReadable = new ReadableStream({
      start(controller) {
        // Callback to send messages - with error handling
        const sendMessage = (data: string) => {
          if (isClosed) {
            return;
          }
          
          try {
            // Ensure proper SSE formatting with newline terminators
            const formatted = data.endsWith('\n\n') ? data : `${data}\n\n`;
            const encoded = encoder.encode(formatted);
            controller.enqueue(encoded);
          } catch (err) {
            console.error('[SSE] ❌ Error enqueueing message:', err);
            isClosed = true;
            try {
              controller.close();
            } catch (closeErr) {
              console.error('[SSE] Error closing after message error:', closeErr);
            }
          }
        };

        // Subscribe to room
        const unsubscribe = subscribeToRoom(tournamentId, sendMessage);

        // Send initial keepalive message to confirm connection is live
        const initMessage = `data: ${JSON.stringify({
          type: 'connected',
          t: Date.now(),
        })}\n\n`;
        
        sendMessage(initMessage);

        // Handle stream closure properly
        const closeHandler = () => {
          console.log(
            `[SSE] Client closing stream for tournament: ${tournamentId}`
          );
          isClosed = true;
          unsubscribe();
          try {
            controller.close();
          } catch (err) {
            console.error('[SSE] Error closing controller:', err);
          }
        };

        request.signal.addEventListener('abort', closeHandler);
      },
    });

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[SSE] Error setting up stream:', error);
    return NextResponse.json(
      { error: 'Failed to establish SSE connection' },
      { status: 500 }
    );
  }
}
