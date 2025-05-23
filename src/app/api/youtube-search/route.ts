// app/api/Youtube/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('YouTube API key is not configured');
    return NextResponse.json({ error: 'Configuration serveur incorrecte.' }, { status: 500 });
  }
  if (!query) {
    return NextResponse.json({ error: 'Terme de recherche manquant.' }, { status: 400 });
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
  });

  try {
    console.log(`Recherche YouTube pour: "${query}"`);
    const response = await youtube.search.list({
      part: ['snippet'], // Demande les informations de base (titre, description, miniature)
      q: query,          // Le terme de recherche
      type: ['video', 'channel'], // Cherche des vidéos ET des chaînes
      maxResults: 10,      // Limite le nombre de résultats
    });

    // Formatte les résultats pour le frontend
    const items = response.data.items?.map((item: any) => ({
      id: item.id?.videoId || item.id?.channelId || '',
      title: item.snippet?.title || 'Sans Titre',
      thumbnail: item.snippet?.thumbnails?.default?.url || '',
      channelTitle: item.snippet?.channelTitle || '',
      url: item.id?.videoId
        ? `https://www.youtube.com/watch?v=${item.id.videoId}`
        : item.id?.channelId
          ? `https://www.youtube.com/channel/${item.id.channelId}`
          : '#', // Fallback
      kind: item.id?.kind?.replace('youtube#', '') || 'unknown',
    })) || [];

    console.log(`Trouvé ${items.length} résultats.`);
    return NextResponse.json(items);

  } catch (error: any) {
    console.error('Erreur API YouTube:', error.message);
    return NextResponse.json({ error: 'Erreur lors de la recherche YouTube.', details: error.message }, { status: 500 });
  }
}