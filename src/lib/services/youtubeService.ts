/**
 * YouTube API Service - Manages YouTube IFrame API loading and initialization
 * Handles script loading, API readiness, and player lifecycle
 */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    isYouTubeApiReadyState?: boolean;
  }
}

export class YouTubeService {
  private static isLoading = false;
  private static isReady = false;
  private static readyListeners: ((ready: boolean) => void)[] = [];

  /**
   * Load YouTube IFrame API script
   */
  static loadAPI(): Promise<boolean> {
    return new Promise((resolve) => {
      // Already loaded
      if (typeof window !== 'undefined' && window.YT?.Player) {
        this.isReady = true;
        resolve(true);
        return;
      }

      // Already loading
      if (this.isLoading) {
        const listener = (ready: boolean) => {
          if (ready) {
            this.removeListener(listener);
            resolve(true);
          }
        };
        this.addListener(listener);
        return;
      }

      this.isLoading = true;

      // Setup ready callback
      window.onYouTubeIframeAPIReady = () => {
        this.isReady = true;
        window.isYouTubeApiReadyState = true;
        this.notifyListeners(true);
        window.dispatchEvent(new Event('youtubeApiReadyEvent'));
        resolve(true);
      };

      // Load script
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.error('[YouTubeService] Failed to load YouTube API');
        this.isLoading = false;
        this.notifyListeners(false);
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Check if YouTube API is ready
   */
  static isAPIReady(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.YT?.Player
    );
  }

  /**
   * Create a YouTube player
   */
  static createPlayer(
    containerId: string,
    videoId: string,
    options?: any
  ): Promise<YT.Player> {
    return new Promise((resolve, reject) => {
      if (!this.isAPIReady()) {
        reject(new Error('YouTube API not ready'));
        return;
      }

      try {
        const player = new window.YT.Player(containerId, {
          videoId,
          host: 'https://www.youtube.com',
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            ...options?.playerVars,
          },
          events: {
            onReady: () => resolve(player),
            onError: (error: any) =>
              reject(new Error(`YouTube player error: ${error.data}`)),
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Add API ready listener
   */
  static addListener(listener: (ready: boolean) => void): void {
    this.readyListeners.push(listener);
    if (this.isReady) {
      listener(true);
    }
  }

  /**
   * Remove API ready listener
   */
  static removeListener(listener: (ready: boolean) => void): void {
    this.readyListeners = this.readyListeners.filter((l) => l !== listener);
  }

  /**
   * Notify all listeners of API state change
   */
  private static notifyListeners(ready: boolean): void {
    this.readyListeners.forEach((listener) => listener(ready));
  }
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
