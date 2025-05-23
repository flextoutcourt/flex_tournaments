// app/tournament/[id]/live/utils/youtubeUtils.ts
import { YOUTUBE_API_SCRIPT_URL } from '../constants';

export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function loadYouTubeAPIScript() {
  if (typeof window === 'undefined') return;

  if (typeof window.onYouTubeIframeAPIReady !== 'function') {
    window.onYouTubeIframeAPIReady = () => {
      console.log(`GLOBAL: onYouTubeIframeAPIReady (from ${YOUTUBE_API_SCRIPT_URL}) a été appelée.`);
      window.isYouTubeApiReadyState = true;
      window.dispatchEvent(new Event('youtubeApiReadyEvent'));
      console.log(`GLOBAL: Événement 'youtubeApiReadyEvent' distribué.`);
    };
  }

  if (!document.querySelector(`script[src="${YOUTUBE_API_SCRIPT_URL}"]`)) {
    const tag = document.createElement('script');
    tag.src = YOUTUBE_API_SCRIPT_URL;
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      console.log(`GLOBAL: Ajout du script API YouTube : ${YOUTUBE_API_SCRIPT_URL}`);
    } else {
      document.head.appendChild(tag);
      console.log(`GLOBAL: Ajout du script API YouTube (fallback sur head) : ${YOUTUBE_API_SCRIPT_URL}`);
    }
  } else {
    console.log(`GLOBAL: Le script API YouTube ${YOUTUBE_API_SCRIPT_URL} est déjà présent.`);
    if (typeof YT !== 'undefined' && YT.Player && !window.isYouTubeApiReadyState) {
      console.log("GLOBAL: Objet YT existe mais le drapeau isYouTubeApiReadyState n'est pas défini. Définition et distribution de l'événement.");
      window.isYouTubeApiReadyState = true;
      window.dispatchEvent(new Event('youtubeApiReadyEvent'));
    }
  }
}