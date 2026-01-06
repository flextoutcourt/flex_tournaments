// lib/tracking.ts
/**
 * Comprehensive client-side tracking utility for ALL user interactions
 * Sends events to the server for logging
 */

export interface TrackingEvent {
  event: string;
  page?: string;
  context?: Record<string, any>;
  timestamp?: number;
  elementType?: string;
  elementId?: string;
  elementText?: string;
}

let trackingQueue: TrackingEvent[] = [];
let trackingTimer: NodeJS.Timeout | null = null;
let isTrackingEnabled = true;
let lastClickTime = 0;
let lastClickTarget: string | null = null;

/**
 * Send queued events to server
 */
async function flushTrackingQueue() {
  if (trackingQueue.length === 0) return;

  const events = [...trackingQueue];
  trackingQueue = [];
  trackingTimer = null;

  try {
    await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true, // Keep connection alive
    });
  } catch (error) {
    // Silently re-queue failed events without logging
    trackingQueue = [...events, ...trackingQueue];
  }
}

/**
 * Queue a tracking event
 * Batches events and sends them to server
 */
export function trackEvent(event: TrackingEvent) {
  if (!isTrackingEnabled) return;

  // Add timestamp if not provided
  if (!event.timestamp) {
    event.timestamp = Date.now();
  }

  // Add current page if not provided
  if (!event.page && typeof window !== 'undefined') {
    event.page = window.location.pathname;
  }

  trackingQueue.push(event);

  // Clear existing timer
  if (trackingTimer) {
    clearTimeout(trackingTimer);
  }

  // Set new timer to flush after 3 seconds or when queue gets large
  if (trackingQueue.length >= 15) {
    flushTrackingQueue();
  } else {
    trackingTimer = setTimeout(flushTrackingQueue, 3000);
  }
}

/**
 * Manually flush remaining events
 */
export async function flushEvents() {
  await flushTrackingQueue();
}

/**
 * Enable/disable tracking
 */
export function setTrackingEnabled(enabled: boolean) {
  isTrackingEnabled = enabled;
}

/**
 * Setup global click tracking on all elements
 */
export function setupGlobalClickTracking() {
  if (typeof window === 'undefined') return;

  // Track all clicks
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // Skip tracking certain elements
    if (target.tagName === 'HTML' || target.tagName === 'BODY') return;
    if (target.classList.contains('no-track')) return;

    // Only track clicks on meaningful elements
    const trackedTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    let element: HTMLElement | null = target;
    let found = false;

    // Look for tracked element in target or parents
    for (let i = 0; i < 5; i++) {
      if (!element) break;
      if (trackedTags.includes(element.tagName)) {
        found = true;
        break;
      }
      // Also check for role-based elements
      if (element.getAttribute('role') === 'button' || element.getAttribute('role') === 'link') {
        found = true;
        break;
      }
      element = element.parentElement;
    }

    if (!found) return; // Skip generic div/span clicks

    // Debounce: ignore duplicate clicks on same element within 100ms
    const now = Date.now();
    const clickId = target.id || target.className || target.tagName;
    if (now - lastClickTime < 100 && clickId === lastClickTarget) {
      return;
    }
    lastClickTime = now;
    lastClickTarget = clickId;

    // Get element info
    const elementInfo: Record<string, any> = {
      tag: target.tagName.toLowerCase(),
    };

    if (target.id) elementInfo.id = target.id;
    if (target.className) elementInfo.class = target.className;
    if (target.getAttribute('data-track')) elementInfo.dataTrack = target.getAttribute('data-track');

    // Get text content (limited)
    const text = target.textContent?.trim().slice(0, 100);
    if (text && text.length > 0 && text.length < 100) {
      elementInfo.text = text;
    }

    // Get parent button/link if clicked on child
    const parent = target.closest('button, a, [role="button"], [role="link"]') as HTMLElement | null;
    if (parent && parent !== target) {
      elementInfo.parentTag = parent.tagName.toLowerCase();
      if (parent.id) elementInfo.parentId = parent.id;
    }

    trackEvent({
      event: 'click',
      context: elementInfo,
    });
  }, true); // Use capture phase to catch all events

  // Track form input changes (on change event only, not on every keystroke)
  document.addEventListener('change', (e: Event) => {
    // Disabled - causes too many requests during re-renders
    // const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    // if (!target) return;
    // if (target.classList.contains('no-track')) return;

    // trackEvent({
    //   event: 'form_input_changed',
    //   context: {
    //     tag: target.tagName.toLowerCase(),
    //     type: (target as HTMLInputElement).type || 'unknown',
    //     id: target.id,
    //     name: target.name,
    //     hasValue: !!target.value,
    //   },
    // });
  }, true);

  // Track focus events (field entered)
  document.addEventListener('focus', (e: FocusEvent) => {
    // Disabled - causes too many requests
    // const target = e.target as HTMLElement;
    // if (!target) return;
    // if (target.classList.contains('no-track')) return;

    // const formElements = ['INPUT', 'TEXTAREA', 'SELECT'];
    // if (formElements.includes(target.tagName)) {
    //   trackEvent({
    //     event: 'form_focus',
    //     context: {
    //       tag: target.tagName.toLowerCase(),
    //       id: target.id,
    //       type: (target as HTMLInputElement).type || 'unknown',
    //     },
    //   });
    // }
  }, true);

  // Track blur events (field left)
  document.addEventListener('blur', (e: FocusEvent) => {
    // Disabled - causes too many requests
    // const target = e.target as HTMLElement;
    // if (!target) return;
    // if (target.classList.contains('no-track')) return;

    // const formElements = ['INPUT', 'TEXTAREA', 'SELECT'];
    // if (formElements.includes(target.tagName)) {
    //   trackEvent({
    //     event: 'form_blur',
    //     context: {
    //       tag: target.tagName.toLowerCase(),
    //       id: target.id,
    //     },
    //   });
    // }
  }, true);

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    // Disabled - causes too many requests
    // trackEvent({
    //   event: document.hidden ? 'page_hidden' : 'page_visible',
    // });
  });

  // Flush remaining events on page unload
  window.addEventListener('beforeunload', () => {
    if (trackingQueue.length > 0) {
      // Use sendBeacon for reliability on page unload
      navigator.sendBeacon(
        '/api/tracking',
        JSON.stringify({ events: trackingQueue })
      );
    }
  });
}

/**
 * Track page/route changes
 */
export function trackPageChange(pathname: string, previousPathname?: string) {
  trackEvent({
    event: 'page_navigation',
    context: {
      to: pathname,
      from: previousPathname,
    },
  });
}
