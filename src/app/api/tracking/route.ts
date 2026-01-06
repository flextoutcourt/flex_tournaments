// app/api/tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';

interface TrackingEvent {
  event: string;
  page?: string;
  context?: Record<string, any>;
  timestamp?: number;
}

interface TrackingPayload {
  events: TrackingEvent[];
}

/**
 * POST /api/tracking
 * Receive and log user tracking events
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = (await request.json()) as TrackingPayload;

    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json(
        { error: 'Invalid tracking payload' },
        { status: 400 }
      );
    }

    // Skip tracking for superadmins
    if (session?.user?.role === 'SUPERADMIN') {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Get IP and user agent once for all events
    const ipAddress = getIpFromRequest(request);
    const userAgent = getUserAgentFromRequest(request);

    // Log each event
    for (const trackingEvent of body.events) {
      // Map tracking event names to activity log actions
      const actionMap: Record<string, string> = {
        // Page and navigation
        page_view: 'page_viewed',
        page_navigation: 'page_navigated',
        page_scroll: 'page_scrolled',
        page_visible: 'page_became_visible',
        page_hidden: 'page_became_hidden',
        app_initialized: 'app_initialized',
        
        // Clicks and interactions
        click: 'element_clicked',
        
        // Form interactions
        form_input_changed: 'form_input_changed',
        form_focus: 'form_field_focused',
        form_blur: 'form_field_blurred',
        form_submitted: 'form_submitted',
        
        // Tournament specific
        tournament_category_selected: 'tournament_category_selected',
        
        // Other interactions
        modal_opened: 'modal_opened',
      };

      const action = actionMap[trackingEvent.event] || `user_${trackingEvent.event}`;

      await logActivity({
        userId: session?.user?.id || null,
        action,
        description: buildDescription(trackingEvent),
        entityType: trackingEvent.context?.entityType,
        entityId: trackingEvent.context?.entityId,
        ipAddress,
        userAgent,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silently fail without logging to avoid stack frame spam
    return NextResponse.json(
      { error: 'Failed to log tracking events' },
      { status: 500 }
    );
  }
}

/**
 * Build a human-readable description from tracking event
 */
function buildDescription(trackingEvent: TrackingEvent): string {
  const { event, page, context } = trackingEvent;

  const descriptions: Record<string, () => string> = {
    // Page and navigation
    page_view: () => `Page consultée: ${page}`,
    page_navigation: () => `Navigation: ${context?.from} → ${context?.to}`,
    page_scroll: () => `Scroll: Y=${context?.scrollY}`,
    page_visible: () => `Page devenue visible`,
    page_hidden: () => `Page cachée`,
    app_initialized: () => `Application initialisée`,
    
    // Clicks
    click: () => {
      const tag = context?.tag || 'element';
      const text = context?.text ? `: "${context.text}"` : '';
      return `Clic sur <${tag}>${text}`;
    },
    
    // Form interactions
    form_input_changed: () => `Champ modifié: <${context?.tag}> (${context?.type || 'unknown'})`,
    form_keyup: () => `Texte saisi: <${context?.tag}> - Touche: ${context?.key}`,
    form_focus: () => `Champ ciblé: <${context?.tag}>`,
    form_blur: () => `Champ quitté: <${context?.tag}>`,
    form_submitted: () => `Formulaire soumis - Item: "${context?.itemName || 'N/A'}"`,
    
    // Tournament
    tournament_category_selected: () => `Catégorie sélectionnée: ${context?.category} (${context?.itemCount} items)`,
    
    // Other
    modal_opened: () => `Modal ouverte: ${context?.modalName || 'N/A'}`,
  };

  const builder = descriptions[event];
  if (builder) {
    return builder();
  }

  // Generic description
  return `Interaction: ${event}`;
}
